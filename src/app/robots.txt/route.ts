import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings/get-settings'

export async function GET() {
  try {
    const settings = await getSettings()
    const baseUrl = settings.canonical_url_base || 'https://web3comics.com'
    const isMaintenanceMode = settings.maintenance_mode || false
    
    let robotsContent = ''
    
    if (isMaintenanceMode) {
      // Block all crawlers during maintenance
      robotsContent = `User-agent: *
Disallow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml`
    } else {
      // Normal robots.txt
      robotsContent = `User-agent: *
Allow: /

# Block admin and API routes
Disallow: /admin/
Disallow: /api/

# Block auth pages
Disallow: /connect-wallet

# Allow specific paths
Allow: /api/robots.txt
Allow: /api/sitemap.xml

# Crawl delay
Crawl-delay: 1

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml`
    }

    return new NextResponse(robotsContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating robots.txt:', error)
    return new NextResponse('User-agent: *\nDisallow: /', {
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}