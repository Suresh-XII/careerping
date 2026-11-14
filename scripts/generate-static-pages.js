/**
 * Careerping Static Pre-Rendering & Sitemap Generator
 * 
 * Runs after `vite build` to generate:
 * 1. Crawlable static HTML for all published job pages (e.g. dist/:jobSlug/index.html)
 * 2. Static HTML for legal/informational pages
 * 3. Dynamic sitemap.xml with custom domain canonical URLs
 * 4. Custom domain CNAME file for GitHub Pages
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');

const CUSTOM_DOMAIN = 'https://careerping.in';

async function fetchJobsForBuild() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://eetrrqefgsadllvjzrpf.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_cMH-R82iQUwAHKlOlOGHGQ_lViYjgXh';

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/jobs?select=*&order=published_at.desc`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        console.log(`[SEO Generator] Successfully fetched ${data.length} jobs from Supabase database.`);
        return data;
      }
    }
  } catch (err) {
    console.warn('[SEO Generator] Supabase API fetch failed, falling back to local seed data:', err.message);
  }

  // Fallback to local seed jobs if Supabase network is unavailable
  return [
    {
      slug: 'resillion-soc-analyst',
      title: 'SOC Analyst (L1 / L2 Incident Response)',
      company: 'Resillion India',
      location: 'Bengaluru / Hyderabad (Hybrid)',
      qualification: 'B.Tech / B.E / BCA / B.Sc in CS, IT or equivalent',
      experience: '0 - 2 Years',
      salary: '₹5,00,000 - ₹8,50,000 LPA',
      category: 'Cybersecurity',
      employment_type: 'Full-time',
      description: 'Resillion is hiring a Security Operations Center (SOC) Analyst to monitor, detect, analyze, and respond to cyber security incidents across client infrastructure in real-time.',
      responsibilities: ['Monitor and triage security alerts in SIEM', 'Investigate potential security breaches'],
      required_skills: ['Splunk', 'SIEM', 'Network Security', 'Wireshark', 'TCP/IP'],
      eligibility: ['2024, 2025 or 2026 graduates with degree in CS/IT'],
      application_deadline: '2026-12-15',
      apply_url: 'https://careers.resillion.com/jobs/soc-analyst-india',
      status: 'published',
      published_at: '2026-11-12T10:00:00Z',
      last_verified_at: '2026-11-14T08:00:00Z'
    },
    {
      slug: 'google-cybersecurity-intern',
      title: 'Cybersecurity Engineering Intern - Summer 2027',
      company: 'Google',
      location: 'Bengaluru / Hyderabad, India',
      qualification: 'Pursuing Bachelor\'s or Master\'s in CS or Cybersecurity',
      experience: 'Fresher (Enrolled Student)',
      salary: '₹1,00,000 - ₹1,25,000 / month (Stipend)',
      category: 'Internships',
      employment_type: 'Internship',
      description: 'Google Cybersecurity Internships provide hands-on experience building, auditing, and scaling security infrastructure protecting billions of users.',
      responsibilities: ['Build automated security analysis tools', 'Analyze binary code and cloud services for bugs'],
      required_skills: ['C++', 'Python', 'Go', 'Data Structures', 'Linux Systems'],
      eligibility: ['Currently enrolled student graduating in 2027 or 2028'],
      application_deadline: '2026-12-30',
      apply_url: 'https://www.google.com/about/careers/applications/jobs/results/cyber-intern-in',
      status: 'published',
      published_at: '2026-11-10T14:00:00Z',
      last_verified_at: '2026-11-14T09:00:00Z'
    },
    {
      slug: 'tcs-software-engineer',
      title: 'Assistant System Engineer (TCS Ninja & Digital)',
      company: 'Tata Consultancy Services (TCS)',
      location: 'Pan India',
      qualification: 'B.E. / B.Tech / M.E. / MCA / M.Sc',
      experience: 'Fresher (0 Years)',
      salary: '₹3,36,000 - ₹7,00,000 LPA',
      category: 'Freshers',
      employment_type: 'Full-time',
      description: 'Tata Consultancy Services is inviting applications from recent engineering graduates for software engineering roles.',
      responsibilities: ['Develop, test, and deploy software components'],
      required_skills: ['Java', 'Python', 'SQL', 'Data Structures', 'Git'],
      eligibility: ['2025 and 2026 batch passing out students with min 60%'],
      application_deadline: '2026-11-28',
      apply_url: 'https://nextstep.tcs.com/campus/#/',
      status: 'published',
      published_at: '2026-11-08T08:00:00Z',
      last_verified_at: '2026-11-13T16:00:00Z'
    },
    {
      slug: 'isro-scientist-engineer-sc-computer-science',
      title: 'Scientist / Engineer \'SC\' (Computer Science)',
      company: 'ISRO - Indian Space Research Organisation',
      location: 'Bengaluru, Thiruvananthapuram, Sriharikota',
      qualification: 'B.E / B.Tech in CSE with minimum 65% aggregate',
      experience: 'Fresher / Experienced',
      salary: 'Level 10 (₹56,100 - ₹1,77,500 + DA & HRA)',
      category: 'Government Jobs',
      employment_type: 'Full-time',
      description: 'ISRO Centralised Recruitment Board invites applications for the post of Scientist/Engineer SC in Computer Science discipline.',
      responsibilities: ['Design and validate software for spacecraft control and telemetry data processing'],
      required_skills: ['C/C++', 'Operating Systems', 'RTOS', 'Linux Kernel', 'Algorithms'],
      eligibility: ['First Class B.E/B.Tech in CSE with minimum 65% marks. Indian Citizenship mandatory.'],
      application_deadline: '2026-12-05',
      apply_url: 'https://www.isro.gov.in/Careers.html',
      status: 'published',
      published_at: '2026-11-05T11:00:00Z',
      last_verified_at: '2026-11-14T07:00:00Z'
    }
  ];
}

async function runStaticGeneration() {
  console.log('[SEO Generator] Starting static HTML, Sitemap and CNAME generation...');

  if (!fs.existsSync(distDir)) {
    console.error('[SEO Generator] Error: dist directory does not exist. Run "vite build" first.');
    process.exit(1);
  }

  const baseIndexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
  const allJobs = await fetchJobsForBuild();
  const publishedJobs = allJobs.filter(j => j.status === 'published');
  const expiredJobs = allJobs.filter(j => j.status === 'expired');

  // 1. Generate CNAME file for GitHub Pages custom domain
  const cnameContent = 'careerping.in';
  fs.writeFileSync(path.join(distDir, 'CNAME'), cnameContent, 'utf-8');
  console.log('[SEO Generator] Created dist/CNAME with "careerping.in"');

  // 2. Pre-render individual published and expired job pages
  const jobsToPreRender = [...publishedJobs, ...expiredJobs];

  for (const job of jobsToPreRender) {
    const canonicalUrl = `${CUSTOM_DOMAIN}/${job.slug}`;
    const pageTitle = `${job.title} at ${job.company} - Verified Job Alert | Careerping`;
    const metaDescription = `${job.title} vacancy at ${job.company}. Location: ${job.location}. CTC: ${job.salary || 'Not disclosed'}. Experience: ${job.experience}. Apply directly on official employer portal.`;

    // JobPosting Schema (ONLY for published active vacancies, NEVER for expired vacancies)
    let schemaScript = '';
    if (job.status === 'published') {
      const validThroughDate = job.application_deadline
        ? new Date(job.application_deadline).toISOString()
        : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        'title': job.title,
        'description': `<p>${job.description}</p>`,
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
      schemaScript = `<script type="application/ld+json" id="careerping-jobposting-schema">${JSON.stringify(schema)}</script>`;
    }

    // Crawlable Pre-Rendered Fallback HTML inside #root
    const crawlableBody = `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px;">
        <header style="margin-bottom: 24px;">
          <p style="color: #0F9D91; font-weight: 700; font-size: 14px; text-transform: uppercase;">Official Verified Vacancy Notice</p>
          <h1 style="color: #142B4A; font-size: 28px; font-weight: 800; margin: 8px 0;">${job.title}</h1>
          <h2 style="color: #475569; font-size: 18px; font-weight: 600; margin: 0;">${job.company}</h2>
        </header>
        <section style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Experience:</strong> ${job.experience}</p>
          <p><strong>Qualification:</strong> ${job.qualification}</p>
          <p><strong>Salary / CTC:</strong> ${job.salary || 'Not disclosed'}</p>
          <p><strong>Application Deadline:</strong> ${job.application_deadline || 'Open / Rolling'}</p>
        </section>
        <article style="line-height: 1.7; color: #334155; margin-bottom: 24px;">
          <h3>Job Overview</h3>
          <p>${job.description}</p>
        </article>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${job.apply_url}" target="_blank" rel="noopener noreferrer nofollow" style="background: #0F9D91; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            APPLY ON OFFICIAL WEBSITE
          </a>
        </div>
      </div>
    `;

    // Inject Head Meta Tags into index.html
    let customizedHtml = baseIndexHtml
      .replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${metaDescription}" />`)
      .replace(/<div id="root"><\/div>/, `<div id="root">${crawlableBody}</div>`);

    // Inject Canonical and Open Graph before </head>
    const headInjections = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${metaDescription}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageTitle}" />
    <meta name="twitter:description" content="${metaDescription}" />
    ${schemaScript}
    `;
    customizedHtml = customizedHtml.replace('</head>', `${headInjections}</head>`);

    // Write to clean custom domain route: dist/:jobSlug/index.html
    const targetDir = path.join(distDir, job.slug);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), customizedHtml, 'utf-8');

    // Also write to dist/jobs/:jobSlug/index.html for backward compatibility
    const jobsSubDir = path.join(distDir, 'jobs', job.slug);
    fs.mkdirSync(jobsSubDir, { recursive: true });
    fs.writeFileSync(path.join(jobsSubDir, 'index.html'), customizedHtml, 'utf-8');
  }

  console.log(`[SEO Generator] Pre-rendered ${jobsToPreRender.length} clean job URLs into static HTML.`);

  // 3. Pre-render Static Legal and Category Pages
  const staticPages = [
    { route: 'about', title: 'About Us | Careerping', desc: 'About Careerping - Independent verified career alert platform in India.' },
    { route: 'contact', title: 'Contact Support & Verification | Careerping', desc: 'Contact Careerping editorial team for vacancy verification.' },
    { route: 'disclaimer', title: 'Job Disclaimer & Anti-Fraud Notice | Careerping', desc: 'Careerping job disclaimer and anti-fraud candidate advisories.' },
    { route: 'privacy-policy', title: 'Privacy Policy | Careerping', desc: 'Careerping candidate privacy and data protection policies.' },
    { route: 'terms', title: 'Terms & Conditions | Careerping', desc: 'Terms and conditions governing the Careerping platform.' },
    { route: 'guidance', title: 'Career Guidance & Roadmap | Careerping', desc: 'L1 SOC analyst roadmaps, ATS resume tips and exam preparation.' },
    { route: 'latest-jobs', title: 'Latest Verified Job Vacancies | Careerping', desc: 'Browse all active IT, cybersecurity, fresher, and govt jobs in India.' }
  ];

  for (const page of staticPages) {
    const pageDir = path.join(distDir, page.route);
    fs.mkdirSync(pageDir, { recursive: true });
    let pageHtml = baseIndexHtml
      .replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${page.desc}" />`);
    
    pageHtml = pageHtml.replace('</head>', `<link rel="canonical" href="${CUSTOM_DOMAIN}/${page.route}" /></head>`);
    fs.writeFileSync(path.join(pageDir, 'index.html'), pageHtml, 'utf-8');
  }

  // 4. Generate dynamic sitemap.xml
  const today = new Date().toISOString().slice(0, 10);
  const categories = [
    'it-software',
    'cybersecurity',
    'freshers',
    'internships',
    'government-jobs',
    'work-from-home',
    'banking-finance',
    'core-engineering'
  ];

  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${CUSTOM_DOMAIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Main Job Index -->
  <url>
    <loc>${CUSTOM_DOMAIN}/latest-jobs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;

  // Categories
  for (const cat of categories) {
    sitemapXml += `  <url>
    <loc>${CUSTOM_DOMAIN}/category/${cat}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  }

  // Published Job Pages
  for (const job of publishedJobs) {
    const jobDate = job.published_at ? job.published_at.slice(0, 10) : today;
    sitemapXml += `  <url>
    <loc>${CUSTOM_DOMAIN}/${job.slug}</loc>
    <lastmod>${jobDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>\n`;
  }

  // Informational Pages
  for (const page of staticPages) {
    if (page.route !== 'latest-jobs') {
      sitemapXml += `  <url>
    <loc>${CUSTOM_DOMAIN}/${page.route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>\n`;
    }
  }

  sitemapXml += `</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log(`[SEO Generator] Generated dist/sitemap.xml with ${publishedJobs.length} active jobs and ${categories.length} categories.`);

  // 5. Update robots.txt to point to sitemap.xml (Never advertise internal admin routes)
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${CUSTOM_DOMAIN}/sitemap.xml
`;
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('[SEO Generator] Updated dist/robots.txt with custom domain sitemap URL.');
  console.log('[SEO Generator] Pre-rendering complete! All pages are ready for Googlebot.');
}

runStaticGeneration();
