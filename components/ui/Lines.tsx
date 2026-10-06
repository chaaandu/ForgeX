/**
 * A heading of two or more sentences, each on its own line. Line breaks in a
 * heading are part of what it says, so they are set here on purpose rather
 * than left to wherever the screen width happens to fall.
 */
export function Lines({ text }: { text: string }) {
  const parts = text.split(/(?<=[.?])\s+/)
  return (
    <>
      {parts.map((part, index) => (
        <span key={index} className="block">
          {part}
        </span>
      ))}
    </>
  )
}
