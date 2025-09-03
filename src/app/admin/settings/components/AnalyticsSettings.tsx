'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Target, Facebook } from 'lucide-react'

interface AnalyticsSettingsProps {
  settings: Record<string, any>
  onChange: (key: string, value: any) => void
  getCurrentValue: (key: string) => any
}

export function AnalyticsSettings({ settings, onChange, getCurrentValue }: AnalyticsSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <CardTitle className="text-base">Google Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="google_analytics_id">Google Analytics ID (GA4)</Label>
              <Input
                id="google_analytics_id"
                value={getCurrentValue('google_analytics_id') || ''}
                onChange={(e) => onChange('google_analytics_id', e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Your Google Analytics 4 measurement ID. Format: G-XXXXXXXXXX
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <CardTitle className="text-base">Google Tag Manager</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="google_tag_manager_id">Google Tag Manager ID</Label>
              <Input
                id="google_tag_manager_id"
                value={getCurrentValue('google_tag_manager_id') || ''}
                onChange={(e) => onChange('google_tag_manager_id', e.target.value)}
                placeholder="GTM-XXXXXXX"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Your Google Tag Manager container ID. Format: GTM-XXXXXXX
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Facebook className="h-4 w-4" />
              <CardTitle className="text-base">Facebook Pixel</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="facebook_pixel_id">Facebook Pixel ID</Label>
              <Input
                id="facebook_pixel_id"
                value={getCurrentValue('facebook_pixel_id') || ''}
                onChange={(e) => onChange('facebook_pixel_id', e.target.value)}
                placeholder="123456789012345"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Your Facebook Pixel ID (15-16 digit number)
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="border-t pt-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-sm font-medium text-amber-800 mb-2">Privacy Notice</h3>
            <p className="text-sm text-amber-700">
              Make sure to update your privacy policy and cookie consent mechanisms when enabling
              analytics tracking. Consider GDPR compliance for EU users.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}