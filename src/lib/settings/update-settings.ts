import { prisma } from '@/lib/db/prisma'

export async function updateSetting(key: string, value: any, updatedBy?: string) {
  return await prisma.settings.upsert({
    where: { key },
    update: { 
      value,
      updatedBy 
    },
    create: {
      key,
      value,
      category: getCategoryFromKey(key),
      updatedBy
    }
  })
}

export async function updateSettings(updates: Array<{ key: string, value: any }>, updatedBy?: string) {
  const results = await Promise.all(
    updates.map(({ key, value }) => updateSetting(key, value, updatedBy))
  )
  
  return results
}

function getCategoryFromKey(key: string): string {
  const categoryMap: Record<string, string> = {
    // General
    'site_title': 'general',
    'site_description': 'general',
    'site_logo': 'general',
    'favicon': 'general',
    'contact_email': 'general',
    'copyright_text': 'general',
    
    // SEO
    'meta_title_template': 'seo',
    'meta_description_template': 'seo',
    'meta_keywords': 'seo',
    'og_title': 'seo',
    'og_description': 'seo',
    'og_image': 'seo',
    'twitter_card_type': 'seo',
    'twitter_handle': 'seo',
    'canonical_url_base': 'seo',
    
    // Homepage
    'hero_title': 'homepage',
    'hero_subtitle': 'homepage',
    'hero_cta_text': 'homepage',
    'featured_comics_count': 'homepage',
    'show_latest_releases': 'homepage',
    'show_popular_comics': 'homepage',
    
    // Content
    'default_free_chapters': 'content',
    'default_unlock_cost': 'content',
    'credits_per_dollar': 'content',
    'maintenance_mode': 'content',
    'maintenance_message': 'content',
    
    // Analytics
    'google_analytics_id': 'analytics',
    'google_tag_manager_id': 'analytics',
    'facebook_pixel_id': 'analytics',
    
    // Social
    'twitter_url': 'social',
    'discord_url': 'social',
    'telegram_url': 'social',
    'instagram_url': 'social',
    'facebook_url': 'social'
  }
  
  return categoryMap[key] || 'general'
}