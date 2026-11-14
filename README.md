# Careerping 🚀

> **Fast, Verified Job Notifications & Aggregator for Indian Job Seekers**  
> Covering Freshers, Experienced Professionals, Cybersecurity, Internships, and PSU/Government Openings.

[![Production Build](https://github.com/careerping/careerping/actions/workflows/deploy.yml/badge.svg)](https://github.com/careerping/careerping/actions/workflows/deploy.yml)
[![Tests Passing](https://img.shields.io/badge/tests-33%20passed-brightgreen.svg)](https://vitest.dev)
[![Supabase](https://img.shields.io/badge/backend-Supabase%20PostgreSQL-3ECF8E.svg)](https://supabase.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 🌟 Overview

**Careerping** is a modern, high-performance job aggregator web application tailored for the Indian employment market. It connects job seekers directly with verified employer opportunities while eliminating common job-board pitfalls (stale links, spam, resume harvesting, and broken redirect loops).

### Key Architectural Highlights

- **Pure Client Redirection:** Careerping collects **zero candidate resumes or personally identifiable data (PII)**. Candidates apply directly on official employer career portals via clean `target="_blank" rel="noopener noreferrer nofollow"` links.
- **Root Domain Architecture:** Hosted on GitHub Pages with native custom domain mapping (`https://careerping.live/`) and clean slug routing (`/:jobSlug`) with zero subdirectory prefixes.
- **Zero Cloudflare Dependency:** Pure native static deployment with instant DNS routing.
- **Automated Static SEO Pre-rendering:** Post-build pre-renderer creates standalone `index.html` files for every published job with Schema.org `JobPosting` JSON-LD structured data and OpenGraph tags for rich Google Search indexing.
- **AI-Powered Job Summarization:** Google Gemini 2.5 Flash integrated via secure Supabase Edge Functions with anti-hallucination guardrails to generate structured, recruiter-ready job descriptions.
- **Enterprise-Grade Security:** PostgreSQL Row-Level Security (RLS), admin endpoint obscurity (no public links, concealed from `robots.txt`), production sourcemap suppression, and strict credential isolation.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Core** | React 18, TypeScript, Vite 5 |
| **Styling & UI** | Tailwind CSS, Lucide React icons |
| **Backend & Database** | Supabase (PostgreSQL 15, Supabase Auth, Row Level Security) |
| **Edge Compute & AI** | Supabase Edge Functions (Deno / TypeScript), Google Gemini API |
| **SEO & Pre-Rendering** | Custom Node.js Static Generator (`scripts/generate-static-pages.js`), Schema.org JSON-LD |
| **Testing & Quality** | Vitest (33 automated unit & integration test suites) |
| **Hosting & CI/CD** | GitHub Pages & GitHub Actions |

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js**: v18.0.0 or v20.x
- **npm**: v9.x or v10.x
- **Supabase CLI** (optional for local migrations & edge functions)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/<your-org>/careerping.git
cd careerping
npm install
```

*(Note for Windows PowerShell: Run `npm.cmd install` if script execution policy restrictions apply).*

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set the following variables in `.env`:

```env
# Application URLs
VITE_SITE_URL=http://localhost:5173
VITE_BASE_PATH=/

# Supabase Credentials (Public Publishable Key)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-anon-key
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 🧪 Testing & Building

### Run Automated Tests

Execute the 33 comprehensive Vitest suites covering job lifecycle, SEO schema generation, security boundary assertions, and AI generation logic:

```bash
npm test
```

### Build for Production

```bash
npm run build
```

This script:
1. Runs `tsc` (TypeScript type check).
2. Runs `vite build` (bundle minification, asset hash generation, sourcemap stripping).
3. Executes `scripts/generate-static-pages.js` (queries Supabase, generates static HTML for all jobs, creates `sitemap.xml`, `robots.txt`, `CNAME`, and `404.html` SPA fallback).

---

## 🗄️ Database Setup & Migrations

The database schema and policies are located in `supabase/migrations/`:

1. `20261114_create_jobs_and_admin_tables.sql`:
   - Creates `public.jobs` with UUID primary key, unique `slug`, category enums, status (`draft`, `published`, `expired`), and audit timestamps.
   - Creates `public.admin_users` table linked to `auth.users(id)`.
   - Creates automatic `updated_at` trigger.
   - Configures strict Row-Level Security (RLS) policies allowing anonymous users to read only `published` and `expired` listings.
2. `20261114_add_admin_policy.sql`:
   - Configures non-recursive security policies for verified administrator access.

To apply via Supabase CLI:

```bash
npx supabase db push
```

---

## 🤖 Google Gemini AI Integration

Careerping uses Supabase Edge Functions to securely proxy job description generation requests to Google Gemini without exposing API keys to the browser.

### Edge Function Deployment

1. Set your Gemini API key in Supabase Secrets:
   ```bash
   npx supabase secrets set GEMINI_API_KEY="your-gemini-api-key" --project-ref your-project-ref
   ```

2. Deploy the function:
   ```bash
   npx supabase functions deploy generate-job-article --project-ref your-project-ref
   ```

---

## 🌐 Custom Domain & Production Deployment

Careerping deploys automatically via GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`.

### Step 1: Create GitHub Repository & Push

```bash
git init -b main
git add .
git commit -m "feat: initial release of Careerping"
git remote add origin https://github.com/<your-username>/careerping.git
git push -u origin main
```

### Step 2: Configure GitHub Repository Secrets

Navigate to **Settings > Secrets and variables > Actions** in your GitHub repository and add:

- `VITE_SITE_URL`: `https://careerping.live`
- `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `your-supabase-anon-key`

### Step 3: Enable GitHub Pages

1. In your GitHub repository, open **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Under **Custom domain**, enter `careerping.live` and save.
4. Check **Enforce HTTPS** (available once DNS propagation completes).

### Step 4: Configure DNS Records at Domain Registrar

Add the following DNS records at your domain registrar (GoDaddy, Namecheap, Google Domains / Squarespace, Cloudflare DNS, Hostinger, etc.):

#### 1. Root Domain (`@`) — 4 Apex A Records:
| Type | Name / Host | Value / Target | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | Automatic / 300 |
| A | `@` | `185.199.109.153` | Automatic / 300 |
| A | `@` | `185.199.110.153` | Automatic / 300 |
| A | `@` | `185.199.111.153` | Automatic / 300 |

#### 2. Subdomain (`www`) — CNAME Record:
| Type | Name / Host | Value / Target | TTL |
|---|---|---|---|
| CNAME | `www` | `<your-github-username>.github.io.` | Automatic / 300 |

*(Note: Replace `<your-github-username>` with your actual GitHub username).*

---

## 🔒 Security Architecture

For detailed information regarding identity protection, anti-reconnaissance measures, database Row-Level Security, and pentesting defense mechanisms, refer to [SECURITY.md](SECURITY.md).

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
