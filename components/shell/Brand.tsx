import Image from 'next/image'
import Link from 'next/link'

export function Brand({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex shrink-0 items-center rounded-md" aria-label="Mesa School of Business, ForgeX">
      <Image src="/brand/mesa-logo.png" alt="" width={79} height={28} sizes="80px" className="h-7 w-[79px] max-w-none shrink-0" />
    </Link>
  )
}
