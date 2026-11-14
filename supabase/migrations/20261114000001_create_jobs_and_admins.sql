-- ====================================================================
-- CAREERPING MIGRATION 01: Create Jobs & Admin Users Tables
-- ====================================================================

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create admin_users table linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Comment on admin_users table
COMMENT ON TABLE public.admin_users IS 'Explicitly authorized administrators for Careerping job publishing.';

-- 2. Helper function to check if the requesting user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  );
$$;

-- 3. Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo TEXT,
  location TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience TEXT NOT NULL,
  employment_type TEXT NOT NULL CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract', 'Internship')),
  salary TEXT NOT NULL DEFAULT 'Not disclosed',
  category TEXT NOT NULL CHECK (category IN (
    'IT & Software',
    'Cybersecurity',
    'Freshers',
    'Internships',
    'Government Jobs',
    'Work From Home',
    'Banking & Finance',
    'Core Engineering'
  )),
  description TEXT NOT NULL,
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  eligibility TEXT[] NOT NULL DEFAULT '{}',
  selection_process TEXT[] DEFAULT '{}',
  application_deadline DATE,
  apply_url TEXT NOT NULL,
  source_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'expired')),
  featured BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Validation constraints
  CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$'),
  CONSTRAINT valid_apply_url CHECK (apply_url ~* '^https?://[^\s]+$')
);

-- Comments on jobs table
COMMENT ON TABLE public.jobs IS 'Verified job vacancy announcements published by Careerping.';
COMMENT ON COLUMN public.jobs.apply_url IS 'Direct URL to the genuine official employer careers page. No intermediaries.';

-- 4. Create performance and lookup indexes
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON public.jobs (slug);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs (category);
CREATE INDEX IF NOT EXISTS idx_jobs_published_at ON public.jobs (published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_jobs_source_url ON public.jobs (source_url);
CREATE INDEX IF NOT EXISTS idx_jobs_company_title ON public.jobs (lower(company), lower(title));

-- 5. Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_jobs_updated_at ON public.jobs;
CREATE TRIGGER set_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
