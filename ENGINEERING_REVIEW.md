# JTLD Consulting Inc — Platform Engineering Review

**Date:** May 8, 2026
**Reviewer:** Claude (Engineering Review Suite)
**Scope:** Architecture, Code Review, Debug Audit, Deploy Status, Documentation
**Stack:** React 19 + Vite + Tailwind | Express + TypeScript | Supabase (PostgreSQL + Auth + Storage)
**Status:** ✅ Live — [jtldinc.com](https://jtldinc.com) / [api.jtldinc.com](https://api.jtldinc.com)

---

## 1. Architecture Decision Record (ADR-001)

**Status:** Accepted & Deployed
**Decision:** React + Vite + Express + Supabase split-host architecture for corporate website with admin CMS and candidate portal

### Context

JTLD Consulting Inc needed a professional web presence with a contact form, blog, admin dashboard, and candidate careers portal. The platform must be cost-efficient (free-tier viable), maintainable by a small team, and deploy continuously from GitHub.

### Options Considered

| Dimension | React + Express + Supabase ✅ | Next.js + Supabase | WordPress + Headless CMS |
|-----------|-------------------------------|-------------------|--------------------------|
| Complexity | Medium | Medium | Low |
| Cost | Free tier viable | Free tier viable | Hosting + plugins |
| Scalability | Good (stateless API) | Good (edge functions) | Limited |
| Flexibility | High | Medium (SSR coupling) | Low |
| SEO | JS-rendered (acceptable) | Built-in SSR | Built-in |
| Time to ship | Fast | Fast | Fastest for basics |

### Decision Rationale

The React + Express + Supabase stack gives full control over frontend and backend, avoids vendor lock-in beyond the database layer, and keeps deployment simple (static SPA on Vercel, API on Render). Supabase provides auth, PostgreSQL, RLS, and file storage without infrastructure management.

### Trade-offs Accepted

- **No SSR/SSG:** SPA architecture means search engines execute JavaScript. Acceptable for a consulting site where traffic is primarily referral-based, not organic search.
- **Two deployment targets:** Frontend and backend deploy separately, adding slight operational overhead but keeping concerns cleanly separated.
- **Supabase dependency:** Auth and database are coupled to Supabase. Schema is standard PostgreSQL, so migration to self-hosted is feasible.

### Consequences

- Frontend and backend deployments are fully independent
- API is reusable if a mobile app is added later
- Supabase free tier covers expected traffic for 12+ months
- Candidate portal (resumes, profiles) communicates with Supabase directly — no Express routes needed

---

## 2. Code Review

### Summary

The codebase is clean, well-organized, and follows modern TypeScript conventions. The server uses Zod for input validation, the client has a consistent API abstraction layer, and the admin dashboard is properly protected. All three critical pre-deploy issues from the initial review have been resolved.

### Critical Issues — All Fixed ✅

| # | File | Issue | Status |
|---|------|-------|--------|
| 1 | `server/src/routes/contact.ts` | GET /contacts missing `requireAdmin` | ✅ Fixed |
| 2 | `server/src/routes/contact.ts` | PATCH status missing `requireAdmin` | ✅ Fixed |
| 3 | `server/src/routes/blog.ts` | POST/PATCH/DELETE missing `requireAdmin` | ✅ Fixed |
| 4 | `server/src/index.ts` | Rate limiter applied to all methods on `/api/contacts` | ✅ Fixed — scoped to POST only |
| 5 | `client/src/pages/admin/BlogEditorPage.tsx` | `FileText` import missing | ✅ Fixed |

### Remaining Suggestions (Non-blocking)

| # | Area | Issue | Priority |
|---|------|-------|----------|
| 1 | `server/src/routes/admin.ts` | Analytics loads all page_view rows into memory — use SQL `GROUP BY` | Medium |
| 2 | `client/src/lib/api.ts` | No content-type check for non-JSON responses from Render | Low |
| 3 | `server/src/routes/blog.ts` | DELETE returns 204 even if row didn't exist | Low |
| 4 | `client/src/components/home/Contact.tsx` | No client-side validation — relies on HTML `required` + server Zod | Low |
| 5 | `server/src/middleware/auth.ts` | Service role client used for `getUser()` — consider local JWT verification | Low |
| 6 | `server/src/routes/blog.ts` | Slug collision on PATCH returns 404 instead of 409 | Low |

### What Looks Good

- Zod schemas are well-defined with sensible constraints (min/max lengths, regex on slugs)
- Consistent API envelope (`{ data, error, pagination }`) across all endpoints
- Rate limiting differentiated — public POST (5/hr) vs admin GET (unlimited)
- `requireAuth` + `requireAdmin` middleware chain applied correctly on all admin routes
- RLS policies on all tables provide defense-in-depth
- Candidate portal uses Supabase RLS directly — no server-side exposure of resume data
- Dark mode defaults to light and persists via `localStorage`
- React Router `<Link>` used for all internal navigation (no full page reloads)
- SPA catch-all rewrite in `vercel.json` correctly handles all client-side routes

---

## 3. Debug Audit

### Resolved Bugs

**Bug 1: Missing `FileText` Import (BlogEditorPage)**
- **File:** `client/src/pages/admin/BlogEditorPage.tsx`
- **Impact:** Runtime crash when blog posts list is empty
- **Fix:** Added `FileText` to lucide-react import — ✅ Resolved

**Bug 2: Authorization Gap on Contact/Blog Routes**
- **Impact:** Any authenticated user could read contact submissions and edit/delete blog posts
- **Fix:** Added `requireAdmin` middleware to all admin routes — ✅ Resolved

**Bug 3: Rate Limiter Blocking Admin Reads**
- **Impact:** Admin users rate-limited when refreshing inquiries page
- **Fix:** `contactLimiter` moved to POST-only; `app.use('/api/contacts', contactRoutes)` without limiter — ✅ Resolved

**Bug 4: 404 on Direct Page Navigation**
- **Impact:** Navigating directly to `/services`, `/about`, `/industries`, `/careers` returned 404
- **Fix:** Added `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]` to `client/vercel.json` — ✅ Resolved

**Bug 5: Navbar Full-Page Reloads**
- **Impact:** `<a href>` in navbar caused full page reloads, breaking SPA behavior
- **Fix:** Replaced all internal `<a href>` with React Router `<Link to>` in Navbar — ✅ Resolved

### Open Issues

**Issue: Analytics Memory Pressure**
- **File:** `server/src/routes/admin.ts`
- **Impact:** With 100K+ page views, the analytics endpoint loads all rows into Node.js memory
- **Fix (pending):** Use SQL `GROUP BY page_path, COUNT(*)` via Supabase RPC

**Issue: Blog Delete Silent No-Op**
- **File:** `server/src/routes/blog.ts`
- **Impact:** DELETE returns 204 even if post ID doesn't exist
- **Fix (pending):** Check Supabase response count after delete

---

## 4. Deploy Status

### ✅ Live Infrastructure

| Component | Platform | URL | Status |
|-----------|---------|-----|--------|
| Frontend | Vercel | https://jtldinc.com | Live |
| Backend API | Render | https://api.jtldinc.com | Live |
| Database | Supabase (ca-central-1) | dldjahdxilowedziqlgi.supabase.co | Active |
| DNS | GoDaddy | jtldinc.com | Configured |

### DNS Records (GoDaddy)

| Type | Name | Value |
|------|------|-------|
| A | `@` | `216.198.79.1` (Vercel) |
| CNAME | `www` | `b9c8962ded5efb88.vercel-dns-017.com` |
| CNAME | `api` | `jtld-api.onrender.com` |

### Deployment Checklist

**Supabase**
- [x] Project created (ca-central-1 region)
- [x] `001_initial_schema.sql` applied (contact_submissions, blog_posts, admin_profiles, page_views)
- [x] `002_careers.sql` applied (candidates, resumes, resumes storage bucket)
- [x] Admin user created and admin_profiles row inserted
- [x] RLS enabled on all tables
- [x] Supabase Storage bucket `resumes` configured (private, 10MB, PDF/DOC only)

**Backend (Render)**
- [x] Web service connected to GitHub repo
- [x] Root directory set to `server`
- [x] Build command: `npm install --include=dev && npm run build`
- [x] Start command: `npm start`
- [x] Environment variables set: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, CLIENT_URL, NODE_ENV
- [x] Custom domain `api.jtldinc.com` verified
- [x] Health check passing: `GET /api/health`

**Frontend (Vercel)**
- [x] Project connected to GitHub repo
- [x] Root directory set to `client`
- [x] Framework preset set to Vite
- [x] Environment variables set: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL
- [x] Custom domain `jtldinc.com` and `www.jtldinc.com` verified
- [x] SPA rewrites configured in `vercel.json`
- [x] `vite-env.d.ts` added to fix `import.meta.env` TypeScript errors

### Known Limitations (Free Tier)

- **Render free tier:** Server spins down after 15 min of inactivity. First request after idle takes 30–50 seconds. Upgrade to Starter ($7/mo) for always-on.
- **Supabase free tier:** 500MB database, 2GB bandwidth, 1GB storage, 50K auth users/month. Sufficient for current scale.
- **Vercel free tier:** 100GB bandwidth/month. Static SPA — no serverless function limits apply.

### Rollback Triggers

- Contact form submissions failing (500 errors from Render)
- Admin dashboard not loading (auth/CORS issues)
- Render backend returning 503 (free tier cold start > 60s)
- Supabase connection errors in server logs

---

## 5. Feature Inventory

### Shipped Features

| Feature | Description | Routes |
|---------|-------------|--------|
| Homepage | Hero, TechPartners, Contact, CTA | `/` |
| Services page | IT services + WhyUs + CTA | `/services` |
| About page | Company overview + values | `/about` |
| Industries page | Sector expertise | `/industries` |
| Blog (public) | Paginated posts + individual pages | `/blog`, `/blog/:slug` |
| Admin CMS | Dashboard, inquiries, blog editor | `/admin/*` |
| Careers landing | Job listings + why join + CTA | `/careers` |
| Candidate signup | Registration + profile creation | `/careers/signup` |
| Candidate login | Auth to candidate portal | `/careers/login` |
| Candidate profile | Edit profile + resume upload/download/delete | `/careers/profile` |
| Dark mode | System-agnostic toggle, localStorage persistent | Global |
| Mega-menu navbar | TEKsystems-style with full-width dark dropdown panels | Global |
| Region selector | Globe icon → modal with 6 JTLD markets | Navbar utility bar |
| Contact form | Rate-limited POST → Supabase → admin inbox | Homepage |

### Planned / Not Yet Built

| Feature | Priority | Notes |
|---------|----------|-------|
| Client-side form validation | Medium | Contact form + career signup |
| Analytics SQL aggregation | Medium | Replace JS reduce with GROUP BY |
| Email notifications for contact form | Medium | SendGrid integration |
| Blog post search | Low | Full-text search via Supabase |
| SEO meta tags per page | Medium | Dynamic `<title>` and `<meta>` per route |
| reCAPTCHA on contact form | Low | Spam protection |

---

## 6. Documentation Status

| Document | Status | Last Updated |
|----------|--------|-------------|
| `README.md` | ✅ Current | May 8, 2026 |
| `ENGINEERING_REVIEW.md` | ✅ Current | May 8, 2026 |
| `GITHUB_SECRETS.md` | ✅ Current | May 8, 2026 |
| `.env.example` | ✅ Current | May 8, 2026 |
| `docs/tech-spec.md` | ✅ Current | May 8, 2026 |
| `PLATFORM_REVIEW_TEST_SHEET.md` | ✅ Current | May 8, 2026 |
| `supabase/migrations/001_initial_schema.sql` | ✅ Applied | May 8, 2026 |
| `supabase/migrations/002_careers.sql` | ✅ Applied | May 8, 2026 |

---

*This review reflects the complete codebase as of May 8, 2026. All critical findings from the initial review have been resolved. Platform is live at jtldinc.com.*
