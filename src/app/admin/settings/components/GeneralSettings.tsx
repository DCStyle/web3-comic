'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from './ImageUpload'

interface GeneralSettingsProps {
  settings: Record<string, any>
  onChange: (key: string, value: any) => void
  getCurrentValue: (key: string) => any
}

export function GeneralSettings({ settings, onChange, getCurrentValue }: GeneralSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="site_title">Site Title</Label>
          <Input
            id="site_title"
            value={getCurrentValue('site_title') || ''}
            onChange={(e) => onChange('site_title', e.target.value)}
            placeholder="Your site title"
          />
          <p className="text-sm text-muted-foreground mt-1">
            The main title of your website, displayed in browser tabs and search results
          </p>
        </div>

        <div>
          <Label htmlFor="site_description">Site Description</Label>
          <Textarea
            id="site_description"
            value={getCurrentValue('site_description') || ''}
            onChange={(e) => onChange('site_description', e.target.value)}
            placeholder="A brief description of your website"
            rows={3}
          />
          <p className="text-sm text-muted-foreground mt-1">
            A brief description that appears in search results and social media
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload
            label="Site Logo"
            value={getCurrentValue('site_logo') || ''}
            onChange={(url) => onChange('site_logo', url)}
            description="Your site's main logo image (recommended: 200x50px)"
          />

          <ImageUpload
            label="Favicon"
            value={getCurrentValue('favicon') || ''}
            onChange={(url) => onChange('favicon', url)}
            accept="image/x-icon,image/png,image/svg+xml"
            description="Browser tab icon (recommended: 32x32px ICO, PNG, or SVG)"
          />
        </div>

        <div>
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={getCurrentValue('contact_email') || ''}
            onChange={(e) => onChange('contact_email', e.target.value)}
            placeholder="contact@example.com"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Primary contact email for your website
          </p>
        </div>

        <div>
          <Label htmlFor="copyright_text">Copyright Text</Label>
          <Input
            id="copyright_text"
            value={getCurrentValue('copyright_text') || ''}
            onChange={(e) => onChange('copyright_text', e.target.value)}
            placeholder="© 2024 Your Company. All rights reserved."
          />
          <p className="text-sm text-muted-foreground mt-1">
            Copyright notice displayed in the footer
          </p>
        </div>
      </div>
    </div>
  )
}