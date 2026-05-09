# JTLD Consulting Inc — Full Stack Platform

Corporate website and candidate portal for JTLD Consulting Inc, an IT strategy and management consulting firm operating across North America and Africa.

**Live site:** [jtldinc.com](https://jtldinc.com) · **API:** [api.jtldinc.com](https://api.jtldinc.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL via Supabase (with RLS) |
| Auth | Supabase Auth (admin + candidate flows) |
| File Storage | Supabase Storage (candidate resumes) |
| Frontend Hosting | Vercel (root dir: `client/`) |
| Backend Hosting | Render (root dir: `server/`) |
| Domain | GoDaddy DNS → Vercel + Render |

---

## Project Structure

```
├── client/                        # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/             # Admin layout
│   │   │   ├── home/              # Homepage section components
│   │   │   └── layout/            # Navbar, Footer, Logo, ThemeToggle
│   │   ├── pages/
│   │   │   ├── admin/             # DashboardPage, InquiriesPage, BlogEditorPage
│   │   │   ├── careers/           # CareersLoginPage, CareersSignupPage, CareersProfilePage
│   │   │   ├── HomePage.tsx
│   │   │   ├── CareersPage.tsx
│   │   │   ├── ServicesPage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── IndustriesPage.tsx
│   │   │   ├── BlogPage.tsx
│   │   │   ├── BlogPostPage.tsx
│   │   │   └── LoginPage.tsx      # Admin-only login
│   │   ├── hooks/
│   │   │   └── useAuth.ts         # Supabase auth state hook
│   │   ├── lib/
│   │   │   ├── supabase.ts        # Supabase client
│   │   │   └── api.ts             # Express API client wrapper
│   │   └── types/
│   │       └── index.ts           # Shared TypeScript types
│   ├── vercel.json                # SPA rewrite rule + Vite config
│   └── ...config files (vite, tailwind, tsconfig, postcss)
│
├── server/                        # Express API backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── contact.ts         # Contact form endpoints
│   │   │   ├── blog.ts            # Blog CRUD endpoints
│   │   │   └── admin.ts           # Admin dashboard endpoints
│   │   ├── middleware/
│   │   │   ├── auth.ts            # requireAuth + requireAdmin
│   │   │   └── validate.ts        # Zod validation middleware
│   │   ├── lib/
│   │   │   └── supabase.ts        # Server-side Supabase client (service role)
│   │   └── types/
│   │       └── index.ts           # Zod schemas + TypeScript types
│   └── ...config files (tsconfig, package.json)
│
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql  # contact_submissions, blog_posts, admin_profiles, page_views
│       └── 002_careers.sql         # candidates, resumes tables + storage bucket
│
├── render.yaml                    # Render blueprint (auto-deploy backend)
└── .env.example                   # Environment variable template
```

---

## Pages & Routes

| Route | Page | Auth |
|-------|------|------|
| `/` | Homepage (Hero, TechPartners, Contact, CTA) | Public |
| `/services` | What We Do (Services + WhyUs) | Public |
| `/about` | Who We Are (About) | Public |
| `/industries` | Industries | Public |
| `/careers` | Careers landing + job listings | Public |
| `/careers/signup` | Candidate registration | Public |
| `/careers/login` | Candidate sign in | Public |
| `/careers/profile` | Candidate profile + resume upload | Candidate Auth |
| `/blog` | Blog listing | Public |
| `/blog/:slug` | Blog post | Public |
| `/login` | Admin login | Public |
| `/admin` | Admin dashboard | Admin only |
| `/admin/inquiries` | Contact submissions | Admin only |
| `/admin/blog` | Blog editor | Admin only |

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | Public | Health check |
| POST | `/api/contacts` | Public (rate-limited) | Submit contact form |
| GET | `/api/contacts` | Admin | List submissions (paginated) |
| GET | `/api/contacts/:id` | Admin | Get single submission |
| PATCH | `/api/contacts/:id/status` | Admin | Update submission status |
| GET | `/api/blog` | Public | List published posts (paginated) |
| GET | `/api/blog/:slug` | Public | Get post by slug |
| POST | `/api/blog` | Admin | Create blog post |
| PATCH | `/api/blog/:id` | Admin | Update blog post |
| DELETE | `/api/blog/:id` | Admin | Delete blog post |
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET | `/api/admin/blog` | Admin | All posts (incl. drafts) |
| GET | `/api/admin/analytics` | Admin | Page view analytics |

> **Candidate portal** (profile, resume upload/download) communicates directly with Supabase — no Express API routes needed.

---

## Database Schema

### Tables (Supabase PostgreSQL)

| Table | Purpose | RLS |
|-------|---------|-----|
| `contact_submissions` | Contact form entries | Admin read via service role |
| `blog_posts` | Blog content (title, slug, body, status) | Public read published; admin write |
| `admin_profiles` | Admin user roles (`super_admin`, `editor`) | Admin read own |
| `page_views` | Analytics page view log | Admin read |
| `candidates` | Candidate profile (name, email, phone, location, bio) | Owner only |
| `resumes` | Resume file metadata + Supabase Storage path | Owner only |

### Storage Buckets

| Bucket | Access | Limit | Types |
|--------|--------|-------|-------|
| `resumes` | Private (owner only) | 10 MB | PDF, DOC, DOCX |

---

## Local Setup

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com) project

### 1. Clone

```bash
git clone https://github.com/osaremehi/JTLD-website.git
cd JTLD-website
```

### 2. Apply database migrations

In your Supabase project → SQL Editor, run in order:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_careers.sql`

### 3. Create your admin user

In Supabase → Authentication → Users → Add User, then:
```sql
INSERT INTO admin_profiles (id, display_name, role)
VALUES ('your-user-uuid', 'Your Name', 'super_admin');
```

### 4. Configure environment

```bash
# Backend
cp .env.example server/.env
# Fill in SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, CLIENT_URL, PORT

# Frontend
cp .env.example client/.env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL
```

### 5. Run backend

```bash
cd server
npm install
npm run dev    # http://localhost:3001
```

### 6. Run frontend

```bash
cd client
npm install
npm run dev    # http://localhost:5173
```

---

## Deployment

### Frontend → Vercel

1. Import repo in Vercel, set **Root Directory** to `client`, **Framework** to `Vite`
2. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (e.g. `https://api.jtldinc.com/api`)
3. Vercel auto-deploys on push to `main`

### Backend → Render

Render reads `render.yaml` from the repo root automatically.

Build command: `npm install --include=dev && npm run build`
Start command: `npm start`

Add environment variables in Render dashboard:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLIENT_URL` (e.g. `https://jtldinc.com`)
- `NODE_ENV=production`

### DNS (GoDaddy)

| Type | Name | Value |
|------|------|-------|
| A | `@` | `216.198.79.1` (Vercel) |
| CNAME | `www` | `b9c8962ded5efb88.vercel-dns-017.com` |
| CNAME | `api` | `jtld-api.onrender.com` |

---

## Branch Strategy

| Branch | Environment | URL |
|--------|------------|-----|
| `main` | Production | jtldinc.com |
| `develop` | Staging | Preview URL (Vercel) |

---

## License

Proprietary — JTLD Consulting Inc. All rights reserved.
