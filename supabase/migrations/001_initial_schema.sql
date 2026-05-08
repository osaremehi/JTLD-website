-- supabase/migrations/001_initial_schema.sql
-- JTLD Consulting Inc — Initial Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor

-- ══════════════════════════════════════════════
-- 1. Contact Submissions
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS contact_submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT,
  service       TEXT,
  message       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);

-- ══════════════════════════════════════════════
-- 2. Blog Posts
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  excerpt       TEXT,
  content       TEXT NOT NULL,
  cover_image   TEXT,
  author_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name   TEXT NOT NULL DEFAULT 'JTLD Consulting',
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags          TEXT[] DEFAULT '{}',
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at DESC);

-- ══════════════════════════════════════════════
-- 3. Admin Profiles (extends Supabase auth.users)
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS admin_profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('editor', 'admin', 'super_admin')),
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════
-- 4. Site Analytics (simple page view counter)
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS page_views (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path     TEXT NOT NULL,
  referrer      TEXT,
  user_agent    TEXT,
  ip_hash       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_page_views_created ON page_views(created_at DESC);

-- ══════════════════════════════════════════════
-- 5. Auto-update updated_at trigger
-- ══════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_contact_submissions_updated
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_blog_posts_updated
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_admin_profiles_updated
  BEFORE UPDATE ON admin_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════════════
-- 6. Row Level Security (RLS)
-- ══════════════════════════════════════════════

-- Contact submissions: public can INSERT, only authenticated can SELECT/UPDATE
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update submissions"
  ON contact_submissions FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Blog posts: public can read published, authenticated can do everything
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create posts"
  ON blog_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update posts"
  ON blog_posts FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts FOR DELETE
  USING (auth.role() = 'authenticated');

-- Admin profiles: only the user themselves or authenticated
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON admin_profiles FOR SELECT
  USING (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
  ON admin_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Page views: anyone can insert, only authenticated can read
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log page views"
  ON page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics"
  ON page_views FOR SELECT
  USING (auth.role() = 'authenticated');
