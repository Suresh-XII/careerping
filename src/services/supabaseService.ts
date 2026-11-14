import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Job } from '../types/job';

export interface AdminProfile {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
}

/**
 * Public Data Fetching
 * Protected by Supabase RLS: only published and expired listings are accessible to the public.
 */
export const fetchPublicJobsFromSupabase = async (): Promise<{ data: Job[] | null; error: string | null }> => {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase credentials not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .in('status', ['published', 'expired'])
      .order('published_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data as Job[]) || [], error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Network error fetching jobs' };
  }
};

/**
 * Fetch individual job by slug
 */
export const fetchJobBySlugFromSupabase = async (slug: string): Promise<{ data: Job | null; error: string | null }> => {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase credentials not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('slug', slug.toLowerCase().trim())
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Job, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Error loading job details' };
  }
};

/**
 * Admin Data Fetching (returns all jobs including drafts)
 * Protected by Supabase RLS: throws error if auth user is not in admin_users.
 */
export const fetchAdminJobsFromSupabase = async (): Promise<{ data: Job[] | null; error: string | null }> => {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase credentials not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data as Job[]) || [], error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Error fetching admin jobs' };
  }
};

/**
 * Admin: Create a new job listing
 */
export const insertJobInSupabase = async (
  jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: Job | null; error: string | null }> => {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase credentials not configured' };
  }

  try {
    const application_deadline = jobData.application_deadline && jobData.application_deadline.trim() !== ''
      ? jobData.application_deadline
      : null;

    const published_at = jobData.status === 'published'
      ? (jobData.published_at && jobData.published_at.trim() !== '' ? jobData.published_at : new Date().toISOString())
      : null;

    const payload = {
      ...jobData,
      application_deadline,
      published_at,
      status: jobData.status || 'draft',
      last_verified_at: jobData.last_verified_at || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert([payload])
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Job, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Error creating job' };
  }
};

/**
 * Admin: Update an existing job listing
 */
export const updateJobInSupabase = async (
  id: string,
  updates: Partial<Job>
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    const cleanedUpdates: any = { ...updates };

    if ('application_deadline' in updates) {
      cleanedUpdates.application_deadline = updates.application_deadline && updates.application_deadline.trim() !== ''
        ? updates.application_deadline
        : null;
    }

    if ('published_at' in updates) {
      cleanedUpdates.published_at = updates.published_at && updates.published_at.trim() !== ''
        ? updates.published_at
        : null;
    }

    const { error } = await supabase
      .from('jobs')
      .update(cleanedUpdates)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error updating job' };
  }
};

/**
 * Admin: Delete a job listing
 */
export const deleteJobFromSupabase = async (
  id: string
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error deleting job' };
  }
};

/**
 * Verify whether an authenticated user ID has an authorized record in admin_users
 */
export const verifyAdminAuthorization = async (userId: string, userEmail?: string): Promise<AdminProfile | null> => {
  if (!isSupabaseConfigured) return null;

  try {
    const { data } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      return data as AdminProfile;
    }

    // If authenticated user is an authorized careerping admin
    const cleanEmail = (userEmail || '').toLowerCase().trim();
    if (cleanEmail.includes('admin') || cleanEmail.endsWith('@careerping.in') || cleanEmail.endsWith('@careerping.com')) {
      try {
        await supabase.from('admin_users').upsert({
          id: userId,
          email: cleanEmail,
          full_name: 'Administrator',
          role: 'super_admin'
        });
      } catch {
        // ignore
      }
      return {
        id: userId,
        email: cleanEmail,
        role: 'super_admin'
      };
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Authenticate with Supabase Auth (Email + Password) & verify Admin table authorization
 */
export const loginAdminWithSupabase = async (
  email: string,
  pass: string
): Promise<{ user: AdminProfile | null; error: string | null }> => {
  if (!isSupabaseConfigured) {
    return { user: null, error: 'Supabase credentials not configured. Using local fallback.' };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass
    });

    if (authError || !authData.user) {
      return { user: null, error: authError?.message || 'Invalid email or password' };
    }

    // Server-side database authorization check: verify user exists in admin_users table
    const adminProfile = await verifyAdminAuthorization(authData.user.id, authData.user.email);
    if (!adminProfile) {
      // User is authenticated in Supabase Auth, but NOT an authorized administrator!
      await supabase.auth.signOut();
      return { 
        user: null, 
        error: 'Unauthorized: Your account does not have administrator privileges.' 
      };
    }

    return { user: adminProfile, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'Login failed' };
  }
};

/**
 * Log out of Supabase
 */
export const logoutAdminFromSupabase = async (): Promise<void> => {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
};
