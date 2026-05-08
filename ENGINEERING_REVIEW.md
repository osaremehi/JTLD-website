# JTLD Consulting Inc — Platform Engineering Review

**Date:** May 8, 2026  
**Reviewer:** Claude (Engineering Review Suite)  
**Scope:** Architecture, Code Review, Debug Audit, Deploy Checklist, Documentation  
**Stack:** React 19 + Vite + Tailwind | Express + TypeScript | Supabase (PostgreSQL)

---

## 1. Architecture Decision Record (ADR-001)

**Status:** Accepted  
**Decision:** React + Express + Supabase monorepo for corporate website with admin CMS

### Context

JTLD Consulting Inc needed a professional web presence with a contact form, blog, and admin dashboard. The platform must be cost-efficient (startup/consulting budget), maintainable by a small team, and deployable on free-tier hosting.

### Options Considered

| Dimension | React + Express + Supabase | Next.js + Supabase (Full-stack) | WordPress + Headless CMS |
|-----------|---------------------------|--------------------------------|--------------------------|
| Complexity | Medium | Medium | Low |
| Cost | Free tier viable | Free tier viable | Hosting + plugins |
| Scalability | Good (stateless API) | Good (edge functions) | Limited |
| Team familiarity | High (standard stack) | Medium (SSR patterns) | Low (PHP) |
| SEO | Requires SSR add-on | Built-in SSR/SSG | Built-in |
| Time to ship | Fast | Fast | Fastest for basic sites |

### Decision Rationale

The React + Express + Supabase stack was the right call for this project. It gives full control over both frontend and backend, avoids vendor lock-in beyond the database layer, and keeps the deployment story simple (static SPA on Vercel, API on Render). Supabase provides auth, PostgreSQL, and RLS without managing infrastructure.

### Trade-offs Accepted

- **No SSR/SSG:** The SPA architecture means search engines must execute JavaScript. For a consulting site where most traffic comes from referrals (not organic search), this is acceptable. If SEO becomes critical, migrating the public pages to Next.js is straightforward since the API layer stays the same.
- **Two deployment targets:** Frontend and backend deploy separately, which adds operational overhead but keeps concerns cleanly separated.
- **Supabase dependency:** Auth and database are coupled to Supabase. The SQL schema is standard PostgreSQL, so migration to self-hosted Postgres is feasible but would require replacing the auth layer.

### Consequences

- Deployments are independent (frontend can ship without backend changes)
- The API is reusable if a mobile app is needed later
- Supabase's free tier covers the expected traffic for 12+ months
- Adding server-side rendering later requires a framework change (Next.js migration)

---

## 2. Code Review

### Summary

The codebase is clean, well-organized, and follows modern TypeScript conventions. The server uses Zod for input validation, the client has a consistent API abstraction layer, and the admin dashboard is properly protected. There are several issues worth addressing before production deployment.

### Critical Issues

| # | File | Line | Issue | Severity |
|---|------|------|-------|----------|
| 1 | `server/src/routes/contact.ts` | 33 | **GET /contacts missing `requireAdmin`** — the route uses `requireAuth` but any authenticated user (including `editor` role) can view all contact submissions. Should use `requireAdmin` middleware. | CRITICAL |
| 2 | `server/src/routes/contact.ts` | 87 | **PATCH status missing `requireAdmin`** — same issue: any authenticated user can change submission status. | CRITICAL |
| 3 | `server/src/routes/blog.ts` | 98 | **PATCH /blog/:id missing validation** — uses `BlogPostSchema.partial().parse()` inline instead of the `validate()` middleware, which is inconsistent but functional. However, there's no `requireAdmin` check — only `requireAuth`. An `editor` without admin role can update any post. | HIGH |
| 4 | `server/src/routes/blog.ts` | 135 | **DELETE /blog/:id missing `requireAdmin`** — same pattern: `requireAuth` without admin role check. | HIGH |
| 5 | `server/src/index.ts` | 42 | **Rate limiter on contacts applies to ALL methods** — the `contactLimiter` (5/hr) is applied to the entire `/api/contacts` route, including admin GET requests. An admin refreshing the inquiries page 6 times in an hour gets rate-limited. | MEDIUM |
| 6 | `server/src/middleware/auth.ts` | 27 | **Service role client used for `getUser()`** — `supabase.auth.getUser(token)` is called with the service role client. This works but means every authenticated request makes a Supabase API call. Consider caching or using JWT verification locally. | MEDIUM |

### Suggestions

| # | File | Line | Suggestion | Category |
|---|------|------|------------|----------|
| 1 | `server/src/index.ts` | 18-21 | **CORS origin should support array** for multiple environments (staging, production). Currently only one `CLIENT_URL` is allowed. | Config |
| 2 | `client/src/lib/api.ts` | 22-26 | **No error handling for non-JSON responses** — if the server returns HTML (e.g., Render's error page), `res.json()` will throw. Add a content-type check. | Robustness |
| 3 | `client/src/pages/admin/BlogEditorPage.tsx` | 210 | **Missing import** — `FileText` is used in the empty state but never imported. This will cause a runtime error when no blog posts exist. | Bug |
| 4 | `server/src/routes/admin.ts` | 99-131 | **Analytics loads ALL page views into memory** — the analytics endpoint fetches every `page_path` row for the period and aggregates in JavaScript. For a site with significant traffic, this will be slow and memory-intensive. Use a SQL `GROUP BY` query instead. | Performance |
| 5 | `client/src/hooks/useAuth.ts` | — | **No token refresh handling** — Supabase handles refresh internally, but the app doesn't handle the case where a session expires mid-use (e.g., long-idle admin tab). Consider adding an error interceptor in the API layer. | Reliability |
| 6 | `server/src/routes/blog.ts` | 135-151 | **Delete returns 204 even if row didn't exist** — Supabase delete doesn't error when the row doesn't exist; it just deletes 0 rows. Should check affected count. | Correctness |
| 7 | `client/src/components/home/Contact.tsx` | — | **No client-side validation** — the form relies entirely on `required` HTML attributes and server-side Zod validation. Adding inline validation (email format, message length) would improve UX. | UX |

### What Looks Good

- **Zod schemas** are well-defined with sensible constraints (min/max lengths, regex on slugs, email validation)
- **Consistent API envelope** (`{ data, error, pagination }`) across all endpoints
- **Rate limiting** is differentiated — public browse vs. form submission have different thresholds
- **Auto-slug generation** from title in the blog editor is a nice UX touch
- **RLS policies** provide defense-in-depth even though the Express API handles auth
- **Theme persistence** with `localStorage` + system preference detection is properly implemented
- **TypeScript usage** is strong throughout — no `any` types, proper interface declarations

### Verdict: **Request Changes** (fix critical auth issues before deploying)

---

## 3. Debug Audit — Potential Issues

### Bug 1: Missing `FileText` Import (BlogEditorPage)

**File:** `client/src/pages/admin/BlogEditorPage.tsx`, line 210  
**Impact:** Runtime crash when blog posts list is empty  
**Root Cause:** `FileText` icon from `lucide-react` is used in the empty state JSX but not included in the import statement on line 4.  
**Fix:** Add `FileText` to the import:
```typescript
import { Plus, Edit3, Trash2, ArrowLeft, FileText } from 'lucide-react'
```

### Bug 2: Authorization Gap on Contact/Blog Routes

**Impact:** Any authenticated user (even `editor` role) can read all contact submissions, change statuses, edit/delete any blog post.  
**Root Cause:** Routes use `requireAuth` instead of the available `requireAdmin` middleware.  
**Fix:** Add `requireAdmin` after `requireAuth` on admin-only routes, or apply it at the router level (like `admin.ts` does).

### Bug 3: Rate Limiter Blocks Admin Reads

**Impact:** Admin users refreshing the inquiries page get blocked after 5 requests/hour.  
**Root Cause:** `contactLimiter` is mounted on the entire `/api/contacts` path (all HTTP methods).  
**Fix:** Apply `contactLimiter` only to POST:
```typescript
router.post('/', contactLimiter, validate(ContactSchema), async (req, res) => { ... })
```
And mount the route without the limiter in `index.ts`:
```typescript
app.use('/api/contacts', contactRoutes)
```

### Bug 4: Analytics Memory Pressure

**Impact:** With 100K+ page views, the analytics endpoint loads all rows into Node.js memory.  
**Root Cause:** Supabase query fetches all `page_path` values, then aggregates in JS.  
**Fix:** Use Supabase's RPC or a raw SQL query with `GROUP BY page_path` and `COUNT(*)`.

### Bug 5: Blog Delete Silent No-Op

**Impact:** DELETE returns 204 even if the post ID doesn't exist, misleading the client.  
**Root Cause:** Supabase `.delete().eq('id', ...)` succeeds with 0 affected rows.  
**Fix:** Use `.select()` after delete or check the response to confirm a row was actually removed.

### Edge Case: Slug Collision on Update

**Impact:** If an admin changes a post's slug to one that already exists, the update will fail with a Postgres unique constraint error, but the error handling returns a generic 404 instead of a proper 409 Conflict.  
**Fix:** Check for error code `23505` in the PATCH handler (like the POST handler already does).

---

## 4. Deploy Checklist

### Pre-Deploy: Supabase

- [ ] Create Supabase project at supabase.com
- [ ] Run `001_initial_schema.sql` in SQL Editor
- [ ] Create admin user in Authentication > Users
- [ ] Insert admin profile via SQL (UUID, display name, `super_admin` role)
- [ ] Copy Supabase URL, anon key, and service role key
- [ ] Verify RLS policies are enabled on all 4 tables

### Pre-Deploy: Code Fixes (REQUIRED)

- [ ] Fix `FileText` missing import in `BlogEditorPage.tsx`
- [ ] Add `requireAdmin` middleware to contact GET/PATCH routes
- [ ] Add `requireAdmin` middleware to blog POST/PATCH/DELETE routes
- [ ] Move `contactLimiter` to POST-only (not all methods)
- [ ] Test all endpoints with Postman/curl after fixes

### Deploy: Backend (Render)

- [ ] Push code to GitHub
- [ ] Create Web Service on render.com
- [ ] Connect GitHub repo, set root directory to `server`
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Set environment variables:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `CLIENT_URL` (your Vercel domain, e.g., `https://jtldinc.vercel.app`)
  - `PORT` = `3001`
- [ ] Verify health check: `GET /api/health` returns `{ status: "ok" }`
- [ ] Test contact form POST from curl

### Deploy: Frontend (Vercel)

- [ ] Import project in Vercel
- [ ] Set root directory to `client`
- [ ] Set environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_API_URL` = your Render backend URL (e.g., `https://jtld-api.onrender.com/api`)
- [ ] Deploy and verify homepage loads
- [ ] Test dark/light mode toggle
- [ ] Test contact form submission (end-to-end)
- [ ] Test blog page loads (empty state OK)
- [ ] Login at `/login` with admin credentials
- [ ] Verify admin dashboard loads with stats

### Post-Deploy Verification

- [ ] Contact form submission creates row in Supabase `contact_submissions`
- [ ] Blog post create/edit/delete works from admin
- [ ] Published blog posts visible on public `/blog` page
- [ ] Rate limiting works (submit contact form 6 times, verify 429)
- [ ] Non-admin user cannot access admin API endpoints
- [ ] Theme toggle works and persists across page reloads

### Rollback Triggers

- Contact form submissions failing (500 errors)
- Admin dashboard not loading (auth/CORS issues)
- Render backend returning 503 (free tier cold start > 30s)
- Supabase connection errors in server logs

### Known Limitations (Free Tier)

- **Render free tier:** Server spins down after 15 min of inactivity. First request after idle takes 30-50 seconds (cold start). Consider upgrading to Starter ($7/mo) for always-on.
- **Supabase free tier:** 500MB database, 2GB bandwidth, 50K auth requests/month. More than sufficient for a consulting site.
- **Vercel free tier:** 100GB bandwidth/month, serverless function limits don't apply (static SPA).

---

## 5. Documentation Review

### What Exists (README.md)

The README is solid and covers the essentials: tech stack, project structure tree, 6-step setup guide, API endpoint table (13 endpoints with auth requirements), and deployment instructions for both Vercel and Render.

### What's Missing

| Gap | Priority | Recommendation |
|-----|----------|----------------|
| **No CONTRIBUTING.md** | Low | Not needed for a solo/small team project |
| **No API error codes reference** | Medium | Document the error envelope format and all error codes (`VALIDATION_ERROR`, `UNAUTHORIZED`, `RATE_LIMITED`, etc.) |
| **No environment setup troubleshooting** | Medium | Add common issues: CORS errors, Supabase key misconfig, Render cold starts |
| **No architecture diagram** | Low | A simple Mermaid diagram showing Client → API → Supabase would help onboarding |
| **No changelog** | Low | Start one when shipping updates |
| **Blog content format undocumented** | Medium | The blog editor accepts raw HTML — document supported tags and any sanitization expectations |

### README Accuracy Check

- API endpoint table matches actual routes — **accurate**
- Setup steps are complete and in correct order — **accurate**
- Environment variables listed match what the code expects — **accurate**
- Deployment instructions are correct for both platforms — **accurate**

---

## Summary of Priority Actions

### Must Fix Before Deploy (Critical)

1. Add `FileText` to imports in `BlogEditorPage.tsx`
2. Add `requireAdmin` to contact and blog admin routes
3. Move `contactLimiter` to POST-only

### Should Fix Soon (High)

4. Add content-type check in client API wrapper
5. Handle slug collision on blog PATCH (return 409)
6. Optimize analytics endpoint with SQL aggregation

### Nice to Have (Medium)

7. Add client-side form validation
8. Support multiple CORS origins
9. Add API error codes documentation
10. Add token refresh error handling

---

*This review covers the complete codebase as of May 8, 2026. All findings are based on static analysis of the source code.*
