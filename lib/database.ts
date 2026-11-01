import { Pool } from 'pg'
export type Database = {
  query<T extends Record<string, unknown>>(
    sql: string,
    values?: unknown[]
  ): Promise<{ rows: T[] }>
}
export function createDatabase(connectionString: string) {
  const url = new URL(connectionString)
  if (!['postgres:', 'postgresql:'].includes(url.protocol))
    throw new Error('Invalid database configuration')
  for (const key of [
    'ssl',
    'sslmode',
    'sslcert',
    'sslkey',
    'sslrootcert',
    'uselibpqcompat',
  ])
    url.searchParams.delete(key)
  const pool = new Pool({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: true },
    max: 3,
    connectionTimeoutMillis: 5000,
    statement_timeout: 8000,
    query_timeout: 10000,
  })
  // Idle socket errors must not crash the process or log connection details.
  pool.on('error', () => {})
  return pool
}
