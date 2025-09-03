'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

interface ContentSettingsProps {
  settings: Record<string, any>
  onChange: (key: string, value: any) => void
  getCurrentValue: (key: string) => any
}

export function ContentSettings({ settings, onChange, getCurrentValue }: ContentSettingsProps) {
  const maintenanceMode = getCurrentValue('maintenance_mode') || false

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="default_free_chapters">Default Free Chapters</Label>
            <Input
              id="default_free_chapters"
              type="number"
              min="0"
              max="50"
              value={getCurrentValue('default_free_chapters') || 3}
              onChange={(e) => onChange('default_free_chapters', parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Number of free chapters for new comics
            </p>
          </div>

          <div>
            <Label htmlFor="default_unlock_cost">Default Unlock Cost</Label>
            <Input
              id="default_unlock_cost"
              type="number"
              min="1"
              max="1000"
              value={getCurrentValue('default_unlock_cost') || 5}
              onChange={(e) => onChange('default_unlock_cost', parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Default credits needed to unlock a chapter
            </p>
          </div>

          <div>
            <Label htmlFor="credits_per_dollar">Credits per Dollar</Label>
            <Input
              id="credits_per_dollar"
              type="number"
              min="1"
              max="10000"
              value={getCurrentValue('credits_per_dollar') || 100}
              onChange={(e) => onChange('credits_per_dollar', parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Exchange rate for credit purchases
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Maintenance Mode</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance_mode">Enable Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable public access to the site
                </p>
              </div>
              <Switch
                id="maintenance_mode"
                checked={maintenanceMode}
                onCheckedChange={(checked) => onChange('maintenance_mode', checked)}
              />
            </div>

            {maintenanceMode && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Maintenance mode is enabled. Regular users will not be able to access the site.
                </AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="maintenance_message">Maintenance Message</Label>
              <Textarea
                id="maintenance_message"
                value={getCurrentValue('maintenance_message') || ''}
                onChange={(e) => onChange('maintenance_message', e.target.value)}
                placeholder="We are currently under maintenance. Please check back soon!"
                rows={3}
                disabled={!maintenanceMode}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Message displayed to users when maintenance mode is enabled
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}