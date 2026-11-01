import { pathToFileURL } from 'node:url'
import { isAbsolute } from 'node:path'
import { createDatabase } from '../lib/database'
import { processOne, type CrmTransport } from '../lib/crm-outbox'
async function main() {
  if (process.env.CRM_DELIVERY_APPROVED !== 'true')
    throw new Error('CRM delivery is not approved')
  const path = process.env.CRM_ADAPTER_MODULE,
    tenant = process.env.CRM_TENANT_ID,
    url = process.env.WORKER_DATABASE_URL
  if (!path || !isAbsolute(path) || !tenant || !url)
    throw new Error('Operator configuration incomplete')
  // Local reviewed operator code only; no module path comes from a public request.
  const transport: CrmTransport = (await import(pathToFileURL(path).href))
    .transport
  if (typeof transport?.deliver !== 'function')
    throw new Error('Reviewed adapter missing')
  const db = createDatabase(url)
  try {
    const status = await processOne(db, transport, tenant)
    process.stdout.write(JSON.stringify({ status }) + '\n')
  } finally {
    await db.end()
  }
}
main().catch(() => {
  process.stderr.write(
    'Outbox execution failed; inspect restricted database audit and configuration.\n'
  )
  process.exitCode = 1
})
