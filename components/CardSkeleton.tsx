export function CardSkeleton() {
  return (
    <div className="border-line bg-surface h-full rounded-[16px] border p-5">
      <div className="flex animate-pulse flex-col gap-3">
        <div className="h-5 w-20 rounded-full bg-white/[0.06]" />
        <div className="h-3 w-12 rounded bg-white/[0.05]" />
        <div className="h-5 w-4/5 rounded bg-white/[0.07]" />
        <div className="h-3 w-full rounded bg-white/[0.04]" />
        <div className="h-3 w-full rounded bg-white/[0.04]" />
        <div className="h-3 w-2/3 rounded bg-white/[0.04]" />
        <div className="mt-4 h-3 w-10 rounded bg-white/[0.05]" />
        <div className="h-3 w-3/4 rounded bg-white/[0.04]" />
        <div className="h-5 w-0" />
      </div>
    </div>
  )
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 12 }, (_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}
