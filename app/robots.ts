import { MetadataRoute } from 'next'
import details from '@/config/details.json'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${details.store.fullDomain}/sitemap.xml`,
    host: details.store.fullDomain,
  }
}
