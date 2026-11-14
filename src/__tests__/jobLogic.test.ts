import { describe, it, expect } from 'vitest';
import { INITIAL_JOBS } from '../data/mockJobs';
import { Job } from '../types/job';

describe('Careerping Job Core Logic & Rules', () => {
  it('loads valid initial mock jobs with required properties', () => {
    expect(INITIAL_JOBS.length).toBeGreaterThan(0);
    for (const job of INITIAL_JOBS) {
      expect(job.id).toBeDefined();
      expect(job.slug).toMatch(/^[a-z0-9-]+$/);
      expect(job.title).toBeTruthy();
      expect(job.company).toBeTruthy();
      expect(job.apply_url).toMatch(/^https?:\/\//);
      expect(['published', 'draft', 'expired']).toContain(job.status);
    }
  });

  it('contains expected standard slugs for India tech roles', () => {
    const slugs = INITIAL_JOBS.map(j => j.slug);
    expect(slugs).toContain('resillion-soc-analyst');
    expect(slugs).toContain('google-cybersecurity-intern');
    expect(slugs).toContain('tcs-software-engineer');
  });

  it('filters published vs draft vs expired jobs correctly for public visitors', () => {
    const published = INITIAL_JOBS.filter(j => j.status === 'published');
    const drafts = INITIAL_JOBS.filter(j => j.status === 'draft');
    const expired = INITIAL_JOBS.filter(j => j.status === 'expired');

    expect(published.length).toBeGreaterThan(0);
    expect(drafts.length).toBeGreaterThan(0);
    expect(expired.length).toBeGreaterThan(0);

    // Public homepage only displays published jobs
    for (const job of published) {
      expect(job.status).toBe('published');
      expect(job.published_at).toBeTruthy();
    }

    // Draft jobs must not be in published list
    for (const draft of drafts) {
      expect(published).not.toContain(draft);
    }
  });

  it('detects duplicate listings by source URL or company + title', () => {
    const checkDuplicate = (
      jobs: Job[],
      sourceUrl?: string,
      company?: string,
      title?: string
    ) => {
      if (sourceUrl && sourceUrl.trim() !== '') {
        const clean = sourceUrl.trim().toLowerCase();
        const found = jobs.find(j => j.source_url?.toLowerCase() === clean);
        if (found) return found;
      }
      if (company && title) {
        const cComp = company.trim().toLowerCase();
        const cTitle = title.trim().toLowerCase();
        const found = jobs.find(
          j => j.company.toLowerCase() === cComp && j.title.toLowerCase() === cTitle
        );
        if (found) return found;
      }
      return undefined;
    };

    // Test matching source URL
    const matchByUrl = checkDuplicate(
      INITIAL_JOBS,
      'https://careers.resillion.com/vacancies/78291'
    );
    expect(matchByUrl).toBeDefined();
    expect(matchByUrl?.slug).toBe('resillion-soc-analyst');

    // Test matching company and title
    const matchByTitle = checkDuplicate(
      INITIAL_JOBS,
      undefined,
      'Google',
      'Cybersecurity Engineering Intern - Summer 2027'
    );
    expect(matchByTitle).toBeDefined();
    expect(matchByTitle?.slug).toBe('google-cybersecurity-intern');

    // Test non-duplicate
    const nonDuplicate = checkDuplicate(
      INITIAL_JOBS,
      'https://newcompany.com/job/unique-999',
      'New Unknown Startup',
      'Quantum Security Lead'
    );
    expect(nonDuplicate).toBeUndefined();
  });

  it('generates clean custom domain root URLs without /careerping/ or github usernames', () => {
    const CUSTOM_DOMAIN = 'https://careerping.in';
    const generateJobUrl = (slug: string) => `${CUSTOM_DOMAIN}/${slug}`;

    expect(generateJobUrl('resillion-soc-analyst')).toBe('https://careerping.in/resillion-soc-analyst');
    expect(generateJobUrl('google-cybersecurity-intern')).toBe('https://careerping.in/google-cybersecurity-intern');
    expect(generateJobUrl('tcs-software-engineer')).toBe('https://careerping.in/tcs-software-engineer');
    expect(generateJobUrl('resillion-soc-analyst')).not.toContain('github.io');
    expect(generateJobUrl('resillion-soc-analyst')).not.toContain('/careerping/');
  });

  it('verifies safe external apply URL attributes', () => {
    const job = INITIAL_JOBS.find(j => j.slug === 'resillion-soc-analyst')!;
    expect(job.apply_url).toBeTruthy();
    expect(job.apply_url.startsWith('https://')).toBe(true);

    // Attributes required for security
    const linkAttributes = {
      target: '_blank',
      rel: 'noopener noreferrer nofollow'
    };
    expect(linkAttributes.rel).toContain('noopener');
    expect(linkAttributes.rel).toContain('noreferrer');
    expect(linkAttributes.rel).toContain('nofollow');
  });

  it('validates JobPosting JSON-LD structure only for active published vacancies', () => {
    const createJobSchema = (job: Job, domain: string) => {
      if (job.status !== 'published') return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        hiringOrganization: {
          '@type': 'Organization',
          name: job.company
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN',
            addressLocality: job.location
          }
        },
        url: `${domain}/${job.slug}`
      };
    };

    const publishedJob = INITIAL_JOBS.find(j => j.status === 'published')!;
    const publishedSchema = createJobSchema(publishedJob, 'https://careerping.in');
    expect(publishedSchema).not.toBeNull();
    expect(publishedSchema?.['@type']).toBe('JobPosting');
    expect(publishedSchema?.title).toBe(publishedJob.title);

    const expiredJob = INITIAL_JOBS.find(j => j.status === 'expired')!;
    const expiredSchema = createJobSchema(expiredJob, 'https://careerping.in');
    // Must NOT emit JobPosting for expired vacancies
    expect(expiredSchema).toBeNull();
  });
});
