/**
 * Text with blanks to fill. Anything written [like this] in the plan shows
 * in italics with a dotted line, without the brackets: their own words go there.
 */
export function Fill({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]*\])/)
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('[') && part.endsWith(']') ? (
          <em
            key={index}
            className="text-ink-1 decoration-ink-3 italic underline decoration-dotted underline-offset-4"
          >
            {part.slice(1, -1)}
          </em>
        ) : (
          part
        ),
      )}
    </>
  )
}
