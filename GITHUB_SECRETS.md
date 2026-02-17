# GitHub Secrets & API Keys — CI/CD Setup Guide

> This document lists all secrets required for the GitHub Actions CI/CD pipeline.
> Set them at: **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**
> Or via CLI: `gh secret set SECRET_NAME`

---

## Required Secrets (Deployment)

These are needed for the `deploy.yml` and `pr-preview.yml` workflows to deploy to Vercel.

### `VERCEL_TOKEN`

- **What:** Personal access token for Vercel CLI authentication
- **Where to get it:** [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
- **Steps:**
  1. Go to https://vercel.com/account/tokens
  2. Click "Create Token"
  3. Name it `github-actions` (or similar)
  4. Scope: Full Account
  5. Copy the token immediately (it won't be shown again)
- **Set it:**
  ```bash
  gh secret set VERCEL_TOKEN
  # Paste the token when prompted
  ```

### `VERCEL_ORG_ID`

- **What:** Your Vercel team/org identifier
- **Value:** `team_LLH7S0MJTcyU6oTmXNwHCK7V`
- **Source:** `.vercel/project.json` → `orgId`
- **Set it:**
  ```bash
  gh secret set VERCEL_ORG_ID --body "team_LLH7S0MJTcyU6oTmXNwHCK7V"
  ```

### `VERCEL_PROJECT_ID`

- **What:** The Vercel project identifier
- **Value:** `prj_DxtRWbI09E2zLXLP6pcMWfVJpun3`
- **Source:** `.vercel/project.json` → `projectId`
- **Set it:**
  ```bash
  gh secret set VERCEL_PROJECT_ID --body "prj_DxtRWbI09E2zLXLP6pcMWfVJpun3"
  ```

---

## Required Secrets (Application Runtime)

These are needed as Vercel environment variables for the app to function in staging/production.

### `ANTHROPIC_API_KEY`

- **What:** API key for the Tosh chatbot (Claude Haiku)
- **Where to get it:** [Anthropic Console → API Keys](https://console.anthropic.com/settings/keys)
- **Used by:** `POST /api/chat` endpoint
- **Set in Vercel:**
  ```bash
  vercel env add ANTHROPIC_API_KEY production
  vercel env add ANTHROPIC_API_KEY preview
  ```

### `DATABASE_URL`

- **What:** PostgreSQL connection string
- **Format:** `postgresql://user:password@host:5432/dbname`
- **Used by:** Prisma ORM (migrations, queries)
- **Where to get it:** Your database provider (Supabase, Neon, Railway, etc.)
- **Set in GitHub (for CI migration job):**
  ```bash
  gh secret set DATABASE_URL
  ```
- **Set in Vercel (for runtime):**
  ```bash
  vercel env add DATABASE_URL production
  vercel env add DATABASE_URL preview
  ```

---

## Optional Secrets (Future Features)

These are referenced in `.env.example` but not yet required for current functionality.

| Secret | Purpose | When Needed |
|--------|---------|-------------|
| `NEXTAUTH_SECRET` | Session encryption for NextAuth.js | When auth is implemented |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth login | When Google login is added |
| `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth login | When LinkedIn login is added |
| `REDIS_URL` | Redis cache connection | When caching is enabled |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | S3 file storage | When resume uploads go to S3 |
| `AWS_S3_BUCKET` / `AWS_S3_REGION` | S3 bucket config | Same as above |
| `SENDGRID_API_KEY` | Email sending | When email notifications are built |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Payments | When billing is added |
| `SENTRY_DSN` / `SENTRY_AUTH_TOKEN` | Error monitoring | When Sentry is configured |
| `GA4_MEASUREMENT_ID` | Google Analytics | When analytics is added |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps on contact page | When map widget is added |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` | Spam protection | When reCAPTCHA is enabled |
| `CRON_SECRET` | Vercel cron job auth | When cron jobs are secured |

---

## Quick Setup Checklist

```bash
# 1. Install GitHub CLI (if not already)
winget install GitHub.cli

# 2. Authenticate
gh auth login

# 3. Set required deployment secrets
gh secret set VERCEL_TOKEN           # Paste your Vercel token
gh secret set VERCEL_ORG_ID --body "team_LLH7S0MJTcyU6oTmXNwHCK7V"
gh secret set VERCEL_PROJECT_ID --body "prj_DxtRWbI09E2zLXLP6pcMWfVJpun3"

# 4. Set database URL (when database is provisioned)
gh secret set DATABASE_URL           # Paste your connection string

# 5. Set Vercel environment variables (for app runtime)
vercel env add ANTHROPIC_API_KEY production
vercel env add ANTHROPIC_API_KEY preview
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview

# 6. Verify secrets are set
gh secret list
```

---

## Environment Mapping

| Branch | Environment | Vercel Mode | URL |
|--------|------------|-------------|-----|
| `develop` | Staging | Preview | `jtld-consulting-platform.vercel.app` |
| `main` | Production | Production | `jtldinc.com` (when DNS pointed) |
| Feature PR | Preview | Preview | Dynamic URL (commented on PR) |
