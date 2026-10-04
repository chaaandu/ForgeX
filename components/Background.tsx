/**
 * Three blurred radial gradients and a grain overlay, fixed and static.
 * Nothing here animates and nothing here is interactive.
 */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-[20%] -left-[15%] h-[70vh] w-[70vw] rounded-full blur-[140px]"
        style={{
          background: 'radial-gradient(circle, #312E81 0%, transparent 70%)',
          opacity: 0.25,
        }}
      />
      <div
        className="absolute top-[25%] -right-[20%] h-[65vh] w-[60vw] rounded-full blur-[150px]"
        style={{
          background: 'radial-gradient(circle, #134E4A 0%, transparent 70%)',
          opacity: 0.18,
        }}
      />
      <div
        className="absolute -bottom-[25%] left-[20%] h-[60vh] w-[65vw] rounded-full blur-[150px]"
        style={{
          background: 'radial-gradient(circle, #4C1D95 0%, transparent 70%)',
          opacity: 0.15,
        }}
      />
      <svg className="absolute inset-0 h-full w-full" style={{ opacity: 0.04 }}>
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  )
}
