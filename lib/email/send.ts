import 'server-only'
import { email, page } from '@/content/copy'
import type { ResponseType } from '@/lib/data/picks'

/**
 * Response emails, through Resend's HTTP API. Without RESEND_API_KEY nothing
 * is sent and nothing fails: the response is still on the founder's page,
 * which is where it lives; the email is only the knock on the door.
 */
export async function sendEmail(message: { to: string; subject: string; text: string; html: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!key || !from) {
    console.info(`[email skipped: no RESEND_API_KEY] ${message.subject} → ${message.to}`)
    return false
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to: [message.to], subject: message.subject, text: message.text, html: message.html }),
  })
  if (!response.ok) console.error(`Resend failed: ${response.status} ${await response.text().catch(() => '')}`)
  return response.ok
}

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char)

export function responseEmail(input: {
  first: string
  title: string
  type: ResponseType
  note: string
  url: string
}) {
  const subject = email.subject[input.type](input.title)
  const headline = page.headline[input.type]
  const parts = [email.hi(input.first), headline, input.note, `${email.readMore} ${input.url}`, email.signOff].filter(Boolean)
  const text = parts.join('\n\n')
  const html = `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5;color:#111;max-width:520px">
<p>${escape(email.hi(input.first))}</p>
<p><strong>${escape(headline)}</strong></p>
${input.note ? `<p style="white-space:pre-line">${escape(input.note)}</p>` : ''}
<p>${escape(email.readMore)} <a href="${escape(input.url)}" style="color:#c2187a">${escape(input.url)}</a></p>
<p>${escape(email.signOff)}</p></div>`
  return { subject, text, html }
}
