# Security Policy & Hardening Guidelines

Careerping is built with a defense-in-depth posture. This document outlines the security controls, architectural boundaries, threat model defenses, and operational procedures implemented across the application.

---

## 1. Threat Model & Core Security Posture

| Threat Vector | Mitigation Strategy | Implementation Details |
|---|---|---|
| **Admin Route Enumeration & Recon** | Endpoint Concealment & Meta Tag Shielding | `/admin` is omitted from `robots.txt` (to avoid path disclosure in public scanner feeds). The admin route injects `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />`. Zero public links to admin panel exist in UI. |
| **Source Code & Secrets De-obfuscation** | Production Sourcemap Suppression | `sourcemap: false` is enforced in `vite.config.ts`. Browser DevTools cannot reconstruct TypeScript source files or internal symbols from production builds. |
| **PII / Resume Data Harvesting** | Zero Candidate Data Retention Policy | Careerping acts exclusively as an indexer/aggregator. It collects zero resumes, phone numbers, or candidate records. Applying redirects candidates directly to official corporate ATS/career portals. |
| **Unauthorized Data Tampering** | PostgreSQL Row-Level Security (RLS) | Database rejects all write/update/delete operations unless the authenticated caller possesses a verified record in `public.admin_users`. |
| **Draft / Embargoed Leakage** | Database-Level Read Segregation | Public anonymous queries can only read records where `status = 'published'` or `status = 'expired'`. Unreleased draft listings are filtered at the database engine level. |
| **Reverse Tabnabbing & Phishing** | Secure Anchor Target Isolation | All outbound employer apply links are rendered with `rel="noopener noreferrer nofollow"` and `target="_blank"`. |
| **Server-Side API Key Exposure** | Serverless Edge Function Isolation | The Gemini API Key and Supabase Service Role key are stored strictly in Supabase Edge Secrets. The client bundle contains only the read-restricted public anon key. |

---

## 2. Row Level Security (RLS) Matrix

All queries to Supabase pass through PostgreSQL Row Level Security:

```sql
-- Public Read Access: Only published or expired jobs
CREATE POLICY "Allow public read access for published and expired jobs" 
ON public.jobs 
FOR SELECT 
USING (status IN ('published', 'expired'));

-- Admin Full Access: Verified via public.admin_users
CREATE POLICY "Allow authenticated admins full access to jobs" 
ON public.jobs 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE public.admin_users.id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE public.admin_users.id = auth.uid()
  )
);
```

### Authorization Verification
Client-side role claims (such as JWT metadata or localStorage flags) are never trusted for sensitive database mutations. Every write operation is authenticated against `public.admin_users` via Supabase Auth and database RLS.

---

## 3. Reconnaissance Hardening & Pentesting Defenses

### A. Robot Exclusion Traps
Traditional security configurations often insert `Disallow: /admin` inside `robots.txt`. Modern attack surface reconnaissance tools (e.g., Katana, Gobuster, Amass, Waymore) automatically ingest `robots.txt` disallows as high-priority target paths. 
- **Solution:** Careerping's `robots.txt` contains only general indexing directives and sitemap locations.
- The `/admin` SPA route dynamically supplies search engine crawlers with:
  ```html
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
  ```

### B. JavaScript Source Map Stripping
When JavaScript sourcemaps (`.js.map`) are deployed to production, any visitor can inspect full original TypeScript source code, directory structures, internal comments, and development utilities.
- **Enforcement:** `vite.config.ts` enforces `sourcemap: false`. Bundles are compiled and minified with Rollup without source map output.

### C. Browser Security Headers
The HTML generation template embeds strict browser security directives:
- `X-Content-Type-Options: nosniff` (prevents MIME type sniffing)
- `Referrer-Policy: strict-origin-when-cross-origin` (prevents sensitive path leaking in Referer headers)

---

## 4. Identity & Privacy Protection

Careerping enforces a zero-identity-leak standard:
1. **Public Contact Form:** Generic, professional contact placeholders (e.g., `contact@careerping.in` or general domain references) replace any individual maintainer personal names, personal phone numbers, or private email accounts.
2. **Git Commit History:** Repository commits are anonymized and free of personal identifiers.
3. **Audit Trail:** Admin user logins record only internal UUID references in `public.admin_users` without exposing identity attributes to public endpoints.

---

## 5. Security Testing Verification

The codebase includes automated test suites in `src/__tests__/securityAudit.test.ts` and `src/__tests__/supabaseSecurity.test.ts` to assert:
- Absence of service role tokens or secret keys in bundles.
- Enforcement of `rel="noopener noreferrer nofollow"` attributes across external links.
- Verification that draft listings cannot be loaded by public querying routines.
- Absence of `/admin` endpoints from generated `robots.txt` files.

---

## 6. Reporting a Security Vulnerability

If you discover a security vulnerability or vulnerability pattern in Careerping, please report it privately:

- **Email:** `security@careerping.in`
- Please do not submit public GitHub issues for security vulnerabilities.
- Provide step-by-step reproduction instructions and proof-of-concept where possible.
- Responsible disclosures will receive a prompt acknowledgment and prioritized remediation.
