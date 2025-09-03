'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Twitter, MessageCircle, Send, Instagram, Facebook } from 'lucide-react'

interface SocialSettingsProps {
  settings: Record<string, any>
  onChange: (key: string, value: any) => void
  getCurrentValue: (key: string) => any
}

export function SocialSettings({ settings, onChange, getCurrentValue }: SocialSettingsProps) {
  const socialPlatforms = [
    {
      key: 'twitter_url',
      label: 'Twitter/X URL',
      placeholder: 'https://twitter.com/yourhandle',
      icon: Twitter
    },
    {
      key: 'discord_url',
      label: 'Discord Server URL',
      placeholder: 'https://discord.gg/yourserver',
      icon: MessageCircle
    },
    {
      key: 'telegram_url',
      label: 'Telegram URL',
      placeholder: 'https://t.me/yourchannel',
      icon: Send
    },
    {
      key: 'instagram_url',
      label: 'Instagram URL',
      placeholder: 'https://instagram.com/yourhandle',
      icon: Instagram
    },
    {
      key: 'facebook_url',
      label: 'Facebook URL',
      placeholder: 'https://facebook.com/yourpage',
      icon: Facebook
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {socialPlatforms.map(({ key, label, placeholder, icon: Icon }) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <CardTitle className="text-base">{label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor={key} className="sr-only">{label}</Label>
                <Input
                  id={key}
                  type="url"
                  value={getCurrentValue(key) || ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  placeholder={placeholder}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Leave empty to hide this social media link from your site
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="border-t pt-6">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Social Media Integration</h3>
            <p className="text-sm text-blue-700">
              These social media links will appear in your site's footer and can be used for
              building community engagement. Make sure the URLs are correct and publicly accessible.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}