-- Run after 001 with a dedicated migration owner; never as the public runtime role.
CREATE TABLE carolina.schema_versions(version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
INSERT INTO carolina.schema_versions(version) VALUES(1),(2);
CREATE TABLE carolina.operations_audit(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,event text NOT NULL, affected integer NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE carolina.crm_outbox DROP CONSTRAINT crm_outbox_status_check;
ALTER TABLE carolina.crm_outbox ADD CONSTRAINT crm_outbox_status_check CHECK(status IN ('pending_configuration','pending','processing','delivered','dead'));
ALTER TABLE carolina.crm_outbox ADD COLUMN tenant_id text, ADD COLUMN lease_token uuid, ADD COLUMN lease_until timestamptz, ADD COLUMN next_attempt_at timestamptz NOT NULL DEFAULT now(), ADD COLUMN error_code text, ADD COLUMN crm_receipt jsonb;
CREATE INDEX outbox_due ON carolina.crm_outbox(status,next_attempt_at);
-- No table reads/writes for the web role. Fixed search_path and trusted owner are mandatory.
ALTER FUNCTION carolina.capture_lead(uuid,text,text,jsonb,text,text,text) SECURITY DEFINER;
ALTER FUNCTION carolina.capture_lead(uuid,text,text,jsonb,text,text,text) SET search_path = pg_catalog, carolina;
CREATE FUNCTION carolina.intake_ready() RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path=pg_catalog,carolina AS $$ SELECT EXISTS(SELECT 1 FROM carolina.schema_versions WHERE version=2) $$;
CREATE FUNCTION carolina.release_outbox(tenant text) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,carolina AS $$
DECLARE n integer;
BEGIN
 IF tenant IS NULL OR length(tenant)<1 OR length(tenant)>160 THEN RAISE EXCEPTION 'invalid tenant'; END IF;
 UPDATE carolina.crm_outbox SET status='pending',tenant_id=tenant WHERE status='pending_configuration';
 GET DIAGNOSTICS n=ROW_COUNT;
 INSERT INTO carolina.operations_audit(event,affected) VALUES('outbox_released',n); RETURN n;
END $$;
CREATE FUNCTION carolina.claim_outbox(tenant text, token uuid) RETURNS TABLE(lead_id uuid,payload jsonb,classification text,follow_up_queue text,attempt integer,tenant_id text) LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,carolina AS $$
DECLARE chosen uuid;
BEGIN
 -- Exhausted crashed leases become dead letters, never silently disappear.
 WITH exhausted AS (UPDATE carolina.crm_outbox AS x SET status='dead',error_code='lease_exhausted',lease_token=NULL,lease_until=NULL WHERE x.tenant_id=tenant AND x.status='processing' AND x.lease_until<now() AND x.attempts>=5 RETURNING x.lead_id)
 INSERT INTO carolina.lead_audit(lead_id,event) SELECT exhausted.lead_id,'crm_dead_letter' FROM exhausted;
 SELECT o.lead_id INTO chosen FROM carolina.crm_outbox o WHERE o.tenant_id=tenant AND o.attempts<5 AND ((o.status='pending' AND o.next_attempt_at<=now()) OR (o.status='processing' AND o.lease_until<now())) ORDER BY o.next_attempt_at,o.lead_id FOR UPDATE SKIP LOCKED LIMIT 1;
 IF chosen IS NULL THEN RETURN; END IF;
 UPDATE carolina.crm_outbox SET status='processing',attempts=attempts+1,lease_token=token,lease_until=now()+interval '2 minutes' WHERE crm_outbox.lead_id=chosen;
 INSERT INTO carolina.lead_audit(lead_id,event) VALUES(chosen,'crm_attempt_claimed');
 RETURN QUERY SELECT r.id,r.payload,r.classification,r.follow_up_queue,o.attempts,o.tenant_id FROM carolina.lead_requests r JOIN carolina.crm_outbox o ON o.lead_id=r.id WHERE r.id=chosen;
END $$;
CREATE FUNCTION carolina.finish_outbox(request_id uuid,tenant text,token uuid,outcome text,receipt jsonb,code text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,carolina AS $$
DECLARE n integer;
BEGIN
 IF outcome NOT IN ('delivered','retry','dead') OR code NOT IN ('none','transient','permanent','contract','timeout') THEN RAISE EXCEPTION 'invalid outcome'; END IF;
 IF outcome='delivered' AND (receipt IS NULL OR receipt->>'tenantId' IS DISTINCT FROM tenant OR receipt->>'correlationId' IS DISTINCT FROM request_id::text OR coalesce(receipt->>'crmLeadId','')='' OR coalesce(receipt->>'assignmentId','')='' OR coalesce(receipt->>'followupId','')='') THEN RAISE EXCEPTION 'invalid receipt'; END IF;
 UPDATE carolina.crm_outbox SET status=CASE WHEN outcome='retry' AND attempts<5 THEN 'pending' WHEN outcome='retry' THEN 'dead' ELSE outcome END,
 next_attempt_at=now()+(least(3600,30*power(2,attempts-1))::integer*interval '1 second'),
 error_code=code,crm_receipt=CASE WHEN outcome='delivered' THEN receipt ELSE NULL END,lease_token=NULL,lease_until=NULL
 WHERE lead_id=request_id AND tenant_id=tenant AND status='processing' AND lease_token=token AND lease_until>now();
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n=1 THEN INSERT INTO carolina.lead_audit(lead_id,event) SELECT request_id,CASE WHEN status='delivered' THEN 'crm_delivery_confirmed' WHEN status='dead' THEN 'crm_dead_letter' ELSE 'crm_retry_scheduled' END FROM carolina.crm_outbox WHERE lead_id=request_id; END IF;
 RETURN n=1;
END $$;
CREATE FUNCTION carolina.requeue_outbox(request_id uuid,tenant text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,carolina AS $$
DECLARE n integer;
BEGIN
 UPDATE carolina.crm_outbox SET status='pending',attempts=0,error_code=NULL,next_attempt_at=now() WHERE lead_id=request_id AND tenant_id=tenant AND status='dead';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n=1 THEN INSERT INTO carolina.lead_audit(lead_id,event) VALUES(request_id,'crm_operator_requeued'); END IF; RETURN n=1;
END $$;
CREATE FUNCTION carolina.erase_lead(request_id uuid) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,carolina AS $$
DECLARE n integer;
BEGIN
 -- Do not erase an actively leased delivery; operator must stop worker and await lease expiry.
 PERFORM 1 FROM carolina.crm_outbox WHERE lead_id=request_id FOR UPDATE;
 IF EXISTS(SELECT 1 FROM carolina.crm_outbox WHERE lead_id=request_id AND status='processing' AND lease_until>now()) THEN RAISE EXCEPTION 'active delivery'; END IF;
 DELETE FROM carolina.lead_audit WHERE lead_id=request_id; DELETE FROM carolina.crm_outbox WHERE lead_id=request_id; DELETE FROM carolina.lead_requests WHERE id=request_id;
 GET DIAGNOSTICS n=ROW_COUNT;
 INSERT INTO carolina.operations_audit(event,affected) VALUES('lead_erased',n); RETURN n;
END $$;
CREATE FUNCTION carolina.prune_delivered(retention_days integer) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,carolina AS $$
DECLARE n integer=0; row_id uuid;
BEGIN
 IF retention_days<1 OR retention_days>3650 OR retention_days IS NULL THEN RAISE EXCEPTION 'explicit retention required'; END IF;
 DELETE FROM carolina.intake_limits WHERE expires_at<now();
 FOR row_id IN SELECT r.id FROM carolina.lead_requests r JOIN carolina.crm_outbox o ON o.lead_id=r.id WHERE r.created_at<now()-(retention_days*interval '1 day') AND o.status='delivered' LOOP n=n+carolina.erase_lead(row_id); END LOOP;
 INSERT INTO carolina.operations_audit(event,affected) VALUES('retention_run',n); RETURN n;
END $$;
-- Group roles contain no passwords or login rights. Provider operator assigns separate LOGIN identities.
CREATE ROLE carolina_web NOLOGIN;
CREATE ROLE carolina_worker NOLOGIN;
CREATE ROLE carolina_operator NOLOGIN;
REVOKE ALL ON ALL TABLES IN SCHEMA carolina FROM PUBLIC,carolina_web,carolina_worker,carolina_operator;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA carolina FROM PUBLIC,carolina_web,carolina_worker,carolina_operator;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA carolina FROM PUBLIC;
GRANT USAGE ON SCHEMA carolina TO carolina_web,carolina_worker,carolina_operator;
GRANT EXECUTE ON FUNCTION carolina.capture_lead(uuid,text,text,jsonb,text,text,text),carolina.intake_ready() TO carolina_web;
GRANT EXECUTE ON FUNCTION carolina.claim_outbox(text,uuid),carolina.finish_outbox(uuid,text,uuid,text,jsonb,text) TO carolina_worker;
GRANT EXECUTE ON FUNCTION carolina.release_outbox(text),carolina.requeue_outbox(uuid,text),carolina.erase_lead(uuid),carolina.prune_delivered(integer) TO carolina_operator;

CREATE FUNCTION carolina.outbox_status() RETURNS TABLE(state text,total bigint) LANGUAGE sql SECURITY DEFINER SET search_path=pg_catalog,carolina AS $$ SELECT status,count(*) FROM carolina.crm_outbox GROUP BY status $$;
REVOKE ALL ON FUNCTION carolina.outbox_status() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION carolina.outbox_status() TO carolina_operator;
ALTER DEFAULT PRIVILEGES IN SCHEMA carolina REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
