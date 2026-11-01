import { NextRequest } from 'next/server'
import { submitLead } from '@/lib/lead-endpoint'
import { intakeEnabled, storeLead } from '@/lib/lead-storage'
export async function POST(request: NextRequest) {
  return submitLead(request, { enabled: intakeEnabled, store: storeLead })
}
