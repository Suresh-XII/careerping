-- ====================================================================
-- CAREERPING MIGRATION 02: Row Level Security (RLS) Policies
-- ====================================================================

-- 1. Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated admin users can view the admin roster
CREATE POLICY "Admins can view admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin() OR auth.uid() = id);

-- Policy: Only super_admin can add/modify admin_users
CREATE POLICY "Super admins can manage admin_users"
ON public.admin_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- 2. Enable RLS on jobs table
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
-- Anonymous and public visitors can SELECT published or expired listings.
-- CRITICAL SECURITY RULE: Draft listings can NEVER be read by public visitors.
CREATE POLICY "Public can view published and expired jobs"
ON public.jobs
FOR SELECT
TO anon, authenticated
USING (status IN ('published', 'expired'));

-- Policy: Admin full access
-- Only verified administrators can SELECT all jobs (including drafts), INSERT, UPDATE, or DELETE.
CREATE POLICY "Authorized administrators have full control over jobs"
ON public.jobs
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Policy: Deny public write access explicitly
-- Public (anonymous) users can NEVER insert, update, or delete job records.
CREATE POLICY "Deny anon inserts"
ON public.jobs
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anon updates"
ON public.jobs
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anon deletes"
ON public.jobs
FOR DELETE
TO anon
USING (false);
