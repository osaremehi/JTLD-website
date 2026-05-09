# GitHub Secrets & CI/CD Setup Guide

> Set secrets at: **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**
> Or via CLI: `gh secret set SECRET_NAME`

---

## Deployment Architecture

| Service | Platform | Domain | Branch |
|---------|---------|--------|--------|
| Frontend (React/Vite) | Vercel | `jtldinc.com` | `main` (production), `develop` (preview) |
| Backend (Express API) | Render | `api.jtldinc.com` | `main` via `render.yaml` |
| Database + Auth + Storage | Supabase | `dldjahdxilowedziqlgi.supabase.co` | N/A (managed) |

---

## Required GitHub Secrets (Vercel Deployment)

### `VERCEL_TOKEN`
- **What:** Personal access token for Vercel CLI
- **Get it:** [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create Token → Full Account scope
```bash
gh secret set VERCEL_TOKEN
```

### `VERCEL_ORG_ID`
- **What:** Your Vercel team/org ID
- **Get it:** Vercel dashboard → Settings → General → Team ID, or from `.vercel/project.json`
```bash
gh secret set VERCEL_ORG_ID --body "your-org-id"
```

### `VERCEL_PROJECT_ID`
- **What:** The specific Vercel project ID for the frontend
- **Get it:** Vercel project → Settings → General → Project ID
```bash
gh secret set VERCEL_PROJECT_ID --body "your-project-id"
```

---

## Required Vercel Environment Variables (App Runtime)

Set these in Vercel: **Project → Settings → Environment Variables**

| Variable | Value | Environment |
|----------|-------|------------|
| `VITE_SUPABASE_URL` | `https://dldjahdxilowedziqlgi.supabase.co` | Production + Preview |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Production + Preview |
| `VITE_API_URL` | `https://api.jtldinc.com/api` | Production |
| `VITE_API_URL` | Your Render preview URL | Preview |

```bash
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_API_URL production
```

---

## Required Render Environment Variables (Backend Runtime)

Set these in Render: **Service → Environment**

> Render reads `render.yaml` from the repo root for service config. Env vars with `sync: false` must be set manually.

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | `https://dldjahdxilowedziqlgi.supabase.co` |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (keep secret) |
| `CLIENT_URL` | `https://jtldinc.com` |
| `NODE_ENV` | `production` |

---

## Quick Setup Checklist

```bash
# 1. Install GitHub CLI (Windows)
winget install GitHub.cli

# 2. Authenticate
gh auth login

# 3. Set Vercel deployment secrets
gh secret set VERCEL_TOKEN           # paste when prompted
gh secret set VERCEL_ORG_ID --body "your-org-id"
gh secret set VERCEL_PROJECT_ID --body "your-project-id"

# 4. Verify
gh secret list
```

---

## Environment Mapping

| Branch | Vercel Environment | URL |
|--------|-------------------|-----|
| `main` | Production | `https://jtldinc.com` |
| `develop` | Preview | Dynamic preview URL |
| Feature PR | Preview | Dynamic preview URL (auto-commented on PR) |

---

## Render Auto-Deploy

Render is configured via `render.yaml` in the repo root. On push to `main`, Render automatically:
1. Installs dependencies: `npm install --include=dev`
2. Builds TypeScript: `npm run build`
3. Starts server: `npm start`

The `--include=dev` flag is required because TypeScript and `@types/*` packages are devDependencies but needed at build time.

---

## Optional Secrets (Future Features)

| Secret | Purpose |
|--------|---------|
| `SENDGRID_API_KEY` | Email notifications for contact form |
| `SENTRY_DSN` | Error monitoring |
| `GA4_MEASUREMENT_ID` | Google Analytics |
