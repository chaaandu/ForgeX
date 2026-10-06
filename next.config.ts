import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' }],
  },
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
}

export default nextConfig
