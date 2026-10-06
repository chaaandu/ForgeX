import Image from 'next/image'
import Link from 'next/link'

export function Brand({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center rounded-md" aria-label="Mesa School of Business, ForgeX 2.0">
      <Image src="/brand/mesa-logo.png" alt="" width={260} height={92} className="h-7 w-auto" priority />
    </Link>
  )
}
