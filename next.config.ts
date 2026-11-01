import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Next.js 16 stable Cache Components (successor to experimental.ppr).
  // Enables the `use cache` directive, `cacheLife` profiles and `cacheTag`.
  cacheComponents: true,
  partialPrefetching: false, // Preserve existing Cache Components behavior during migration.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://vercel.com; font-src 'self'; connect-src 'self' https://vitals.vercel-insights.com https://vercel.live; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'",
          },
        ],
      },
    ]
  },
  images: {
    // `images.domains` was removed in Next 16 in favour of `remotePatterns`.
    remotePatterns: [{ protocol: 'https', hostname: 'vercel.com' }],
  },
}

export default nextConfig
