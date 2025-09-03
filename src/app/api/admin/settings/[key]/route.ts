import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getSetting } from '@/lib/settings/get-settings'
import { updateSetting } from '@/lib/settings/update-settings'
import { z } from 'zod'

const updateSettingSchema = z.object({
  value: z.any()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const value = await getSetting(key)
    
    if (value === undefined) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 })
    }
    
    return NextResponse.json({ key, value })
  } catch (error) {
    console.error('Setting fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { value } = updateSettingSchema.parse(body)
    
    const updatedSetting = await updateSetting(key, value, session.user.id)
    
    return NextResponse.json({ 
      message: 'Setting updated successfully',
      setting: updatedSetting 
    })
  } catch (error) {
    console.error('Setting update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}