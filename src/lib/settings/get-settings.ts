import { prisma } from '@/lib/db/prisma'

export async function getSettings(category?: string) {
  const where = category ? { category } : undefined
  
  const settings = await prisma.settings.findMany({
    where,
    orderBy: [
      { category: 'asc' },
      { key: 'asc' }
    ]
  })
  
  // Convert to key-value pairs
  const settingsMap: Record<string, any> = {}
  settings.forEach(setting => {
    settingsMap[setting.key] = setting.value
  })
  
  return settingsMap
}

export async function getSetting(key: string) {
  const setting = await prisma.settings.findUnique({
    where: { key }
  })
  
  return setting?.value
}

export async function getSettingsByCategory(category: string) {
  return getSettings(category)
}