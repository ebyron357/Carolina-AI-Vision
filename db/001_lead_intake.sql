-- Apply manually to an owner-approved PostgreSQL database. Never auto-migrate at runtime.
CREATE SCHEMA IF NOT EXISTS carolina;
REVOKE ALL ON SCHEMA carolina FROM PUBLIC;
CREATE TABLE carolina.lead_requests (
 id uuid PRIMARY KEY,
 fingerprint text NOT NULL,
 payload jsonb NOT NULL,
 classification text NOT NULL,
 follow_up_queue text NOT NULL,
 consented_at timestamptz NOT NULL DEFAULT now(),
 privacy_version text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX lead_fingerprint_created ON carolina.lead_requests(fingerprint, created_at DESC);
CREATE TABLE carolina.intake_limits (
 key text PRIMARY KEY, count integer NOT NULL, expires_at timestamptz NOT NULL
);
CREATE TABLE carolina.lead_audit (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 lead_id uuid NOT NULL REFERENCES carolina.lead_requests(id),
 event text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE carolina.crm_outbox (
 lead_id uuid PRIMARY KEY REFERENCES carolina.lead_requests(id),
 status text NOT NULL DEFAULT 'pending_configuration' CHECK (status IN ('pending_configuration','pending','delivered','failed')),
 attempts integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON ALL TABLES IN SCHEMA carolina FROM PUBLIC;
-- Atomic function: limiter, deduplication, lead, audit and pending CRM handoff commit together.
CREATE OR REPLACE FUNCTION carolina.capture_lead(
 request_id uuid, digest text, rate_key text, lead_payload jsonb,
 lead_class text, followup text, notice_version text
) RETURNS TABLE(id uuid, duplicate boolean, limited boolean)
LANGUAGE plpgsql AS $$
DECLARE hits integer; existing_id uuid;
BEGIN
 INSERT INTO carolina.intake_limits AS limits(key,count,expires_at)
 VALUES(rate_key,1,now()+interval '10 minutes')
 ON CONFLICT(key) DO UPDATE SET
 count=CASE WHEN limits.expires_at<=now() THEN 1 ELSE limits.count+1 END,
 expires_at=CASE WHEN limits.expires_at<=now() THEN now()+interval '10 minutes' ELSE limits.expires_at END
 RETURNING count INTO hits;
 IF hits>5 THEN RETURN QUERY SELECT NULL::uuid,false,true; RETURN; END IF;
 -- Serialize equal fingerprints across instances, including different request IDs.
 PERFORM pg_advisory_xact_lock(hashtextextended(digest,0));
 SELECT r.id INTO existing_id FROM carolina.lead_requests r
 WHERE (r.id=request_id AND r.fingerprint=digest)
 OR (r.fingerprint=digest AND r.created_at>now()-interval '24 hours')
 ORDER BY r.created_at DESC LIMIT 1;
 IF existing_id IS NOT NULL THEN RETURN QUERY SELECT existing_id,true,false; RETURN; END IF;
 INSERT INTO carolina.lead_requests(id,fingerprint,payload,classification,follow_up_queue,privacy_version)
 VALUES(request_id,digest,lead_payload,lead_class,followup,notice_version);
 INSERT INTO carolina.lead_audit(lead_id,event) VALUES(request_id,'consent_and_request_stored');
 INSERT INTO carolina.crm_outbox(lead_id) VALUES(request_id);
 RETURN QUERY SELECT request_id,false,false;
END $$;
REVOKE ALL ON FUNCTION carolina.capture_lead(uuid,text,text,jsonb,text,text,text) FROM PUBLIC;
-- Runtime role needs USAGE on schema, EXECUTE on function, SELECT/INSERT on lead_requests,
-- INSERT/UPDATE/SELECT on intake_limits, INSERT on lead_audit/crm_outbox,
-- and USAGE on the lead_audit identity sequence. No browser credentials, SELECT API, or admin UI.
-- Operator must schedule expiry of old intake_limits and approved lead/audit/outbox retention.
