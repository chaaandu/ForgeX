/** How much evidence stands behind a problem, one to five bars. */
export function Signal({ strength, label }: { strength: number; label: string }) {
  return (
    <span className="inline-flex items-end gap-[3px]" role="img" aria-label={label}>
      {[5, 7, 9, 11, 14].map((height, index) => (
        <span
          key={height}
          className="w-1 rounded-[1px]"
          style={{
            height,
            background: index < strength ? 'var(--color-ink-1)' : 'var(--color-s3)',
          }}
        />
      ))}
    </span>
  )
}
