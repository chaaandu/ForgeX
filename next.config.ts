import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // A separate build folder lets a production server for measurement run
  // beside the dev server without either overwriting the other.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  reactStrictMode: true,
  devIndicators: false,
  // Files read from disk at run time, which the tracer cannot see on its own:
  // the card image's fonts, photos and relics, and the bank for mock seeding.
  outputFileTracingIncludes: {
    '/api/card/[slug]': ['./assets/fonts/**', './public/students/**', './public/relics/**'],
    '/**': ['./data/problems.json', './data/problems.internal.json'],
  },
  images: {
    // Served as they are. The photos (450px webp, about 16 KB) and the art are
    // already small, and Vercel bills every resize; a resize saves little here.
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' }],
  },
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
}

export default nextConfig
