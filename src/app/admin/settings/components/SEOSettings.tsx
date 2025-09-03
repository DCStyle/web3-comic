'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUpload } from './ImageUpload'

interface SEOSettingsProps {
  settings: Record<string, any>
  onChange: (key: string, value: any) => void
  getCurrentValue: (key: string) => any
}

export function SEOSettings({ settings, onChange, getCurrentValue }: SEOSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="meta_title_template">Meta Title Template</Label>
          <Input
            id="meta_title_template"
            value={getCurrentValue('meta_title_template') || ''}
            onChange={(e) => onChange('meta_title_template', e.target.value)}
            placeholder="%s | Your Site Name"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Use %s as a placeholder for the page title. Example: "%s | Web3 Comics"
          </p>
        </div>

        <div>
          <Label htmlFor="meta_description_template">Meta Description Template</Label>
          <Textarea
            id="meta_description_template"
            value={getCurrentValue('meta_description_template') || ''}
            onChange={(e) => onChange('meta_description_template', e.target.value)}
            placeholder="Read %s and thousands of other comics..."
            rows={2}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Use %s as a placeholder for dynamic content
          </p>
        </div>

        <div>
          <Label htmlFor="meta_keywords">Meta Keywords</Label>
          <Input
            id="meta_keywords"
            value={getCurrentValue('meta_keywords') || ''}
            onChange={(e) => onChange('meta_keywords', e.target.value)}
            placeholder="web3, comics, manga, blockchain"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Comma-separated keywords for SEO
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Open Graph Settings</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="og_title">OG Title</Label>
              <Input
                id="og_title"
                value={getCurrentValue('og_title') || ''}
                onChange={(e) => onChange('og_title', e.target.value)}
                placeholder="Web3 Comic Platform"
              />
            </div>

            <div>
              <Label htmlFor="og_description">OG Description</Label>
              <Textarea
                id="og_description"
                value={getCurrentValue('og_description') || ''}
                onChange={(e) => onChange('og_description', e.target.value)}
                placeholder="A decentralized comic reading platform..."
                rows={2}
              />
            </div>

            <ImageUpload
              label="OG Image"
              value={getCurrentValue('og_image') || ''}
              onChange={(url) => onChange('og_image', url)}
              description="Image displayed when sharing on social media (recommended: 1200x630px)"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Twitter Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="twitter_card_type">Twitter Card Type</Label>
              <Select
                value={getCurrentValue('twitter_card_type') || 'summary_large_image'}
                onValueChange={(value) => onChange('twitter_card_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                  <SelectItem value="app">App</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="twitter_handle">Twitter Handle</Label>
              <Input
                id="twitter_handle"
                value={getCurrentValue('twitter_handle') || ''}
                onChange={(e) => onChange('twitter_handle', e.target.value)}
                placeholder="@yourhandle"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div>
            <Label htmlFor="canonical_url_base">Canonical URL Base</Label>
            <Input
              id="canonical_url_base"
              type="url"
              value={getCurrentValue('canonical_url_base') || ''}
              onChange={(e) => onChange('canonical_url_base', e.target.value)}
              placeholder="https://yoursite.com"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Base URL for canonical links (without trailing slash)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}