import { Metadata } from 'next'
import { getSettings } from '@/lib/settings/get-settings'

export async function generateSiteMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  
  const baseUrl = settings.canonical_url_base || 'https://web3comics.com'
  
  return {
    title: {
      default: settings.site_title || 'Web3 Comic Platform',
      template: settings.meta_title_template || '%s | Web3 Comic Platform'
    },
    description: settings.site_description || 'A decentralized comic reading platform with Web3 integration',
    keywords: settings.meta_keywords ? settings.meta_keywords.split(',').map((k: string) => k.trim()) : [],
    authors: [{ name: settings.site_title || 'Web3 Comic Platform' }],
    creator: settings.site_title || 'Web3 Comic Platform',
    publisher: settings.site_title || 'Web3 Comic Platform',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: baseUrl,
      title: settings.og_title || settings.site_title || 'Web3 Comic Platform',
      description: settings.og_description || settings.site_description || 'A decentralized comic reading platform with Web3 integration',
      siteName: settings.site_title || 'Web3 Comic Platform',
      images: settings.og_image ? [
        {
          url: settings.og_image,
          width: 1200,
          height: 630,
          alt: settings.og_title || settings.site_title || 'Web3 Comic Platform',
        }
      ] : [],
    },
    twitter: {
      card: settings.twitter_card_type || 'summary_large_image',
      title: settings.og_title || settings.site_title || 'Web3 Comic Platform',
      description: settings.og_description || settings.site_description || 'A decentralized comic reading platform with Web3 integration',
      site: settings.twitter_handle || undefined,
      creator: settings.twitter_handle || undefined,
      images: settings.og_image ? [settings.og_image] : [],
    },
    robots: {
      index: !settings.maintenance_mode,
      follow: !settings.maintenance_mode,
      nocache: false,
      googleBot: {
        index: !settings.maintenance_mode,
        follow: !settings.maintenance_mode,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: settings.favicon || '/favicon.ico',
      shortcut: settings.favicon || '/favicon.ico',
      apple: settings.site_logo || undefined,
    },
    verification: {
      google: settings.google_analytics_id ? extractGoogleSiteVerification(settings.google_analytics_id) : undefined,
    },
  }
}

export async function generateComicMetadata(comic: {
  title: string
  description: string
  coverImage: string
  slug: string
}): Promise<Metadata> {
  const settings = await getSettings()
  const baseUrl = settings.canonical_url_base || 'https://web3comics.com'
  
  const title = settings.meta_title_template 
    ? settings.meta_title_template.replace('%s', comic.title)
    : `${comic.title} | ${settings.site_title || 'Web3 Comic Platform'}`
    
  const description = settings.meta_description_template
    ? settings.meta_description_template.replace('%s', comic.title)
    : comic.description

  return {
    title,
    description,
    openGraph: {
      title: comic.title,
      description: comic.description,
      images: [
        {
          url: comic.coverImage,
          width: 800,
          height: 1200,
          alt: comic.title,
        }
      ],
      url: `${baseUrl}/comics/${comic.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: comic.title,
      description: comic.description,
      images: [comic.coverImage],
    },
    alternates: {
      canonical: `${baseUrl}/comics/${comic.slug}`,
    },
  }
}

function extractGoogleSiteVerification(analyticsId: string): string | undefined {
  // This would typically be a separate setting, but we can derive it from GA ID
  // In a real implementation, you'd want a separate field for Google Site Verification
  return undefined
}