# JTLD Consulting Inc — Technical Specification

| Field | Value |
|-------|-------|
| Project | JTLD Consulting Inc Platform |
| Version | 2.0 |
| Updated | May 8, 2026 |
| Status | Live |
| Live URL | https://jtldinc.com |
| API URL | https://api.jtldinc.com |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Database Design](#5-database-design)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [API Specification](#7-api-specification)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Backend Architecture](#9-backend-architecture)
10. [Infrastructure & DevOps](#10-infrastructure--devops)
11. [Security Architecture](#11-security-architecture)
12. [File Storage](#12-file-storage)
13. [Feature Modules](#13-feature-modules)

---

## 1. Executive Summary

### 1.1 Purpose

This document provides the complete technical specification for the JTLD Consulting Inc platform — a corporate website, admin CMS, and candidate careers portal. It describes the architecture, data models, APIs, and infrastructure decisions that were built and are currently live.

### 1.2 Scope

The platform delivers:

- A public marketing site covering JTLD's services, industries, about, and blog
- A contact form with admin inbox management
- A blog CMS with admin editor (create, edit, publish, delete)
- A careers section with job listings and candidate portal
- Candidate self-serve profile management and resume upload
- Admin dashboard with stats and analytics

### 1.3 Architecture Philosophy

| Principle | Implementation |
|-----------|---------------|
| Separation of concerns | Frontend (Vercel) and backend (Render) deploy independently |
| Database-as-platform | Supabase handles PostgreSQL, auth, RLS, and file storage |
| Direct client-DB where safe | Candidate portal reads/writes Supabase directly with RLS enforcement |
| Defense in depth | API middleware auth + Supabase RLS on every table |
| Free-tier viable | Vercel (free), Render (free), Supabase (free) — zero infrastructure cost |

---

## 2. System Architecture

### 2.1 Architecture Diagram

```
                 ┌──────────────┐
                 │   GoDaddy    │
                 │     DNS      │
                 └──────┬───────┘
                        │
         ┌──────────────┴───────────────┐
         │                              │
  ┌──────▼──────┐               ┌───────▼──────┐
  │   Vercel    │               │    Render    │
  │  (Vite SPA) │               │ (Express API)│
  │ jtldinc.com │               │api.jtldinc.com│
  └──────┬──────┘               └───────┬──────┘
         │                              │
         │  ┌───────────────────────────┘
         │  │
  ┌──────▼──▼──────────────────┐
  │         Supabase            │
  │  PostgreSQL + Auth + RLS   │
  │  Storage (resumes bucket)  │
  └────────────────────────────┘
```

### 2.2 Request Flows

**Public page request:**
Browser → Vercel CDN → React SPA → `client/src/lib/api.ts` → `api.jtldinc.com` → Supabase

**Admin request:**
Browser → React SPA → `api.ts` → Express → `requireAuth` → `requireAdmin` → Supabase (service role)

**Candidate portal request:**
Browser → React SPA → `supabase.ts` (client) → Supabase (anon key + RLS)

**Resume upload:**
Browser → React SPA → `supabase.storage.from('resumes').upload(...)` → Supabase Storage → private bucket (RLS: owner only)

---

## 3. Technology Stack

### 3.1 Core Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Runtime | Node.js | 20 LTS | Server runtime |
| Frontend framework | React | 19.x | Component-based UI |
| Build tool | Vite | 6.x | Fast HMR dev server + production bundler |
| Routing | React Router | 6.x | Client-side SPA routing |
| Language | TypeScript | 5.x | Type safety across frontend and backend |
| Styling | Tailwind CSS | 3.x | Utility-first CSS with custom navy/gold palette |
| Backend framework | Express | 5.x | REST API |
| Database | PostgreSQL 17 | via Supabase | Primary data store |
| Auth | Supabase Auth | Latest | JWT-based authentication, email/password |
| File storage | Supabase Storage | Latest | Private resume bucket with RLS |
| Validation | Zod | 3.x | Runtime schema validation on API inputs |
| Icons | lucide-react | Latest | Consistent icon set |

### 3.2 Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| TypeScript strict | Compile-time safety |
| Vite HMR | Hot module replacement in development |
| ts-node-dev | Backend hot reload in development |

### 3.3 Hosting

| Service | Platform | Plan | Notes |
|---------|---------|------|-------|
| Frontend | Vercel | Hobby (free) | Auto-deploy on push to main |
| Backend | Render | Free | Auto-deploy via render.yaml; cold starts after 15 min idle |
| Database | Supabase | Free | 500MB, 50K auth users, 1GB storage |
| DNS | GoDaddy | — | A record → Vercel, CNAME api → Render |

---

## 4. Project Structure

```
JTLD-website/
├── client/                           # Vite + React frontend
│   ├── src/
│   │   ├── App.tsx                   # Route definitions
│   │   ├── main.tsx                  # React entry point
│   │   ├── index.css                 # Global styles + Tailwind directives
│   │   ├── vite-env.d.ts             # Vite env type reference
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminLayout.tsx   # Sidebar layout for admin pages
│   │   │   ├── home/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── TechPartners.tsx
│   │   │   │   ├── Services.tsx
│   │   │   │   ├── About.tsx
│   │   │   │   ├── Industries.tsx
│   │   │   │   ├── WhyUs.tsx
│   │   │   │   ├── Contact.tsx
│   │   │   │   └── CtaBanner.tsx
│   │   │   └── layout/
│   │   │       ├── Navbar.tsx        # Mega-menu + utility bar + region selector
│   │   │       ├── Footer.tsx
│   │   │       ├── Logo.tsx
│   │   │       └── ThemeToggle.tsx   # Dark/light mode (localStorage)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ServicesPage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── IndustriesPage.tsx
│   │   │   ├── CareersPage.tsx
│   │   │   ├── BlogPage.tsx
│   │   │   ├── BlogPostPage.tsx
│   │   │   ├── LoginPage.tsx         # Admin-only login
│   │   │   ├── admin/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── InquiriesPage.tsx
│   │   │   │   └── BlogEditorPage.tsx
│   │   │   └── careers/
│   │   │       ├── CareersLoginPage.tsx
│   │   │       ├── CareersSignupPage.tsx
│   │   │       └── CareersProfilePage.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts            # Supabase session state
│   │   ├── lib/
│   │   │   ├── supabase.ts           # createClient (anon key)
│   │   │   └── api.ts                # Fetch wrapper for Express API
│   │   └── types/
│   │       └── index.ts              # Shared TypeScript interfaces
│   ├── vercel.json                   # SPA catch-all rewrite + Vite config
│   ├── tailwind.config.ts            # Custom navy/gold palette + font-serif
│   ├── vite.config.ts                # Path alias @/ → src/
│   └── tsconfig.json
│
├── server/                           # Express REST API
│   ├── src/
│   │   ├── index.ts                  # App entry: CORS, rate limiting, routes
│   │   ├── routes/
│   │   │   ├── contact.ts            # POST / (public+limited), GET/PATCH (admin)
│   │   │   ├── blog.ts               # GET (public), POST/PATCH/DELETE (admin)
│   │   │   └── admin.ts              # dashboard, blog list, analytics (admin)
│   │   ├── middleware/
│   │   │   ├── auth.ts               # requireAuth, requireAdmin
│   │   │   └── validate.ts           # Zod schema validation middleware
│   │   ├── lib/
│   │   │   └── supabase.ts           # createClient (service role key)
│   │   └── types/
│   │       └── index.ts              # Zod schemas + TypeScript types
│   ├── package.json                  # ts-node-dev for dev, tsc for prod build
│   └── tsconfig.json
│
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql    # contact_submissions, blog_posts, admin_profiles, page_views
│       └── 002_careers.sql           # candidates, resumes, storage bucket + RLS
│
├── render.yaml                       # Render service blueprint
├── .env.example                      # Environment variable template
└── README.md
```

---

## 5. Database Design

### 5.1 Tables

#### `contact_submissions`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | gen_random_uuid() |
| name | TEXT | Not null |
| email | TEXT | Not null |
| company | TEXT | Nullable |
| message | TEXT | Not null |
| status | TEXT | `new`, `read`, `replied` (default: `new`) |
| created_at | TIMESTAMPTZ | Default NOW() |

#### `blog_posts`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | gen_random_uuid() |
| title | TEXT | Not null |
| slug | TEXT | Unique, not null |
| excerpt | TEXT | Nullable |
| body | TEXT | HTML content |
| status | TEXT | `draft`, `published` |
| author_id | UUID | References auth.users |
| published_at | TIMESTAMPTZ | Nullable |
| created_at | TIMESTAMPTZ | Default NOW() |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

#### `admin_profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | References auth.users |
| display_name | TEXT | Not null |
| role | TEXT | `super_admin`, `editor` |
| created_at | TIMESTAMPTZ | Default NOW() |

#### `page_views`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | gen_random_uuid() |
| page_path | TEXT | Not null |
| user_agent | TEXT | Nullable |
| viewed_at | TIMESTAMPTZ | Default NOW() |

#### `candidates`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | gen_random_uuid() |
| user_id | UUID | Unique, references auth.users, ON DELETE CASCADE |
| full_name | TEXT | Not null |
| email | TEXT | Not null |
| phone | TEXT | Nullable |
| location | TEXT | Nullable |
| linkedin_url | TEXT | Nullable |
| bio | TEXT | Nullable |
| created_at | TIMESTAMPTZ | Default NOW() |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

#### `resumes`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | gen_random_uuid() |
| candidate_id | UUID | References candidates, ON DELETE CASCADE |
| file_name | TEXT | Original filename |
| storage_path | TEXT | Path in Supabase Storage (`{user_id}/{timestamp}_{filename}`) |
| file_size | INTEGER | Bytes, nullable |
| uploaded_at | TIMESTAMPTZ | Default NOW() |

### 5.2 Row-Level Security Summary

| Table | Policy |
|-------|--------|
| `contact_submissions` | No public RLS — Express service role reads/writes |
| `blog_posts` | Public SELECT published; admin INSERT/UPDATE/DELETE via service role |
| `admin_profiles` | Admin reads own row via service role |
| `page_views` | Insert from Express; admin reads via service role |
| `candidates` | Owner SELECT/INSERT/UPDATE (auth.uid() = user_id) |
| `resumes` | Owner SELECT/INSERT/DELETE via candidates join |
| `storage.objects` (resumes bucket) | Owner SELECT/INSERT/DELETE (folder = user_id) |

---

## 6. Authentication & Authorization

### 6.1 Two Auth Flows

| Flow | Users | Provider | Portal |
|------|-------|---------|--------|
| Admin | JTLD staff | Supabase Auth (email/password) | `/login` → `/admin/*` |
| Candidate | Job seekers | Supabase Auth (email/password) | `/careers/login` → `/careers/profile` |

Both flows use the same Supabase Auth project. Users are distinguished by:
- **Admin:** Presence of a row in `admin_profiles` table (checked server-side via service role)
- **Candidate:** Presence of a row in `candidates` table (checked client-side via RLS)

### 6.2 Admin Auth Middleware Chain

```typescript
// server/src/middleware/auth.ts
requireAuth   → Verifies JWT from Authorization header via Supabase
requireAdmin  → Checks admin_profiles table for the authenticated user's UUID
```

Routes requiring admin: all GET/PATCH on contacts, all POST/PATCH/DELETE on blog, all admin dashboard endpoints.

### 6.3 Candidate Auth

Candidates authenticate via `supabase.auth.signInWithPassword()` directly from the React client. No Express API involvement — Supabase RLS enforces data access on the database level.

On signup, the client:
1. Calls `supabase.auth.signUp()`
2. Immediately inserts a row into `candidates` with `user_id = data.user.id`

### 6.4 Route Protection

```tsx
// client/src/App.tsx
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return user ? children : <Navigate to="/login" />
}
// Used for /admin/* routes only
// /careers/profile uses useEffect redirect in the page component
```

---

## 7. API Specification

### 7.1 Base URL
- Development: `http://localhost:3001/api`
- Production: `https://api.jtldinc.com/api`

### 7.2 Response Envelope

```typescript
// Success
{ data: T, error: null, pagination?: { page, limit, total, totalPages } }

// Error
{ data: null, error: string }
```

### 7.3 Endpoints

#### Contact

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|-----------|-------------|
| POST | `/contacts` | Public | 5/hr per IP | Submit contact form |
| GET | `/contacts` | Admin | — | List submissions (paginated) |
| GET | `/contacts/:id` | Admin | — | Get submission |
| PATCH | `/contacts/:id/status` | Admin | — | Update status (`new`/`read`/`replied`) |

#### Blog

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/blog` | Public | Published posts (paginated, `?page=1&limit=10`) |
| GET | `/blog/:slug` | Public | Single post by slug |
| POST | `/blog` | Admin | Create post |
| PATCH | `/blog/:id` | Admin | Update post |
| DELETE | `/blog/:id` | Admin | Delete post |

#### Admin

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/dashboard` | Admin | Stats: contacts, posts, analytics |
| GET | `/admin/blog` | Admin | All posts including drafts |
| GET | `/admin/analytics` | Admin | Page views by path |

#### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | Public | `{ status: "ok", timestamp }` |

### 7.4 Contact Schema (Zod)

```typescript
const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
})
```

### 7.5 Blog Post Schema (Zod)

```typescript
const BlogPostSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(100),
  excerpt: z.string().max(500).optional(),
  body: z.string().min(50),
  status: z.enum(['draft', 'published']),
})
```

---

## 8. Frontend Architecture

### 8.1 Routing (React Router v6)

```
/                    → HomePage
/services            → ServicesPage
/about               → AboutPage
/industries          → IndustriesPage
/careers             → CareersPage
/careers/login       → CareersLoginPage
/careers/signup      → CareersSignupPage
/careers/profile     → CareersProfilePage (candidate auth required)
/blog                → BlogPage
/blog/:slug          → BlogPostPage
/login               → LoginPage (admin)
/admin               → DashboardPage (ProtectedRoute)
/admin/inquiries     → InquiriesPage (ProtectedRoute)
/admin/blog          → BlogEditorPage (ProtectedRoute)
/admin/blog/new      → BlogEditorPage (ProtectedRoute)
/admin/blog/:id      → BlogEditorPage (ProtectedRoute)
```

### 8.2 State Management

No global state library. State is managed through:
- `useAuth()` hook — Supabase session, cached in component tree
- Local `useState` within each page
- URL params via React Router for blog slugs and admin blog IDs

### 8.3 Styling System

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      navy: { 50..950 },   // Primary brand color
      gold: { 300..500 },  // Accent color
    },
    fontFamily: {
      serif: ['Georgia', 'serif'],  // Used for headings
    }
  }
}
```

Shared CSS utility classes (defined in `index.css`):
- `.section-eyebrow` — small uppercase label above headings
- `.section-title` — main section heading style
- `.section-subtitle` — paragraph beneath section heading

### 8.4 Navbar Architecture

The navbar renders as two bars:
1. **Utility bar** (36px) — Locations, region selector (modal), Search
2. **Main nav bar** (64px) — Logo, mega-menu items, ThemeToggle, Contact Us CTA

**Mega-menu:** Full-width dark navy panel (`bg-navy-950`) drops from the nav on hover. Each column has a bold uppercase heading and links. Implemented with `onMouseEnter`/`onMouseLeave` + `setTimeout` debounce (120ms) to prevent flicker.

**Region selector:** Modal overlay with 6 JTLD markets (Canada, USA, Ghana, Nigeria, Kenya, South Africa). Selection persists in component state.

### 8.5 Theme

Dark mode uses Tailwind's `class` strategy. `ThemeToggle` reads/writes `localStorage('jtld-theme')` and toggles the `dark` class on `<html>`. Default is `light`.

---

## 9. Backend Architecture

### 9.1 Express Setup (`server/src/index.ts`)

```typescript
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))
app.post('/api/contacts', contactLimiter)   // Rate limit POST only
app.use('/api/contacts', contactRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/admin', adminRoutes)
```

### 9.2 Auth Middleware

```typescript
// requireAuth — verifies Supabase JWT
const token = req.headers.authorization?.replace('Bearer ', '')
const { data: { user }, error } = await supabase.auth.getUser(token)

// requireAdmin — checks admin_profiles table
const { data: profile } = await supabase
  .from('admin_profiles').select('role').eq('id', user.id).single()
if (!profile) return res.status(403).json({ error: 'Forbidden' })
```

### 9.3 Rate Limiting

```typescript
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 5,                      // 5 submissions per IP
  message: { error: 'Too many requests' }
})
// Applied to POST /api/contacts only — admin GETs are unrestricted
```

### 9.4 Supabase Clients

Two clients with different privilege levels:

| Client | Key | Used In | Purpose |
|--------|-----|---------|---------|
| Anon client | `SUPABASE_ANON_KEY` | Frontend | Candidate portal (RLS enforced) |
| Service role client | `SUPABASE_SERVICE_ROLE_KEY` | Backend | Admin operations (bypasses RLS) |

---

## 10. Infrastructure & DevOps

### 10.1 CI/CD Pipeline

```
Push to develop → Vercel Preview Deploy (automatic)
Push to main    → Vercel Production Deploy (automatic)
                → Render Production Deploy (via render.yaml)
```

### 10.2 Render Configuration (`render.yaml`)

```yaml
services:
  - type: web
    name: jtld-api
    runtime: node
    rootDir: server
    buildCommand: npm install --include=dev && npm run build
    startCommand: npm start
    plan: free
    envVars:
      - key: NODE_ENV
        value: production
      - key: CLIENT_URL
        value: https://jtldinc.com
      - key: SUPABASE_URL
        sync: false   # Set manually in Render dashboard
      - key: SUPABASE_ANON_KEY
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
```

> `--include=dev` in buildCommand is required because TypeScript and `@types/*` are devDependencies but needed at compile time in production.

### 10.3 Vercel Configuration (`client/vercel.json`)

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

The catch-all rewrite is essential for React Router SPA — without it, Vercel returns 404 for direct navigation to `/services`, `/careers`, etc.

---

## 11. Security Architecture

### 11.1 API Security

| Mechanism | Implementation |
|-----------|---------------|
| CORS | Restricted to `CLIENT_URL` env var |
| HTTP headers | `helmet()` middleware sets security headers |
| Input validation | Zod schema validation on all POST/PATCH endpoints |
| Auth | JWT verification via Supabase on every protected endpoint |
| Authorization | Admin role check via `admin_profiles` table on admin routes |
| Rate limiting | `express-rate-limit`: 5 contact submissions/hr per IP |

### 11.2 Database Security

| Mechanism | Implementation |
|-----------|---------------|
| RLS | Enabled on candidates, resumes, storage.objects |
| Service role isolation | Only the Express API uses the service role key |
| Env var protection | Service role key never exposed to frontend |

### 11.3 File Upload Security

| Check | Value |
|-------|-------|
| Max file size | 10 MB (Supabase bucket limit) |
| Allowed MIME types | `application/pdf`, `application/msword`, `.docx` |
| Storage path | `{user_id}/{timestamp}_{filename}` — user isolated by folder |
| RLS policy | `auth.uid()::text = (storage.foldername(name))[1]` |
| Access | Private bucket — signed URLs for download (60s expiry) |

---

## 12. File Storage

### 12.1 Supabase Storage: `resumes` Bucket

| Property | Value |
|----------|-------|
| Bucket name | `resumes` |
| Access | Private |
| File size limit | 10 MB |
| Allowed types | PDF, DOC, DOCX |

### 12.2 Upload Flow

1. Candidate selects file in `CareersProfilePage`
2. Client calls `supabase.storage.from('resumes').upload(path, file)`
3. Storage path format: `{user_id}/{Date.now()}_{original_filename}`
4. On success, client inserts row into `resumes` table with `storage_path`

### 12.3 Download Flow

1. Candidate clicks Download on a resume
2. Client calls `supabase.storage.from('resumes').createSignedUrl(path, 60)`
3. Signed URL opened in new tab — expires in 60 seconds

### 12.4 Delete Flow

1. Candidate clicks Delete
2. Client calls `supabase.storage.from('resumes').remove([path])`
3. Client calls `supabase.from('resumes').delete().eq('id', resumeId)`
4. Both the storage object and the metadata row are removed

---

## 13. Feature Modules

### 13.1 Careers Module

The careers module is the most recent major feature. It operates entirely through Supabase (no Express API involvement).

**Public pages:**
- `/careers` — Landing page with job listings (static), why join section, signup/login CTAs

**Candidate portal (auth-gated):**
- `/careers/signup` — Registers user in Supabase Auth + inserts `candidates` row
- `/careers/login` — Supabase Auth sign-in → redirect to profile
- `/careers/profile` — Two-tab UI:
  - *Personal Info* — Edit name, phone, location, LinkedIn, bio
  - *My Resumes* — Upload (drag/click), list with download + delete

**Data flow:**
```
Signup → supabase.auth.signUp() → candidates.insert()
Login  → supabase.auth.signInWithPassword() → navigate('/careers/profile')
Profile → candidates.update() [RLS: user_id = auth.uid()]
Resume upload → storage.upload() → resumes.insert()
Resume download → storage.createSignedUrl()
Resume delete → storage.remove() + resumes.delete()
```

### 13.2 Blog Module

Blog uses a hybrid approach:
- **Public read:** Express API (`GET /api/blog`, `GET /api/blog/:slug`) — returns only published posts
- **Admin write:** Express API with `requireAdmin` (`POST`, `PATCH`, `DELETE /api/blog`) — full access
- **Admin list:** Express API (`GET /api/admin/blog`) — returns all posts including drafts

### 13.3 Contact Module

- **Public form:** `POST /api/contacts` — rate-limited (5/hr per IP), validated with Zod
- **Admin inbox:** `GET /api/contacts` — paginated list with status filter
- **Status update:** `PATCH /api/contacts/:id/status` — `new` → `read` → `replied`

### 13.4 Admin CMS

Protected by `ProtectedRoute` → `requireAuth` → `requireAdmin`:
- **Dashboard:** Counts (total contacts, unread, published posts, page views last 30 days)
- **Inquiries:** Table of contact submissions with status management
- **Blog Editor:** Create/edit posts with title, slug (auto-generated), excerpt, body, status toggle

---

*Technical specification reflects the production system as of May 8, 2026.*
