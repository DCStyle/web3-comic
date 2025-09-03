import { z } from 'zod'

export const settingsSchema = z.object({
  // General Settings
  site_title: z.string().min(1, 'Site title is required').max(100),
  site_description: z.string().min(1, 'Site description is required').max(500),
  site_logo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  favicon: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  contact_email: z.string().email('Must be a valid email'),
  copyright_text: z.string().max(200),
  
  // SEO Settings
  meta_title_template: z.string().min(1, 'Meta title template is required'),
  meta_description_template: z.string().min(1, 'Meta description template is required'),
  meta_keywords: z.string().max(500),
  og_title: z.string().min(1, 'OG title is required').max(100),
  og_description: z.string().min(1, 'OG description is required').max(300),
  og_image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitter_card_type: z.enum(['summary', 'summary_large_image', 'app', 'player']),
  twitter_handle: z.string().regex(/^@[a-zA-Z0-9_]+$/, 'Must be a valid Twitter handle').optional().or(z.literal('')),
  canonical_url_base: z.string().url('Must be a valid URL'),
  
  // Homepage Settings
  hero_title: z.string().min(1, 'Hero title is required').max(100),
  hero_subtitle: z.string().max(200),
  hero_cta_text: z.string().min(1, 'CTA text is required').max(50),
  featured_comics_count: z.number().int().min(1).max(20),
  show_latest_releases: z.boolean(),
  show_popular_comics: z.boolean(),
  
  // Content Settings
  default_free_chapters: z.number().int().min(0).max(50),
  default_unlock_cost: z.number().int().min(1).max(1000),
  credits_per_dollar: z.number().int().min(1).max(10000),
  maintenance_mode: z.boolean(),
  maintenance_message: z.string().max(500),
  
  // Analytics Settings
  google_analytics_id: z.string().regex(/^(G-[A-Z0-9]{10})?$/, 'Must be a valid GA4 ID (G-XXXXXXXXXX)').optional().or(z.literal('')),
  google_tag_manager_id: z.string().regex(/^(GTM-[A-Z0-9]{7})?$/, 'Must be a valid GTM ID (GTM-XXXXXXX)').optional().or(z.literal('')),
  facebook_pixel_id: z.string().regex(/^[0-9]{15,16}$/, 'Must be a valid Facebook Pixel ID').optional().or(z.literal('')),
  
  // Social Media Settings
  twitter_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  discord_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  telegram_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  instagram_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  facebook_url: z.string().url('Must be a valid URL').optional().or(z.literal(''))
})

export const generalSettingsSchema = settingsSchema.pick({
  site_title: true,
  site_description: true,
  site_logo: true,
  favicon: true,
  contact_email: true,
  copyright_text: true
})

export const seoSettingsSchema = settingsSchema.pick({
  meta_title_template: true,
  meta_description_template: true,
  meta_keywords: true,
  og_title: true,
  og_description: true,
  og_image: true,
  twitter_card_type: true,
  twitter_handle: true,
  canonical_url_base: true
})

export const homepageSettingsSchema = settingsSchema.pick({
  hero_title: true,
  hero_subtitle: true,
  hero_cta_text: true,
  featured_comics_count: true,
  show_latest_releases: true,
  show_popular_comics: true
})

export const contentSettingsSchema = settingsSchema.pick({
  default_free_chapters: true,
  default_unlock_cost: true,
  credits_per_dollar: true,
  maintenance_mode: true,
  maintenance_message: true
})

export const analyticsSettingsSchema = settingsSchema.pick({
  google_analytics_id: true,
  google_tag_manager_id: true,
  facebook_pixel_id: true
})

export const socialSettingsSchema = settingsSchema.pick({
  twitter_url: true,
  discord_url: true,
  telegram_url: true,
  instagram_url: true,
  facebook_url: true
})

export type SettingsType = z.infer<typeof settingsSchema>
export type GeneralSettingsType = z.infer<typeof generalSettingsSchema>
export type SEOSettingsType = z.infer<typeof seoSettingsSchema>
export type HomepageSettingsType = z.infer<typeof homepageSettingsSchema>
export type ContentSettingsType = z.infer<typeof contentSettingsSchema>
export type AnalyticsSettingsType = z.infer<typeof analyticsSettingsSchema>
export type SocialSettingsType = z.infer<typeof socialSettingsSchema>