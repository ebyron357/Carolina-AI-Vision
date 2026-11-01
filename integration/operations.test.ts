import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { PGlite } from '@electric-sql/pglite'
import { migrate } from '../lib/migrations'
import { captureLead } from '../lib/lead-storage'
import { validateLead } from '../lib/leads'
import {
  processOne,
  DeliveryFailure,
  type CrmTransport,
} from '../lib/crm-outbox'
import type { Database } from '../lib/database'
const tenant = 'synthetic-tenant'
const files = async () =>
  Promise.all(
    ['001_lead_intake.sql', '002_operations.sql'].map(async (name) => ({
      name,
      sql: await readFile('db/' + name, 'utf8'),
    }))
  )
async function setup() {
  const db = new PGlite()
  const port: Database = {
    query: async <T extends Record<string, unknown>>(
      sql: string,
      values?: unknown[]
    ) => {
      if (!values && sql.includes(';')) {
        await db.exec(sql)
        return { rows: [] as T[] }
      }
      return { rows: (await db.query<T>(sql, values)).rows }
    },
  }
  await migrate(port, await files())
  return { db, port }
}
async function seed(port: Database) {
  const lead = validateLead({
    journey: 'website',
    service: 'website-quote',
    name: 'Synthetic',
    business: 'Test',
    email: 'test@example.com',
    goal: 'Test only',
    consent: true,
  }).lead!
  return (
    await captureLead(
      async (sql, values) => port.query(sql, values),
      lead,
      randomUUID(),
      '192.0.2.1',
      'synthetic-test-secret-not-a-credential'
    )
  ).id!
}
const transport: CrmTransport = {
  deliver: async (e) => ({
    tenantId: e.tenantId,
    correlationId: e.correlationId,
    crmLeadId: 'synthetic-crm-record',
    assignmentId: 'synthetic-assignment',
    followupId: 'synthetic-followup',
  }),
}
test('checksummed migrations re-run safely and reject altered history', async () => {
  const { db, port } = await setup()
  try {
    await migrate(port, await files())
    const changed = await files()
    changed[0].sql += '\n--tampered'
    await assert.rejects(migrate(port, changed), /checksum/)
    assert.equal(
      (await db.query('SELECT * FROM carolina.schema_versions')).rows.length,
      2
    )
  } finally {
    await db.close()
  }
})
test('web role can capture/readiness but cannot read leads, dispatch, erase or alter schema', async () => {
  const { db, port } = await setup()
  try {
    await db.exec('SET ROLE carolina_web')
    assert.equal(
      (
        await db.query<{ ready: boolean }>(
          'SELECT carolina.intake_ready() AS ready'
        )
      ).rows[0].ready,
      true
    )
    await seed(port)
    for (const sql of [
      'SELECT * FROM carolina.lead_requests',
      "SELECT carolina.release_outbox('forbidden')",
      'DELETE FROM carolina.lead_requests',
      'CREATE TABLE carolina.forbidden(id int)',
    ])
      await assert.rejects(db.query(sql))
    await db.exec('RESET ROLE')
    assert.equal(
      (await db.query('SELECT * FROM carolina.lead_requests')).rows.length,
      1
    )
  } finally {
    await db.close()
  }
})
test('local CRM port confirms assignment/followup, persists audit, prevents duplicate/replayed finish', async () => {
  const { db, port } = await setup()
  try {
    const id = await seed(port)
    assert.equal(await processOne(port, transport, tenant), 'idle')
    await db.query('SELECT carolina.release_outbox($1)', [tenant])
    assert.equal(await processOne(port, transport, 'wrong-tenant'), 'idle')
    await db.exec('SET ROLE carolina_worker')
    assert.equal(await processOne(port, transport, tenant), 'delivered')
    assert.equal(await processOne(port, transport, tenant), 'idle')
    await assert.rejects(db.query('SELECT * FROM carolina.lead_requests'))
    await db.exec('RESET ROLE')
    const row = (
      await db.query<{ status: string; crm_receipt: { assignmentId: string } }>(
        'SELECT * FROM carolina.crm_outbox'
      )
    ).rows[0]
    assert.equal(row.status, 'delivered')
    assert.equal(row.crm_receipt.assignmentId, 'synthetic-assignment')
    assert.equal(
      (
        await db.query<{ accepted: boolean }>(
          "SELECT carolina.finish_outbox($1,$2,$3,'retry',NULL,'transient') AS accepted",
          [id, tenant, randomUUID()]
        )
      ).rows[0].accepted,
      false
    )
    assert.ok(
      (
        await db.query<{ event: string }>(
          'SELECT event FROM carolina.lead_audit'
        )
      ).rows.some((r) => r.event === 'crm_delivery_confirmed')
    )
  } finally {
    await db.close()
  }
})
test('transient failures back off, exhaust into dead letter, operator requeues; raw errors never stored', async () => {
  const { db, port } = await setup()
  try {
    const id = await seed(port)
    await db.query('SELECT carolina.release_outbox($1)', [tenant])
    const failed: CrmTransport = {
      deliver: async () => {
        throw new Error('sensitive remote response not for logs')
      },
    }
    for (let i = 0; i < 5; i++) {
      assert.equal(
        await processOne(port, failed, tenant),
        i === 4 ? 'dead' : 'retry'
      )
      if (i < 4) {
        assert.equal(await processOne(port, failed, tenant), 'idle')
        await db.exec(
          "UPDATE carolina.crm_outbox SET next_attempt_at=now()-interval '1 second'"
        )
      }
    }
    const row = (
      await db.query<{ status: string; error_code: string }>(
        'SELECT * FROM carolina.crm_outbox'
      )
    ).rows[0]
    assert.equal(row.status, 'dead')
    assert.equal(row.error_code, 'transient')
    await db.exec('SET ROLE carolina_operator')
    assert.equal(
      (
        await db.query<{ ok: boolean }>(
          'SELECT carolina.requeue_outbox($1,$2) AS ok',
          [id, tenant]
        )
      ).rows[0].ok,
      true
    )
    await db.exec('RESET ROLE')
    assert.equal(await processOne(port, transport, tenant), 'delivered')
  } finally {
    await db.close()
  }
})
test('tenant/receipt contract mismatch dead-letters; local interface is not a ClientVerse API contract', async () => {
  const { db, port } = await setup()
  try {
    await seed(port)
    await db.query('SELECT carolina.release_outbox($1)', [tenant])
    assert.equal(
      await processOne(
        port,
        {
          deliver: async (e) => ({
            ...(await transport.deliver(e, new AbortController().signal)),
            tenantId: 'wrong-tenant',
          }),
        },
        tenant
      ),
      'dead'
    )
    assert.equal(
      (
        await db.query<{ error_code: string }>(
          'SELECT error_code FROM carolina.crm_outbox'
        )
      ).rows[0].error_code,
      'contract'
    )
  } finally {
    await db.close()
  }
})
test('crashed lease recovery invalidates old token; explicit permanent failures dead-letter', async () => {
  const { db, port } = await setup()
  try {
    const id = await seed(port)
    await db.query('SELECT carolina.release_outbox($1)', [tenant])
    const old = randomUUID()
    await db.query('SELECT * FROM carolina.claim_outbox($1,$2)', [tenant, old])
    await db.exec(
      "UPDATE carolina.crm_outbox SET lease_until=now()-interval '1 second'"
    )
    const lease = (
      await db.query('SELECT * FROM carolina.claim_outbox($1,$2)', [
        tenant,
        randomUUID(),
      ])
    ).rows
    assert.equal(lease.length, 1)
    assert.equal(
      (
        await db.query<{ ok: boolean }>(
          "SELECT carolina.finish_outbox($1,$2,$3,'retry',NULL,'transient') AS ok",
          [id, tenant, old]
        )
      ).rows[0].ok,
      false
    )
    await db.exec(
      "UPDATE carolina.crm_outbox SET lease_until=now()-interval '1 second'"
    )
    assert.equal(
      await processOne(
        port,
        {
          deliver: async () => {
            throw new DeliveryFailure('permanent')
          },
        },
        tenant
      ),
      'dead'
    )
  } finally {
    await db.close()
  }
})
test('retention requires explicit policy, preserves pending, removes delivered PII and records only counts', async () => {
  const { db, port } = await setup()
  try {
    const id = await seed(port)
    await db.exec(
      "UPDATE carolina.lead_requests SET created_at=now()-interval '100 days'"
    )
    await assert.rejects(db.query('SELECT carolina.prune_delivered(0)'))
    assert.equal(
      (
        await db.query<{ n: number }>(
          'SELECT carolina.prune_delivered(30) AS n'
        )
      ).rows[0].n,
      0
    )
    await db.query('SELECT carolina.release_outbox($1)', [tenant])
    await processOne(port, transport, tenant)
    await db.exec('SET ROLE carolina_operator')
    assert.equal(
      (
        await db.query<{ n: number }>(
          'SELECT carolina.prune_delivered(30) AS n'
        )
      ).rows[0].n,
      1
    )
    await db.exec('RESET ROLE')
    for (const table of ['lead_requests', 'lead_audit', 'crm_outbox'])
      assert.equal(
        (await db.query(`SELECT * FROM carolina.${table}`)).rows.length,
        0
      )
    assert.ok(
      (await db.query('SELECT * FROM carolina.operations_audit')).rows.length >
        0
    )
    assert.ok(id)
    await db.exec('SET ROLE carolina_operator')
    assert.equal(
      (await db.query('SELECT * FROM carolina.outbox_status()')).rows.length,
      0
    )
    await db.exec('RESET ROLE')
  } finally {
    await db.close()
  }
})

test('all service HTTP handlers persist consent and outbox with real SQL, return duplicate receipt and fail closed on storage loss', async () => {
  const { db, port } = await setup()
  try {
    const { NextRequest } = await import('next/server')
    const { submitLead } = await import('../lib/lead-endpoint')
    let index = 0
    for (const [journey, service] of [
      ['visibility', 'visibility'],
      ['consulting', 'blueprint'],
      ['website', 'website-quote'],
      ['consulting', 'automation'],
      ['consulting', 'management'],
      ['contact', 'contact'],
    ]) {
      const id = randomUUID()
      const payload = {
        journey,
        service,
        name: 'Synthetic',
        business: 'Test only',
        email: 'test@example.com',
        goal: service,
        consent: true,
        startedAt: Date.now() - 5000,
        requestId: id,
      }
      const request = () =>
        new NextRequest('https://test.example/api/leads', {
          method: 'POST',
          headers: {
            origin: 'https://test.example',
            'content-type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      const dependencies = {
        enabled: () => true,
        store: (lead: Parameters<typeof captureLead>[1], requestId: string) =>
          captureLead(
            async (sql, values) => port.query(sql, values),
            lead,
            requestId,
            `192.0.2.${++index}`,
            'local-test-secret-not-a-credential'
          ),
      }
      const response = await submitLead(request(), dependencies)
      assert.equal(response.status, 201)
      assert.equal((await response.json()).id, id)
      assert.equal((await submitLead(request(), dependencies)).status, 200)
      assert.equal(
        (
          await submitLead(request(), {
            enabled: () => true,
            store: async () => {
              throw new Error('storage unavailable')
            },
          })
        ).status,
        503
      )
    }
    assert.equal(
      (await db.query('SELECT * FROM carolina.lead_requests')).rows.length,
      6
    )
    assert.equal(
      (await db.query('SELECT * FROM carolina.crm_outbox')).rows.length,
      6
    )
  } finally {
    await db.close()
  }
})

test('timed-out transport leaves retryable lease-safe state and no receipt', async () => {
  const { db, port } = await setup()
  try {
    await seed(port)
    await db.query('SELECT carolina.release_outbox($1)', [tenant])
    let aborted = false
    assert.equal(
      await processOne(
        port,
        {
          deliver: async (_e, signal) =>
            new Promise((_resolve, reject) => {
              signal.addEventListener('abort', () => {
                aborted = true
                reject(new DeliveryFailure('timeout'))
              })
            }),
        },
        tenant
      ),
      'retry'
    )
    assert.equal(aborted, true)
    const row = (
      await db.query<{
        status: string
        error_code: string
        crm_receipt: unknown
      }>('SELECT status,error_code,crm_receipt FROM carolina.crm_outbox')
    ).rows[0]
    assert.equal(row.status, 'pending')
    assert.equal(row.error_code, 'timeout')
    assert.equal(row.crm_receipt, null)
  } finally {
    await db.close()
  }
})
test('privacy erasure refuses active delivery and operator role cannot bypass table boundaries', async () => {
  const { db, port } = await setup()
  try {
    const id = await seed(port)
    await db.query('SELECT carolina.release_outbox($1)', [tenant])
    await db.query('SELECT * FROM carolina.claim_outbox($1,$2)', [
      tenant,
      randomUUID(),
    ])
    await db.exec('SET ROLE carolina_operator')
    await assert.rejects(
      db.query('SELECT carolina.erase_lead($1)', [id]),
      /active delivery/
    )
    await assert.rejects(db.query('SELECT * FROM carolina.lead_requests'))
    await db.exec('RESET ROLE')
    await db.exec(
      "UPDATE carolina.crm_outbox SET lease_until=now()-interval '1 second'"
    )
    await db.exec('SET ROLE carolina_operator')
    assert.equal(
      (
        await db.query<{ n: number }>('SELECT carolina.erase_lead($1) AS n', [
          id,
        ])
      ).rows[0].n,
      1
    )
  } finally {
    await db.close()
  }
})

test('lost local acknowledgment recovers lease with stable idempotency key and one synthetic remote effect', async () => {
  const { db, port } = await setup()
  try {
    await seed(port)
    await db.query('SELECT carolina.release_outbox($1)', [tenant])
    const effects = new Set<string>()
    const adapter: CrmTransport = {
      deliver: async (e) => {
        effects.add(e.idempotencyKey)
        return transport.deliver(e, new AbortController().signal)
      },
    }
    const broken: Database = {
      query: async (sql, values) => {
        if (sql.includes('finish_outbox')) throw new Error('ack store lost')
        return port.query(sql, values)
      },
    }
    await assert.rejects(processOne(broken, adapter, tenant))
    assert.equal(
      (
        await db.query<{ status: string }>(
          'SELECT status FROM carolina.crm_outbox'
        )
      ).rows[0].status,
      'processing'
    )
    await db.exec(
      "UPDATE carolina.crm_outbox SET lease_until=now()-interval '1 second'"
    )
    assert.equal(await processOne(port, adapter, tenant), 'delivered')
    assert.equal(effects.size, 1)
  } finally {
    await db.close()
  }
})
