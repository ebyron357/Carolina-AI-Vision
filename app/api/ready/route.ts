import { NextResponse } from 'next/server'
import { intakeReady } from '@/lib/lead-storage'
export async function GET() {
  const ready = await intakeReady()
  return NextResponse.json(
    { status: ready ? 'ready' : 'unavailable' },
    {
      status: ready ? 200 : 503,
      headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
    }
  )
}
