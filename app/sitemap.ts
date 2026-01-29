import { MetadataRoute } from 'next'
import details from '@/config/details.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = details.store.fullDomain
  const locales = ['en', 'bn']
  
  // Core pages
  const pages = ['', 'items', 'about', 'contact', 'terms']
  
  const urls: MetadataRoute.Sitemap = []
  
  // Generate URLs for each locale
  locales.forEach(locale => {
    pages.forEach(page => {
      urls.push({
        url: `${baseUrl}/${locale}${page ? `/${page}` : ''}`,
        lastModified: new Date(),
        changeFrequency: page === 'items' ? 'weekly' : page === '' ? 'daily' : 'monthly',
        priority: page === '' ? 1 : page === 'items' ? 0.8 : 0.6,
      })
    })
  })
  
  return urls
}
