import React, { useEffect } from 'react';
import { Job } from '../types/job';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  job?: Job; // If provided and active, injects JobPosting schema
  noIndex?: boolean; // Security: hides private admin/sensitive routes from all crawlers
}

// Configurable root domain. Defaults to custom domain careerping.in
const CUSTOM_DOMAIN = 'https://careerping.in';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  job,
  noIndex = false,
}) => {
  useEffect(() => {
    // 1. Update Document Title
    const fullTitle = `${title} | Careerping`;
    document.title = fullTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attribute: string, name: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Update Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow, noarchive, nosnippet' : 'index, follow');
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', job ? 'article' : 'website');

    const canonicalUrl = `${CUSTOM_DOMAIN}${canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath}`;
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);

    // 4. Update Canonical Link tag
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 5. Inject JobPosting JSON-LD ONLY on published and non-expired job pages!
    const SCRIPT_ID = 'careerping-jobposting-schema';
    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }

    if (job && job.status === 'published') {
      const validThroughDate = job.application_deadline
        ? new Date(job.application_deadline).toISOString()
        : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        'title': job.title,
        'description': `<p>${job.description}</p><h3>Responsibilities</h3><ul>${job.responsibilities?.map(r => `<li>${r}</li>`).join('') || ''}</ul>`,
        'datePosted': job.published_at ? new Date(job.published_at).toISOString() : new Date().toISOString(),
        'validThrough': validThroughDate,
        'employmentType': job.employment_type === 'Full-time' ? 'FULL_TIME' : job.employment_type === 'Internship' ? 'INTERN' : 'OTHER',
        'hiringOrganization': {
          '@type': 'Organization',
          'name': job.company,
          'sameAs': job.source_url || CUSTOM_DOMAIN,
        },
        'jobLocation': {
          '@type': 'Place',
          'address': {
            '@type': 'PostalAddress',
            'addressCountry': 'IN',
            'addressLocality': job.location,
          }
        },
        'directApply': true,
        'url': canonicalUrl
      };

      const scriptElement = document.createElement('script');
      scriptElement.id = SCRIPT_ID;
      scriptElement.type = 'application/ld+json';
      scriptElement.text = JSON.stringify(schema);
      document.head.appendChild(scriptElement);
    }

    return () => {
      // Cleanup script on unmount
      const scriptToRemove = document.getElementById(SCRIPT_ID);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, canonicalPath, job]);

  return null;
};
