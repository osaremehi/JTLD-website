# JTLD Consulting Inc — Full Stack Platform

Corporate website and admin platform for JTLD Consulting Inc, an IT strategy and management consulting firm operating across North America and Africa.

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, React Router
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth
- **Hosting:** Frontend on Vercel, Backend on Render (free tier)

## Project Structure

```
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI + layout + feature components
│   │   ├── pages/       # Route page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # API client, Supabase client, utilities
│   │   └── types/       # TypeScript type definitions
│   └── ...config files
├── server/              # Express API backend
│   ├── src/
│   │   ├── routes/      # API route handlers (contact, blog, admin)
│   │   ├── middleware/  # Auth, validation middleware
│   │   ├── lib/         # Supabase client
│   │   └── types/       # Zod schemas + TypeScript types
│   └── ...config files
├── supabase/
│   └── migrations/      # SQL migration files
├── index.html           # Static fallback site
└── .env.example         # Environment variable template
```

## Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/osaremehi/jtld-consulting-platform.git
   cd jtld-consulting-platform
   ```

2. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run `supabase/migrations/001_initial_schema.sql`
   - Go to Settings → API and copy your keys

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Fill in your Supabase URL and keys
   ```

4. **Install and run the backend**
   ```bash
   cd server
   npm install
   npm run dev          # runs on http://localhost:3001
   ```

5. **Install and run the frontend** (in a separate terminal)
   ```bash
   cd client
   npm install
   npm run dev          # runs on http://localhost:5173
   ```

6. **Create your first admin user**
   - In Supabase Dashboard → Authentication → Users → Add User
   - Then in SQL Editor, insert an admin profile:
     ```sql
     INSERT INTO admin_profiles (id, display_name, role)
     VALUES ('your-user-uuid', 'Josh', 'super_admin');
     ```
   - Log in at `http://localhost:5173/login`

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/contacts` | Public | Submit contact form |
| GET | `/api/contacts` | Admin | List submissions (paginated) |
| GET | `/api/contacts/:id` | Admin | Get single submission |
| PATCH | `/api/contacts/:id/status` | Admin | Update submission status |
| GET | `/api/blog` | Public | List published posts (paginated) |
| GET | `/api/blog/:slug` | Public | Get single post by slug |
| POST | `/api/blog` | Admin | Create blog post |
| PATCH | `/api/blog/:id` | Admin | Update blog post |
| DELETE | `/api/blog/:id` | Admin | Delete blog post |
| GET | `/api/admin/dashboard` | Admin | Dashboard statistics |
| GET | `/api/admin/blog` | Admin | List all posts (incl. drafts) |
| GET | `/api/admin/analytics` | Admin | Page view analytics |
| GET | `/api/health` | Public | Health check |

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `client`
4. Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`
5. Deploy

### Backend (Render)
1. Create a new Web Service on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set root directory to `server`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CLIENT_URL`, `PORT`

## License

Proprietary — JTLD Consulting Inc. All rights reserved.
