import { createHash } from 'node:crypto'
import type { Database } from '@/lib/database'
export async function migrate(
  db: Database,
  files: { name: string; sql: string }[]
) {
  await db.query('SELECT pg_advisory_lock(81674329)')
  try {
    await db.query('CREATE SCHEMA IF NOT EXISTS carolina_migrations')
    await db.query('REVOKE ALL ON SCHEMA carolina_migrations FROM PUBLIC')
    await db.query(
      'CREATE TABLE IF NOT EXISTS carolina_migrations.applied(name text PRIMARY KEY,checksum text NOT NULL,applied_at timestamptz NOT NULL DEFAULT now())'
    )
    for (const file of files) {
      const checksum = createHash('sha256').update(file.sql).digest('hex')
      const prior = await db.query<{ checksum: string }>(
        'SELECT checksum FROM carolina_migrations.applied WHERE name=$1',
        [file.name]
      )
      if (prior.rows[0]) {
        if (prior.rows[0].checksum !== checksum)
          throw new Error('Migration checksum changed')
        continue
      }
      await db.query('BEGIN')
      try {
        await db.query(file.sql)
        await db.query(
          'INSERT INTO carolina_migrations.applied(name,checksum) VALUES($1,$2)',
          [file.name, checksum]
        )
        await db.query('COMMIT')
      } catch (error) {
        await db.query('ROLLBACK')
        throw error
      }
    }
  } finally {
    await db.query('SELECT pg_advisory_unlock(81674329)')
  }
}
