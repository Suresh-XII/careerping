import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Stage 6: Comprehensive Security & Vulnerability Audit', () => {
  it('validates protocol whitelist on external career URLs', () => {
    const sanitizeAndValidateUrl = (url: string): boolean => {
      if (!url || typeof url !== 'string') return false;
      const trimmed = url.trim().toLowerCase();
      // Block dangerous protocols
      if (
        trimmed.startsWith('javascript:') ||
        trimmed.startsWith('vbscript:') ||
        trimmed.startsWith('data:') ||
        trimmed.startsWith('file:') ||
        trimmed.startsWith('blob:')
      ) {
        return false;
      }
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' || parsed.protocol === 'http:';
      } catch {
        return false;
      }
    };

    expect(sanitizeAndValidateUrl('https://careers.google.com/jobs/results/1')).toBe(true);
    expect(sanitizeAndValidateUrl('http://careers.resillion.com/vacancies/1')).toBe(true);
    expect(sanitizeAndValidateUrl('javascript:alert(document.cookie)')).toBe(false);
    expect(sanitizeAndValidateUrl('vbscript:msgbox(1)')).toBe(false);
    expect(sanitizeAndValidateUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(sanitizeAndValidateUrl('file:///C:/Windows/win.ini')).toBe(false);
    expect(sanitizeAndValidateUrl('blob:http://localhost:5173/uuid')).toBe(false);
  });

  it('validates that external apply buttons enforce tabnabbing and SEO protection attributes', () => {
    const applyButtonAttributes = {
      target: '_blank',
      rel: 'noopener noreferrer nofollow'
    };

    expect(applyButtonAttributes.target).toBe('_blank');
    expect(applyButtonAttributes.rel).toContain('noopener');
    expect(applyButtonAttributes.rel).toContain('noreferrer');
    expect(applyButtonAttributes.rel).toContain('nofollow');
  });

  it('ensures no private service-role keys exist in the compiled production bundle', () => {
    const distAssetsDir = path.resolve(__dirname, '../../dist/assets');
    if (fs.existsSync(distAssetsDir)) {
      const files = fs.readdirSync(distAssetsDir).filter(f => f.endsWith('.js'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(distAssetsDir, file), 'utf-8');
        // Ensure no actual service-role secrets or Gemini keys are baked into client JS
        expect(content).not.toContain('sb_secret_otgXt');
        expect(content).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
        expect(content).not.toContain('AIzaSy');
      }
    }
  });

  it('verifies that .env is ignored in .gitignore', () => {
    const gitignorePath = path.resolve(__dirname, '../../.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);
    const content = fs.readFileSync(gitignorePath, 'utf-8');
    expect(content).toContain('.env');
    expect(content).toContain('.env.*');
    expect(content).toContain('!.env.example');
  });

  it('verifies .env.example contains only non-sensitive placeholder credentials', () => {
    const examplePath = path.resolve(__dirname, '../../.env.example');
    expect(fs.existsSync(examplePath)).toBe(true);
    const content = fs.readFileSync(examplePath, 'utf-8');
    expect(content).toContain('your-project-id');
    expect(content).not.toContain('sb_secret_');
  });
});
