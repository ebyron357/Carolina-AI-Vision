import type { MetadataRoute } from 'next'
import { siteConfig } from '@/constants/site-config'
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '',
    '/visibility',
    '/studio',
    '/studio/quote',
    '/consulting',
    '/consulting/request',
    '/about',
    '/privacy',
    '/terms',
  ].map((path) => ({ url: siteConfig.url + path }))
}
