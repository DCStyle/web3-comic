import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings/get-settings'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const settings = await getSettings()
    const baseUrl = settings.canonical_url_base || 'https://web3comics.com'
    const isMaintenanceMode = settings.maintenance_mode || false
    
    if (isMaintenanceMode) {
      // Minimal sitemap during maintenance
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
      
      return new NextResponse(sitemap, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }

    // Generate full sitemap
    const urls: Array<{
      loc: string
      lastmod: string
      changefreq: string
      priority: string
    }> = []

    // Homepage
    urls.push({
      loc: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0'
    })

    // Static pages
    const staticPages = [
      { path: '/comics', priority: '0.9', changefreq: 'daily' },
      { path: '/genres', priority: '0.8', changefreq: 'weekly' },
      { path: '/featured', priority: '0.8', changefreq: 'daily' },
    ]

    staticPages.forEach(page => {
      urls.push({
        loc: `${baseUrl}${page.path}`,
        lastmod: new Date().toISOString(),
        changefreq: page.changefreq,
        priority: page.priority
      })
    })

    // Get all published comics
    const comics = await prisma.comic.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Add comic pages
    comics.forEach(comic => {
      urls.push({
        loc: `${baseUrl}/comics/${comic.slug}`,
        lastmod: comic.updatedAt.toISOString(),
        changefreq: 'weekly',
        priority: '0.7'
      })
    })

    // Get all genres (from tags that are actually used)
    const genres = await prisma.tag.findMany({
      select: {
        name: true,
      },
      where: {
        comics: {
          some: {}
        }
      }
    })

    // Add genre pages
    genres.forEach(genre => {
      const slug = genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      urls.push({
        loc: `${baseUrl}/genres/${slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.6'
      })
    })

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback sitemap
    const settings = await getSettings().catch(() => ({}))
    const baseUrl = settings.canonical_url_base || 'https://web3comics.com'
    
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
    
    return new NextResponse(fallbackSitemap, {
      headers: { 'Content-Type': 'application/xml' },
    })
  }
}