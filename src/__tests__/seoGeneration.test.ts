import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Stage 5: SEO, Sitemap, Static Pre-Rendering & Custom Domain', () => {
  const distDir = path.resolve(__dirname, '../../dist');

  it('generates dist/CNAME with the custom root domain', () => {
    const cnamePath = path.join(distDir, 'CNAME');
    expect(fs.existsSync(cnamePath)).toBe(true);
    const content = fs.readFileSync(cnamePath, 'utf-8').trim();
    expect(content).toBe('careerping.live');
    expect(content).not.toContain('github.io');
    expect(content).not.toContain('/');
  });

  it('generates valid sitemap.xml referencing custom domain URLs', () => {
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    expect(fs.existsSync(sitemapPath)).toBe(true);
    const xml = fs.readFileSync(sitemapPath, 'utf-8');

    expect(xml).toContain('<loc>https://careerping.live/</loc>');
    expect(xml).toContain('<loc>https://careerping.live/latest-jobs</loc>');
    expect(xml).toContain('<loc>https://careerping.live/category/cybersecurity</loc>');
    expect(xml).toContain('<loc>https://careerping.live/resillion-soc-analyst</loc>');

    // Must never contain GitHub Pages subfolder in sitemap
    expect(xml).not.toContain('/careerping/');
    expect(xml).not.toContain('.github.io');
  });

  it('generates robots.txt referencing sitemap without disclosing admin endpoints', () => {
    const robotsPath = path.join(distDir, 'robots.txt');
    expect(fs.existsSync(robotsPath)).toBe(true);
    const txt = fs.readFileSync(robotsPath, 'utf-8');

    // Security best practice: Never advertise admin endpoints in robots.txt
    expect(txt).not.toContain('/admin');
    expect(txt).toContain('Sitemap: https://careerping.live/sitemap.xml');
  });

  it('pre-renders static crawlable HTML for clean job URLs', () => {
    const jobHtmlPath = path.join(distDir, 'resillion-soc-analyst', 'index.html');
    expect(fs.existsSync(jobHtmlPath)).toBe(true);
    const html = fs.readFileSync(jobHtmlPath, 'utf-8');

    // Title & Canonical
    expect(html).toContain('<title>SOC Analyst (L1 / L2 Incident Response) at Resillion India - Verified Job Alert | Careerping</title>');
    expect(html).toContain('<link rel="canonical" href="https://careerping.live/resillion-soc-analyst" />');

    // Open Graph
    expect(html).toContain('property="og:url" content="https://careerping.live/resillion-soc-analyst"');

    // JobPosting Schema
    expect(html).toContain('"@type":"JobPosting"');
    expect(html).toContain('"title":"SOC Analyst (L1 / L2 Incident Response)"');
    expect(html).toContain('"directApply":true');

    // Crawlable body content
    expect(html).toContain('APPLY ON OFFICIAL WEBSITE');
    expect(html).toContain('https://careers.resillion.com/jobs/soc-analyst-india');
  });

  it('pre-renders static legal and guidance pages', () => {
    const aboutPath = path.join(distDir, 'about', 'index.html');
    const contactPath = path.join(distDir, 'contact', 'index.html');
    const disclaimerPath = path.join(distDir, 'disclaimer', 'index.html');

    expect(fs.existsSync(aboutPath)).toBe(true);
    expect(fs.existsSync(contactPath)).toBe(true);
    expect(fs.existsSync(disclaimerPath)).toBe(true);
  });
});
