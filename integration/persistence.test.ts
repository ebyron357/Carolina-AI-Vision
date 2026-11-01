import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { PGlite } from '@electric-sql/pglite'
import { captureLead, type Query } from '../lib/lead-storage'
import { validateLead } from '../lib/leads'
test('real embedded PostgreSQL: persistence, dedup, consent, classification, outbox, limiting and rollback', async () => {
  const path = await mkdtemp(join(tmpdir(), 'carolina-db-'))
  let db = new PGlite(path)
  try {
    await db.exec(await readFile('db/001_lead_intake.sql', 'utf8'))
    const query: Query = async (sql, values) => ({
      rows: (
        await db.query<{
          id: string | null
          duplicate: boolean
          limited: boolean
        }>(sql, values)
      ).rows,
    })
    const lead = validateLead({
      journey: 'website',
      name: 'Synthetic owner',
      business: 'Synthetic only',
      email: 'test@example.com',
      goal: 'Test persistence only',
      consent: true,
      service: 'website-quote',
      package: 'growth',
      upgrades: ['crm', 'maintenance'],
    }).lead!
    const first = await captureLead(
      query,
      lead,
      randomUUID(),
      '192.0.2.10',
      'local-test-secret-not-a-credential'
    )
    assert.ok(first.id)
    assert.equal(first.duplicate, false)
    const duplicate = await captureLead(
      query,
      lead,
      randomUUID(),
      '192.0.2.10',
      'local-test-secret-not-a-credential'
    )
    assert.equal(duplicate.id, first.id)
    assert.equal(duplicate.duplicate, true)
    const count = async (table: string) =>
      Number(
        (
          await db.query<{ n: number }>(
            `SELECT count(*) AS n FROM carolina.${table}`
          )
        ).rows[0].n
      )
    assert.equal(await count('lead_requests'), 1)
    assert.equal(await count('lead_audit'), 1)
    assert.equal(await count('crm_outbox'), 1)
    const row = (
      await db.query<{
        classification: string
        privacy_version: string
        payload: { consent: boolean }
        follow_up_queue: string
      }>('SELECT * FROM carolina.lead_requests')
    ).rows[0]
    assert.equal(row.classification, 'website-quote')
    assert.equal(row.follow_up_queue, 'website-discovery')
    assert.equal(row.privacy_version, '2026-11-01')
    assert.equal(row.payload.consent, true)
    const concurrent = await Promise.all(
      [1, 2, 3].map((n) =>
        captureLead(
          query,
          lead,
          randomUUID(),
          `192.0.2.${20 + n}`,
          'local-test-secret-not-a-credential'
        )
      )
    )
    assert.ok(
      concurrent.every((result) => result.id === first.id && result.duplicate)
    )
    await assert.rejects(
      captureLead(
        query,
        { ...lead, goal: 'Different payload' },
        first.id!,
        '192.0.2.30',
        'local-test-secret-not-a-credential'
      )
    )
    assert.equal(await count('lead_requests'), 1)
    const rate = (
      await db.query<{ key: string }>('SELECT key FROM carolina.intake_limits')
    ).rows[0].key
    assert.notEqual(rate, '192.0.2.10')
    assert.equal(rate.length, 64)
    for (let i = 0; i < 3; i++)
      await captureLead(
        query,
        lead,
        randomUUID(),
        '192.0.2.10',
        'local-test-secret-not-a-credential'
      )
    assert.equal(
      (
        await captureLead(
          query,
          lead,
          randomUUID(),
          '192.0.2.10',
          'local-test-secret-not-a-credential'
        )
      ).limited,
      true
    )
    // Force outbox insertion failure; entire statement must roll back, including lead and audit.
    await db.exec(
      'ALTER TABLE carolina.crm_outbox ADD CONSTRAINT test_failure CHECK (false) NOT VALID'
    )
    await assert.rejects(
      captureLead(
        query,
        { ...lead, goal: 'Force rollback' },
        randomUUID(),
        '192.0.2.11',
        'local-test-secret-not-a-credential'
      )
    )
    assert.equal(await count('lead_requests'), 1)
    assert.equal(await count('lead_audit'), 1)
    await db.close()
    db = new PGlite(path)
    assert.equal(await count('lead_requests'), 1)
    assert.equal(
      (
        await db.query<{ status: string }>(
          'SELECT status FROM carolina.crm_outbox'
        )
      ).rows[0].status,
      'pending_configuration'
    )
  } finally {
    await db.close()
    await rm(path, { recursive: true, force: true })
  }
})
