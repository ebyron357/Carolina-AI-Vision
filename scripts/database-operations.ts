import { createDatabase } from '../lib/database'
async function main() {
  if (
    process.env.DATA_OPERATIONS_APPROVED !== 'true' ||
    !process.env.OPERATIONS_DATABASE_URL
  )
    throw new Error('Approval required')
  const [operation, arg, tenant] = process.argv.slice(2)
  const sql: Record<string, string> = {
    status: 'SELECT * FROM carolina.outbox_status()',
    erase: 'SELECT carolina.erase_lead($1::uuid) AS affected',
    prune: 'SELECT carolina.prune_delivered($1::integer) AS affected',
    release: 'SELECT carolina.release_outbox($1) AS affected',
    requeue: 'SELECT carolina.requeue_outbox($1::uuid,$2) AS affected',
  }
  if (!Object.hasOwn(sql, operation) || (operation !== 'status' && !arg))
    throw new Error('Explicit operation required')
  if (operation === 'release' && process.env.CRM_DELIVERY_APPROVED !== 'true')
    throw new Error('CRM approval required')
  const db = createDatabase(process.env.OPERATIONS_DATABASE_URL)
  try {
    const result = await db.query(
      sql[operation],
      operation === 'status'
        ? []
        : operation === 'requeue'
          ? [arg, tenant]
          : [arg]
    )
    process.stdout.write(JSON.stringify(result.rows) + '\n')
  } finally {
    await db.end()
  }
}
main().catch(() => {
  process.stderr.write(
    'Approved data operation failed. No credentials or payloads logged.\n'
  )
  process.exitCode = 1
})
