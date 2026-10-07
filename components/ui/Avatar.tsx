import Image from 'next/image'

/**
 * A founder's face in a circle, on the same ground as their tile on the wall.
 * The photos are cut-outs, so without a ground behind them they float.
 */
export function Avatar({ src, size, className = '' }: { src: string; size: number; className?: string }) {
  return (
    <span
      className={`bg-s2 relative inline-block shrink-0 overflow-hidden rounded-full shadow-[inset_0_0_0_1px_var(--color-line)] ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt=""
        width={size * 2}
        height={size * 2}
        className="absolute inset-x-0 top-[8%] h-[115%] w-full object-cover object-top"
      />
    </span>
  )
}
