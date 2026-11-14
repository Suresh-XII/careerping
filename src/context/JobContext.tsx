import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Job, JobStatus } from '../types/job';
import { INITIAL_JOBS } from '../data/mockJobs';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { 
  fetchPublicJobsFromSupabase, 
  fetchAdminJobsFromSupabase, 
  insertJobInSupabase, 
  updateJobInSupabase, 
  deleteJobFromSupabase,
  loginAdminWithSupabase,
  logoutAdminFromSupabase,
  verifyAdminAuthorization,
  sanitizeJobData,
  AdminProfile
} from '../services/supabaseService';

interface JobContextType {
  jobs: Job[];
  currentUser: AdminProfile | null;
  isLiveSupabase: boolean;
  isLoading: boolean;
  loginAsAdmin: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getJobBySlug: (slug: string) => Job | undefined;
  addJob: (jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; job?: Job; error?: string }>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<{ success: boolean; error?: string }>;
  deleteJob: (id: string) => Promise<{ success: boolean; error?: string }>;
  togglePublishStatus: (id: string) => Promise<void>;
  markExpired: (id: string, autoDelete?: boolean) => Promise<void>;
  purgeExpiredJobs: () => Promise<number>;
  checkDuplicate: (sourceUrl?: string, company?: string, title?: string) => Job | undefined;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const STORAGE_KEY = 'careerping_jobs_v1';
const AUTH_KEY = 'careerping_auth_admin';

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeJobData);
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_JOBS.map(sanitizeJobData);
  });

  const [currentUser, setCurrentUser] = useState<AdminProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync with Supabase on mount
  const loadJobs = useCallback(async (isAdmin: boolean) => {
    if (!isSupabaseConfigured) return;

    setIsLoading(true);
    try {
      if (isAdmin) {
        const { data } = await fetchAdminJobsFromSupabase();
        if (data && data.length > 0) {
          setJobs(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      } else {
        const { data } = await fetchPublicJobsFromSupabase();
        if (data && data.length > 0) {
          setJobs(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      }
    } catch (e) {
      console.warn('Could not sync with Supabase, using local cache:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) {
      // Check current active session in Supabase Auth
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          const profile = await verifyAdminAuthorization(session.user.id, session.user.email);
          if (profile) {
            setCurrentUser(profile);
            localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
            loadJobs(true);
            return;
          }
        }
        loadJobs(false);
      });

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const profile = await verifyAdminAuthorization(session.user.id, session.user.email);
          if (profile) {
            setCurrentUser(profile);
            localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
            loadJobs(true);
            return;
          }
        }
        setCurrentUser(null);
        localStorage.removeItem(AUTH_KEY);
        loadJobs(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [loadJobs]);

  // Persist jobs to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch (e) {
      console.error('Failed to persist jobs:', e);
    }
  }, [jobs]);

  const loginAsAdmin = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && password) {
      // Real Supabase Auth + Database RLS Authorization
      const { user, error } = await loginAdminWithSupabase(email, password);
      if (error || !user) {
        return { success: false, error: error || 'Authentication failed' };
      }
      setCurrentUser(user);
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      await loadJobs(true);
      return { success: true };
    }

    // Local Development Fallback
    const adminUser: AdminProfile = {
      id: 'admin-uuid-001',
      email: email.trim().toLowerCase(),
      role: 'admin'
    };
    setCurrentUser(adminUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(adminUser));
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await logoutAdminFromSupabase();
    }
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const getJobBySlug = (slug: string) => {
    const cleanSlug = slug.toLowerCase().trim();
    return jobs.find((j) => j.slug.toLowerCase() === cleanSlug);
  };

  const checkDuplicate = (sourceUrl?: string, company?: string, title?: string): Job | undefined => {
    if (sourceUrl && sourceUrl.trim() !== '') {
      const cleanUrl = sourceUrl.trim().toLowerCase();
      const match = jobs.find(j => j.source_url && j.source_url.toLowerCase() === cleanUrl);
      if (match) return match;
    }

    if (company && title) {
      const cleanCompany = company.trim().toLowerCase();
      const cleanTitle = title.trim().toLowerCase();
      const match = jobs.find(
        j => j.company.toLowerCase() === cleanCompany && j.title.toLowerCase() === cleanTitle
      );
      if (match) return match;
    }

    return undefined;
  };

  const addJob = async (jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => {
    let finalSlug = jobData.slug?.toLowerCase().trim();
    if (!finalSlug) {
      finalSlug = `${jobData.company}-${jobData.title}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const existingSlug = jobs.find(j => j.slug === finalSlug);
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const now = new Date().toISOString();
    const newJob: Job = {
      ...jobData,
      id: crypto.randomUUID ? crypto.randomUUID() : `job-${Date.now()}`,
      slug: finalSlug,
      published_at: jobData.status === 'published' ? now : '',
      created_at: now,
      updated_at: now,
      last_verified_at: jobData.last_verified_at || now,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await insertJobInSupabase(newJob);
      if (error) {
        return { success: false, error };
      }
      if (data) {
        setJobs(prev => [data, ...prev]);
        return { success: true, job: data };
      }
    }

    setJobs(prev => [newJob, ...prev]);
    return { success: true, job: newJob };
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      const { success, error } = await updateJobInSupabase(id, {
        ...updates,
        updated_at: now
      });
      if (!success) {
        return { success: false, error: error || 'Failed to update job in Supabase' };
      }
    }

    setJobs(prev =>
      prev.map(j => {
        if (j.id === id) {
          const published_at = 
            updates.status === 'published' && !j.published_at 
              ? now 
              : updates.published_at ?? j.published_at;

          return {
            ...j,
            ...updates,
            published_at,
            updated_at: now,
            slug: updates.slug || j.slug
          };
        }
        return j;
      })
    );
    return { success: true };
  };

  const deleteJob = async (id: string) => {
    if (isSupabaseConfigured) {
      await deleteJobFromSupabase(id);
    }
    setJobs(prev => prev.filter(j => j.id !== id));
    return { success: true };
  };

  const togglePublishStatus = async (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    const nextStatus: JobStatus = job.status === 'published' ? 'draft' : 'published';
    const now = new Date().toISOString();
    const published_at = nextStatus === 'published' ? (job.published_at || now) : job.published_at;

    await updateJob(id, {
      status: nextStatus,
      published_at
    });
  };

  const markExpired = async (id: string, autoDelete: boolean = true) => {
    if (autoDelete) {
      await deleteJob(id);
    } else {
      await updateJob(id, { status: 'expired' });
    }
  };

  const purgeExpiredJobs = async (): Promise<number> => {
    const expired = jobs.filter(j => j.status === 'expired');
    for (const j of expired) {
      await deleteJob(j.id);
    }
    return expired.length;
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        currentUser,
        isLiveSupabase: isSupabaseConfigured,
        isLoading,
        loginAsAdmin,
        logout,
        getJobBySlug,
        addJob,
        updateJob,
        deleteJob,
        togglePublishStatus,
        markExpired,
        purgeExpiredJobs,
        checkDuplicate,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
