import { WallFace, type Face } from '@/components/card/WallFace'
import { wall as copy } from '@/content/copy'
import '@/components/card/card.css'

/**
 * The founder wall: every face that has not asked to be left off, as a grid of
 * small cards that drift and flip. Plain DOM on purpose: it is fast on a
 * mid-range Android, it is what the accessibility tree reads, and the first
 * row is the page's largest paint.
 */
export function Wall({ faces }: { faces: Face[] }) {
  return (
    <ul className="wall m-0 grid list-none content-start gap-1.5 px-3 pt-16 md:gap-2 md:px-6 md:pt-20" aria-label={copy.label}>
      {faces.map((face, index) => (
        <li key={face.photo} className="wall-cell" style={{ ['--i' as string]: index }}>
          <WallFace face={face} priority={index < 10} />
        </li>
      ))}
    </ul>
  )
}
