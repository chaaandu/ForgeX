'use client'

import * as Slider from '@radix-ui/react-slider'
import { world as copy } from '@/content/copy'

/**
 * Tech comfort, one to five. Five stops with a plain sentence under each, so
 * there is nothing to type and no wrong place to land.
 */
export function ComfortSlider({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const stops = copy.comfort.stops
  return (
    <div className="grid gap-6">
      <Slider.Root
        className="relative flex h-10 w-full touch-none items-center select-none"
        min={1}
        max={5}
        step={1}
        value={[value]}
        onValueChange={([next]) => next && onChange(next)}
        aria-label={copy.comfort.ask}
      >
        <Slider.Track className="bg-s3 relative h-1.5 grow rounded-full">
          <Slider.Range className="bg-violet absolute h-full rounded-full" />
        </Slider.Track>
        <Slider.Thumb
          className="press bg-ink-1 block size-8 cursor-grab rounded-full shadow-[0_0_0_6px_rgb(124_77_204/0.25),0_8px_20px_-6px_rgb(0_0_0/0.8)] active:cursor-grabbing"
          aria-valuetext={stops[value - 1]}
        />
      </Slider.Root>
      <div className="flex justify-between" aria-hidden="true">
        {stops.map((_, index) => (
          <span
            key={index}
            className="meta w-6 text-center"
            style={{ color: index + 1 === value ? 'var(--color-violet-ink)' : undefined }}
          >
            {index + 1}
          </span>
        ))}
      </div>
      <p
        className="display m-0 min-h-[2.4em] text-[clamp(22px,2.6vw,30px)] leading-tight"
        aria-live="polite"
      >
        {stops[value - 1]}
      </p>
    </div>
  )
}
