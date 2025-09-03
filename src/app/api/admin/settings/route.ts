import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getSettings } from '@/lib/settings/get-settings'
import { updateSettings } from '@/lib/settings/update-settings'
import { z } from 'zod'

const bulkUpdateSchema = z.array(z.object({
  key: z.string(),
  value: z.any()
}))

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const settings = await getSettings(category || undefined)
    
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedBody = bulkUpdateSchema.parse(body)
    
    const updatedSettings = await updateSettings(validatedBody, session.user.id)
    
    return NextResponse.json({ 
      message: 'Settings updated successfully',
      updatedCount: updatedSettings.length 
    })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}