import { readFile } from 'node:fs/promises'
import { createDatabase } from '../lib/database'
import { migrate } from '../lib/migrations'
async function main() {
  if (
    process.env.MIGRATIONS_APPROVED !== 'true' ||
    !process.env.MIGRATION_DATABASE_URL
  )
    throw new Error('Migration approval required')
  const db = createDatabase(process.env.MIGRATION_DATABASE_URL)
  const client = await db.connect()
  try {
    await migrate(
      client,
      await Promise.all(
        ['001_lead_intake.sql', '002_operations.sql'].map(async (name) => ({
          name,
          sql: await readFile('db/' + name, 'utf8'),
        }))
      )
    )
    process.stdout.write('Migrations verified and applied.\n')
  } finally {
    client.release()
    await db.end()
  }
}
main().catch(() => {
  process.stderr.write(
    'Migration failed; use restricted operator diagnostics. No connection details logged.\n'
  )
  process.exitCode = 1
})
