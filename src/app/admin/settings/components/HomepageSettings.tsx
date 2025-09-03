'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

interface HomepageSettingsProps {
  settings: Record<string, any>
  onChange: (key: string, value: any) => void
  getCurrentValue: (key: string) => any
}

export function HomepageSettings({ settings, onChange, getCurrentValue }: HomepageSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="hero_title">Hero Title</Label>
          <Input
            id="hero_title"
            value={getCurrentValue('hero_title') || ''}
            onChange={(e) => onChange('hero_title', e.target.value)}
            placeholder="Welcome to Web3 Comics"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Main headline displayed on the homepage
          </p>
        </div>

        <div>
          <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
          <Textarea
            id="hero_subtitle"
            value={getCurrentValue('hero_subtitle') || ''}
            onChange={(e) => onChange('hero_subtitle', e.target.value)}
            placeholder="Discover amazing comics in the decentralized universe"
            rows={2}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Supporting text displayed below the main headline
          </p>
        </div>

        <div>
          <Label htmlFor="hero_cta_text">Call to Action Button Text</Label>
          <Input
            id="hero_cta_text"
            value={getCurrentValue('hero_cta_text') || ''}
            onChange={(e) => onChange('hero_cta_text', e.target.value)}
            placeholder="Start Reading"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Text displayed on the main action button
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Content Sections</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="featured_comics_count">Featured Comics Count</Label>
              <Input
                id="featured_comics_count"
                type="number"
                min="1"
                max="20"
                value={getCurrentValue('featured_comics_count') || 6}
                onChange={(e) => onChange('featured_comics_count', parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Number of featured comics to display on homepage
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show_latest_releases">Show Latest Releases Section</Label>
                <p className="text-sm text-muted-foreground">
                  Display a section with the most recently published comics
                </p>
              </div>
              <Switch
                id="show_latest_releases"
                checked={getCurrentValue('show_latest_releases') || false}
                onCheckedChange={(checked) => onChange('show_latest_releases', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show_popular_comics">Show Popular Comics Section</Label>
                <p className="text-sm text-muted-foreground">
                  Display a section with the most popular/trending comics
                </p>
              </div>
              <Switch
                id="show_popular_comics"
                checked={getCurrentValue('show_popular_comics') || false}
                onCheckedChange={(checked) => onChange('show_popular_comics', checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}