import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
test('operator commands refuse execution without explicit approvals and do not leak configuration', () => {
  const env = {
    ...process.env,
    MIGRATIONS_APPROVED: 'false',
    DATA_OPERATIONS_APPROVED: 'false',
    CRM_DELIVERY_APPROVED: 'false',
    MIGRATION_DATABASE_URL: 'synthetic-private-marker',
    OPERATIONS_DATABASE_URL: 'synthetic-private-marker',
    WORKER_DATABASE_URL: 'synthetic-private-marker',
  }
  for (const file of [
    'scripts/migrate-database.ts',
    'scripts/database-operations.ts',
    'scripts/outbox-worker.ts',
  ]) {
    const result = spawnSync(process.execPath, ['--import', 'tsx', file], {
      env,
      encoding: 'utf8',
    })
    assert.equal(result.status, 1)
    assert.ok(!result.stderr.includes('synthetic-private-marker'))
    assert.equal(result.stdout, '')
  }
})
