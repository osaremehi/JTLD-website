-- Migration 004: Job Alerts
-- Allows candidates to save search criteria and receive daily email digests

CREATE TABLE IF NOT EXISTS job_alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  label        TEXT,                           -- optional user-defined name
  q            TEXT,                           -- keyword search
  location     TEXT,
  work_arrangement TEXT CHECK (work_arrangement IN ('remote','hybrid','onsite','any')),
  employment_type  TEXT CHECK (employment_type IN ('full-time','part-time','contract','temp')),
  experience_level TEXT CHECK (experience_level IN ('entry','mid','senior','executive')),
  frequency    TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily','weekly')),
  last_sent_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for cron: find unsent or overdue alerts
CREATE INDEX IF NOT EXISTS job_alerts_last_sent_idx ON job_alerts (last_sent_at NULLS FIRST);
CREATE INDEX IF NOT EXISTS job_alerts_candidate_idx ON job_alerts (candidate_id);

-- RLS
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY job_alerts_candidate_select ON job_alerts
  FOR SELECT USING (
    candidate_id IN (SELECT id FROM candidates WHERE user_id = auth.uid())
  );

CREATE POLICY job_alerts_candidate_insert ON job_alerts
  FOR INSERT WITH CHECK (
    candidate_id IN (SELECT id FROM candidates WHERE user_id = auth.uid())
  );

CREATE POLICY job_alerts_candidate_delete ON job_alerts
  FOR DELETE USING (
    candidate_id IN (SELECT id FROM candidates WHERE user_id = auth.uid())
  );

CREATE POLICY job_alerts_admin_all ON job_alerts
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );
