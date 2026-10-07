/** A profile field's header: its emoji, hidden from screen readers, then its name. */
export function FieldHead({ icon, label }: { icon: string; label: string }) {
  return (
    <>
      <span aria-hidden="true" className="mr-1.5 inline-block not-italic">
        {icon}
      </span>
      {label}
    </>
  )
}
