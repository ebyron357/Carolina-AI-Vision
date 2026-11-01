import '@fontsource-variable/inter'
import '@/styles/globals.css'
import '@/styles/carolina.css'
import type { Metadata } from 'next'
import { siteConfig } from '@/constants/site-config'
import { Header, Footer } from '@/components/site-shell'
import { Analytics } from '@vercel/analytics/react'
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Carolina Local AI | Get Found. Get Customers. Grow Smarter.',
    template: '%s | Carolina Local AI',
  },
  description: siteConfig.description,
  robots: {
    index: process.env.VERCEL_ENV !== 'preview',
    follow: process.env.VERCEL_ENV !== 'preview',
  },
  icons: { icon: '/logo/carolina.svg' },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: 'website',
    locale: 'en_US',
  },
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Header />
        {children}
        <Footer />
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && <Analytics />}
      </body>
    </html>
  )
}
