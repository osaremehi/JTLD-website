-- ============================================================
-- Migration 003: Jobs, Employers, Applications
-- Applied: May 10, 2026
-- ============================================================

-- ── Extend candidates with missing Phase 1 fields ────────────
ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS availability TEXT CHECK (availability IN ('immediate', '2-weeks', '1-month', 'flexible')),
  ADD COLUMN IF NOT EXISTS desired_rate NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS work_arrangement TEXT CHECK (work_arrangement IN ('remote', 'hybrid', 'onsite', 'any'));

-- ── Employers ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  website TEXT,
  description TEXT,
  logo_url TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE employers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "employers_select_own" ON employers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "employers_insert_own" ON employers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "employers_update_own" ON employers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "employers_admin_all" ON employers
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

CREATE OR REPLACE FUNCTION update_employers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employers_updated_at
  BEFORE UPDATE ON employers
  FOR EACH ROW EXECUTE FUNCTION update_employers_updated_at();

-- ── Jobs ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES employers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  skills_required TEXT[] DEFAULT '{}',
  location TEXT NOT NULL,
  work_arrangement TEXT NOT NULL CHECK (work_arrangement IN ('remote', 'hybrid', 'onsite')),
  employment_type TEXT NOT NULL CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'temp')),
  salary_min NUMERIC(10,2),
  salary_max NUMERIC(10,2),
  currency TEXT NOT NULL DEFAULT 'CAD',
  experience_level TEXT NOT NULL CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Public can read active jobs
CREATE POLICY "jobs_select_active" ON jobs
  FOR SELECT USING (is_active = true);

-- Employer can read all their own jobs (including inactive)
CREATE POLICY "jobs_select_own" ON jobs
  FOR SELECT USING (
    employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid())
  );

CREATE POLICY "jobs_insert_own" ON jobs
  FOR INSERT WITH CHECK (
    employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid())
  );

CREATE POLICY "jobs_update_own" ON jobs
  FOR UPDATE USING (
    employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid())
  );

CREATE POLICY "jobs_admin_all" ON jobs
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

CREATE INDEX IF NOT EXISTS jobs_is_active_idx ON jobs (is_active);
CREATE INDEX IF NOT EXISTS jobs_posted_at_idx ON jobs (posted_at DESC);
CREATE INDEX IF NOT EXISTS jobs_employment_type_idx ON jobs (employment_type);
CREATE INDEX IF NOT EXISTS jobs_work_arrangement_idx ON jobs (work_arrangement);
CREATE INDEX IF NOT EXISTS jobs_experience_level_idx ON jobs (experience_level);

CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_jobs_updated_at();

-- ── Applications ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'hired')),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (job_id, candidate_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Candidate can read their own applications
CREATE POLICY "applications_select_candidate" ON applications
  FOR SELECT USING (
    candidate_id IN (SELECT id FROM candidates WHERE user_id = auth.uid())
  );

-- Candidate can insert their own applications
CREATE POLICY "applications_insert_candidate" ON applications
  FOR INSERT WITH CHECK (
    candidate_id IN (SELECT id FROM candidates WHERE user_id = auth.uid())
  );

-- Employer can read applications for their jobs
CREATE POLICY "applications_select_employer" ON applications
  FOR SELECT USING (
    job_id IN (
      SELECT j.id FROM jobs j
      JOIN employers e ON j.employer_id = e.id
      WHERE e.user_id = auth.uid()
    )
  );

-- Employer can update status on applications for their jobs
CREATE POLICY "applications_update_employer" ON applications
  FOR UPDATE USING (
    job_id IN (
      SELECT j.id FROM jobs j
      JOIN employers e ON j.employer_id = e.id
      WHERE e.user_id = auth.uid()
    )
  );

CREATE POLICY "applications_admin_all" ON applications
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

CREATE INDEX IF NOT EXISTS applications_candidate_idx ON applications (candidate_id);
CREATE INDEX IF NOT EXISTS applications_job_idx ON applications (job_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications (status);

CREATE OR REPLACE FUNCTION update_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_applications_updated_at();

-- ── Fix missing RLS policies from migration 001 ───────────────

-- contact_submissions: admin read
CREATE POLICY "contact_submissions_admin_select" ON contact_submissions
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

-- blog_posts: public read published posts
CREATE POLICY "blog_posts_public_select" ON blog_posts
  FOR SELECT USING (status = 'published');

-- blog_posts: admin full access
CREATE POLICY "blog_posts_admin_all" ON blog_posts
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

-- page_views: admin read
CREATE POLICY "page_views_admin_select" ON page_views
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );
