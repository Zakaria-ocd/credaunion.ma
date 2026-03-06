-- ============================================
-- Admin Dashboard Migration
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only service_role can access admin_users (no public access at all)
CREATE POLICY "Service role full access on admin_users"
  ON admin_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Revoke all access from anon and authenticated roles
REVOKE ALL ON admin_users FROM anon, authenticated;

-- Grant access only to service_role
GRANT ALL ON admin_users TO service_role;


-- 2. Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT DEFAULT '' NOT NULL,
  excerpt TEXT DEFAULT '' NOT NULL,
  cover_image_url TEXT DEFAULT '' NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  author_id UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "Public can read published articles"
  ON articles
  FOR SELECT
  USING (published_at IS NOT NULL);

-- Service role has full access (for admin operations via API)
CREATE POLICY "Service role full access on articles"
  ON articles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant SELECT to anon for public reading
GRANT SELECT ON articles TO anon;
GRANT ALL ON articles TO service_role;


-- 3. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '' NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can insert contact messages
CREATE POLICY "Public can insert contact messages"
  ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Service role has full access (for admin reading/managing)
CREATE POLICY "Service role full access on contact_messages"
  ON contact_messages
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant INSERT to anon for public form submissions
GRANT INSERT ON contact_messages TO anon;
GRANT ALL ON contact_messages TO service_role;


-- Add a default admin user (admin_2026@gmail.com / /admin@$2026$@/)
-- PBKDF2 hash (100k iterations): eaa28369c89a4e93cd34c810420375a2:bf51f1d47357cae103b9fecf31c1ea76416166b08054c7c3279a69ed1f1c7cddbaceb86594dac8870c7745c14bb690a9a6dba1be51d33f4557ed5e84406e3c3e
INSERT INTO admin_users (email, password_hash)
VALUES ('admin_2026@gmail.com', 'eaa28369c89a4e93cd34c810420375a2:bf51f1d47357cae103b9fecf31c1ea76416166b08054c7c3279a69ed1f1c7cddbaceb86594dac8870c7745c14bb690a9a6dba1be51d33f4557ed5e84406e3c3e')
ON CONFLICT (email) DO NOTHING;
