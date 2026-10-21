import 'server-only'
import { stamp } from '@/lib/data/hackathon'
import { appendRows, rows, updateRow } from '@/lib/store'

type Links = { github: string; linkedin: string; portfolio: string }

/**
 * Copies a founder's links to the Profiles tab, on their own row, so the team
 * can read every GitHub and LinkedIn in one place. Starts the row if the tab
 * does not list them yet.
 */
export async function writeProfileLinks(who: { email: string; name: string }, links: Links) {
  const cells = {
    GitHub: links.github,
    LinkedIn: links.linkedin,
    Portfolio: links.portfolio,
    'Updated at': stamp(new Date()),
  }
  const mine = (await rows('profiles')).find(
    (item) => item.cells.Email.trim().toLowerCase() === who.email,
  )
  if (mine) await updateRow('profiles', mine.row, cells)
  else await appendRows('profiles', [{ Name: who.name, Email: who.email, ...cells }])
}
