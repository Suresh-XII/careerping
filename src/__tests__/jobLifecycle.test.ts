import { describe, it, expect } from 'vitest';
import { Job } from '../types/job';

describe('Stage 3: Real Job Lifecycle & Management Rules', () => {
  // Test in-memory store simulating database behavior
  let dbJobs: Job[] = [];

  const createJob = (
    input: Omit<Job, 'id' | 'created_at' | 'updated_at'>,
    existingJobs: Job[]
  ): { job: Job; duplicateOf?: Job } => {
    // 1. Duplicate check
    if (input.source_url) {
      const dupByUrl = existingJobs.find(
        j => j.source_url?.toLowerCase() === input.source_url?.toLowerCase()
      );
      if (dupByUrl) return { job: dupByUrl, duplicateOf: dupByUrl };
    }

    const dupByTitle = existingJobs.find(
      j => j.company.toLowerCase() === input.company.toLowerCase() &&
           j.title.toLowerCase() === input.title.toLowerCase()
    );
    if (dupByTitle) return { job: dupByTitle, duplicateOf: dupByTitle };

    // 2. Slug generation
    let finalSlug = input.slug?.toLowerCase().trim() || 
      `${input.company}-${input.title}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const existingSlug = existingJobs.find(j => j.slug === finalSlug);
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const now = new Date().toISOString();
    const newJob: Job = {
      ...input,
      id: `uuid-${Date.now()}`,
      slug: finalSlug,
      published_at: input.status === 'published' ? now : '',
      created_at: now,
      updated_at: now,
      last_verified_at: input.last_verified_at || now,
    };

    return { job: newJob };
  };

  const updateJob = (id: string, updates: Partial<Job>, jobs: Job[]): Job[] => {
    const now = new Date().toISOString();
    return jobs.map(j => {
      if (j.id === id) {
        const published_at = 
          updates.status === 'published' && !j.published_at
            ? now
            : updates.published_at !== undefined ? updates.published_at : j.published_at;

        return {
          ...j,
          ...updates,
          published_at,
          updated_at: now,
          // CRITICAL: Preserve permanent slug unless explicitly changed
          slug: updates.slug || j.slug
        };
      }
      return j;
    });
  };

  it('creates a new verified job with clean slug and timestamps', () => {
    const { job, duplicateOf } = createJob({
      title: 'Senior Cloud Security Architect',
      company: 'Infosys Ltd',
      location: 'Bengaluru / Pune',
      qualification: 'B.Tech / MCA',
      experience: '5+ Years',
      employment_type: 'Full-time',
      salary: '₹18,00,000 - ₹28,00,000 LPA',
      category: 'Cybersecurity',
      description: 'Lead AWS and Azure zero-trust implementations.',
      responsibilities: ['Architect cloud guardrails', 'Lead incident audits'],
      required_skills: ['AWS Security', 'Terraform', 'IAM'],
      eligibility: ['5+ years cloud exp'],
      application_deadline: '2026-12-31',
      apply_url: 'https://careers.infosys.com/jobs/cloud-sec-99',
      source_url: 'https://infosys.com/notices/cloud-sec-99',
      status: 'published',
      slug: 'infosys-senior-cloud-security-architect',
      published_at: '',
      last_verified_at: ''
    }, dbJobs);

    expect(duplicateOf).toBeUndefined();
    expect(job.slug).toBe('infosys-senior-cloud-security-architect');
    expect(job.status).toBe('published');
    expect(job.published_at).toBeTruthy();
    expect(job.apply_url).toMatch(/^https:\/\//);

    dbJobs.push(job);
  });

  it('detects duplicate submission based on source URL', () => {
    const { duplicateOf } = createJob({
      title: 'Cloud Security Lead (Re-post)',
      company: 'Infosys Different Branch',
      location: 'Hyderabad',
      qualification: 'B.Tech',
      experience: '5+ Years',
      employment_type: 'Full-time',
      salary: 'Not disclosed',
      category: 'Cybersecurity',
      description: 'Duplicate notice',
      responsibilities: [],
      required_skills: [],
      eligibility: [],
      application_deadline: '',
      apply_url: 'https://careers.infosys.com/jobs/cloud-sec-99',
      source_url: 'https://infosys.com/notices/cloud-sec-99', // Identical source URL
      status: 'draft',
      slug: 'infosys-repost',
      published_at: '',
      last_verified_at: ''
    }, dbJobs);

    expect(duplicateOf).toBeDefined();
    expect(duplicateOf?.slug).toBe('infosys-senior-cloud-security-architect');
  });

  it('updates an existing job while strictly preserving the permanent slug URL', () => {
    const existing = dbJobs[0];
    const originalSlug = existing.slug;

    const updatedList = updateJob(existing.id, {
      salary: '₹20,00,000 - ₹30,00,000 LPA',
      experience: '6+ Years'
    }, dbJobs);

    const updatedJob = updatedList.find(j => j.id === existing.id)!;
    expect(updatedJob.salary).toBe('₹20,00,000 - ₹30,00,000 LPA');
    expect(updatedJob.experience).toBe('6+ Years');
    // Permanent URL must NOT change
    expect(updatedJob.slug).toBe(originalSlug);

    dbJobs = updatedList;
  });

  it('handles publishing and unpublishing (drafting) lifecycle correctly', () => {
    const existing = dbJobs[0];

    // 1. Unpublish to draft
    const draftedList = updateJob(existing.id, { status: 'draft' }, dbJobs);
    expect(draftedList.find(j => j.id === existing.id)?.status).toBe('draft');

    // 2. Re-publish
    const republishedList = updateJob(existing.id, { status: 'published' }, draftedList);
    const republishedJob = republishedList.find(j => j.id === existing.id)!;
    expect(republishedJob.status).toBe('published');
    expect(republishedJob.published_at).toBeTruthy();

    dbJobs = republishedList;
  });

  it('handles vacancy expiry without deleting the historical page', () => {
    const existing = dbJobs[0];

    // Mark expired
    const expiredList = updateJob(existing.id, { status: 'expired' }, dbJobs);
    const expiredJob = expiredList.find(j => j.id === existing.id)!;

    expect(expiredJob.status).toBe('expired');
    // Job is preserved in the database (not deleted silently)
    expect(expiredJob.id).toBe(existing.id);
    expect(expiredJob.slug).toBe(existing.slug);

    dbJobs = expiredList;
  });

  it('validates application deadline expiry logic', () => {
    const isJobDeadlinePassed = (deadlineDateStr?: string) => {
      if (!deadlineDateStr) return false;
      const deadline = new Date(deadlineDateStr).getTime();
      const now = new Date().getTime();
      return deadline < now;
    };

    expect(isJobDeadlinePassed('2025-01-01')).toBe(true);
    expect(isJobDeadlinePassed('2028-12-31')).toBe(false);
    expect(isJobDeadlinePassed('')).toBe(false);
    expect(isJobDeadlinePassed(undefined)).toBe(false);
  });
});
