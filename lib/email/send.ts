import 'server-only'
import { email } from '@/content/copy'

/**
 * Reply emails, through Resend's HTTP API. Without RESEND_API_KEY nothing
 * is sent and nothing fails: the reply is still in the founder's messages,
 * which is where it lives; the email is only the knock on the door.
 */
export async function sendEmail(message: {
  to: string
  subject: string
  text: string
  html: string
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!key || !from) {
    console.info(`[email skipped: no RESEND_API_KEY] ${message.subject} → ${message.to}`)
    return false
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  })
  if (!response.ok)
    console.error(`Resend failed: ${response.status} ${await response.text().catch(() => '')}`)
  return response.ok
}

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char,
  )

/** The knock on the door when the team answers a message. The answer itself is in the portal. */
export function replyEmail(input: { first: string; text: string; url: string }) {
  const subject = email.subject
  const parts = [
    email.hi(input.first),
    email.lead,
    input.text,
    `${email.readMore} ${input.url}`,
    email.signOff,
  ]
  const text = parts.join('\n\n')
  const html = `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5;color:#111;max-width:520px">
<p>${escape(email.hi(input.first))}</p>
<p>${escape(email.lead)}</p>
<p style="white-space:pre-line">${escape(input.text)}</p>
<p>${escape(email.readMore)} <a href="${escape(input.url)}" style="color:#7c4dcc">${escape(input.url)}</a></p>
<p>${escape(email.signOff)}</p></div>`
  return { subject, text, html }
}
