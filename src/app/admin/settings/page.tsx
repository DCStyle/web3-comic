'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { GeneralSettings } from './components/GeneralSettings'
import { SEOSettings } from './components/SEOSettings'
import { HomepageSettings } from './components/HomepageSettings'
import { ContentSettings } from './components/ContentSettings'
import { AnalyticsSettings } from './components/AnalyticsSettings'
import { SocialSettings } from './components/SocialSettings'
import { Settings, Save } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [changes, setChanges] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      
      if (response.ok) {
        setSettings(data.settings)
      } else {
        toast.error('Failed to fetch settings')
      }
    } catch (error) {
      toast.error('Error fetching settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (key: string, value: any) => {
    setChanges(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = async () => {
    if (!hasChanges) return

    setIsSaving(true)
    try {
      const updates = Object.entries(changes).map(([key, value]) => ({ key, value }))
      
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        setSettings(prev => ({ ...prev, ...changes }))
        setChanges({})
        setHasChanges(false)
        toast.success('Settings saved successfully!')
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      toast.error('Error saving settings')
    } finally {
      setIsSaving(false)
    }
  }

  const getCurrentValue = (key: string) => {
    return changes[key] !== undefined ? changes[key] : settings[key]
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your platform's configuration, SEO, and appearance
          </p>
        </div>
        
        {hasChanges && (
          <Button onClick={saveSettings} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic site information and branding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralSettings
                settings={settings}
                onChange={handleSettingChange}
                getCurrentValue={getCurrentValue}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Search engine optimization and meta tags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SEOSettings
                settings={settings}
                onChange={handleSettingChange}
                getCurrentValue={getCurrentValue}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homepage">
          <Card>
            <CardHeader>
              <CardTitle>Homepage Settings</CardTitle>
              <CardDescription>
                Customize your homepage content and layout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HomepageSettings
                settings={settings}
                onChange={handleSettingChange}
                getCurrentValue={getCurrentValue}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
              <CardDescription>
                Configure content-related settings and defaults
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentSettings
                settings={settings}
                onChange={handleSettingChange}
                getCurrentValue={getCurrentValue}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Settings</CardTitle>
              <CardDescription>
                Configure tracking and analytics integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsSettings
                settings={settings}
                onChange={handleSettingChange}
                getCurrentValue={getCurrentValue}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Settings</CardTitle>
              <CardDescription>
                Configure your social media links and profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SocialSettings
                settings={settings}
                onChange={handleSettingChange}
                getCurrentValue={getCurrentValue}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}