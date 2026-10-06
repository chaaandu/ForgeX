import 'server-only'

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

export function responseEmail(input: { first: string; title: string; status: string; note: string; url: string }) {
  const subject = `ForgeX: we read your why for ${input.title}`
  const text = `Hi ${input.first},\n\nWe've answered your why for "${input.title}": ${input.status}.\n\n${input.note ? `${input.note}\n\n` : ''}Read it on your page: ${input.url}\n\nThe ForgeX team`
  const html = `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5;color:#111;max-width:520px">
<p>Hi ${escape(input.first)},</p>
<p>We've answered your why for <strong>${escape(input.title)}</strong>: <strong>${escape(input.status)}</strong>.</p>
${input.note ? `<p style="white-space:pre-line">${escape(input.note)}</p>` : ''}
<p><a href="${escape(input.url)}" style="color:#c2187a">Read it on your page</a></p>
<p>The ForgeX team</p></div>`
  return { subject, text, html }
}
