# JTLD Consulting Platform — Review & Test Sheet

> **Version:** 1.0.0
> **Stack:** React 19 + Vite · TypeScript 5 · Tailwind CSS 3 · Express 5 · Supabase
> **Updated:** May 8, 2026
> **Live:** https://jtldinc.com

---

## Table of Contents

1. [Global Components](#1-global-components)
2. [Homepage](#2-homepage)
3. [Services Page](#3-services-page)
4. [About Page](#4-about-page)
5. [Industries Page](#5-industries-page)
6. [Careers — Public](#6-careers--public)
7. [Careers — Signup](#7-careers--signup)
8. [Careers — Login](#8-careers--login)
9. [Careers — Profile](#9-careers--profile)
10. [Blog Listing](#10-blog-listing)
11. [Blog Post](#11-blog-post)
12. [Admin Login](#12-admin-login)
13. [Admin Dashboard](#13-admin-dashboard)
14. [Admin Inquiries](#14-admin-inquiries)
15. [Admin Blog Editor](#15-admin-blog-editor)
16. [API Endpoints](#16-api-endpoints)
17. [Dark Mode](#17-dark-mode)
18. [Cross-Cutting Concerns](#18-cross-cutting-concerns)

---

## 1. Global Components

### 1.1 Navbar (`client/src/components/layout/Navbar.tsx`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Utility bar visible on desktop | Slim bar above main nav with Locations, region selector, Search | | |
| Region selector opens modal | Click globe icon → modal with 6 JTLD markets | | |
| Region selection updates display | Selected region shows in utility bar | | |
| Utility bar hidden on mobile | Not visible below md breakpoint | | |
| Logo renders and links to `/` | JTLD logo navigates home | | |
| "What We Do" mega-menu on hover | Dark navy panel with 3 columns | | |
| "Industries" mega-menu on hover | Dark navy panel with 3 columns | | |
| "Careers" mega-menu on hover | Dark navy panel: Opportunities + Candidate Portal | | |
| "Who We Are" mega-menu on hover | Dark navy panel: Our Story + Technology Partnerships | | |
| "Blog" link navigates to `/blog` | Direct link, no dropdown | | |
| Active tab highlighted | Hovered tab shows navy background | | |
| Mega-menu closes on mouse leave | Panel disappears after 120ms | | |
| Mega-menu links use React Router `<Link>` | No full page reload on click | | |
| "Contact Us" CTA links to `/#contact` | Scrolls to contact section on homepage | | |
| ThemeToggle renders in desktop nav | Sun/moon icon visible | | |
| Mobile hamburger shows below md | Menu icon appears | | |
| Mobile menu expands on click | Accordion panels with dark navy | | |
| Mobile nav closes on link click | Menu dismisses | | |
| Navbar is `position: fixed` | Stays at top while scrolling | | |
| Shadow appears on scroll | `shadow-md` after 20px scroll | | |

### 1.2 Footer (`client/src/components/layout/Footer.tsx`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Logo renders | JTLD logo in footer | | |
| Nav links present | Services, About, Industries, Careers, Blog | | |
| Contact info visible | Email and/or phone | | |
| Copyright year | 2026 | | |
| Dark mode styled | Correct dark bg | | |

### 1.3 Theme Toggle

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Default theme is light | Page loads without dark class | | |
| Toggle switches to dark | Dark class applied to `<html>` | | |
| Toggle switches back to light | Dark class removed | | |
| Preference persists on reload | `localStorage('jtld-theme')` read on init | | |
| Icon reflects current mode | Moon = currently light, Sun = currently dark | | |

---

## 2. Homepage (`/`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Hero section renders | Headline + CTA buttons + stats grid | | |
| Stats bar shows 4 items | Calendar, Users, MapPin, Award icons with numbers | | |
| "Start a Conversation" links to `/#contact` | Scrolls to contact form | | |
| "Explore Services" links to `/services` | Navigates to services page | | |
| TechPartners section renders | Microsoft, AWS, Google Cloud, Salesforce, ServiceNow, Oracle | | |
| Contact form renders | Name, email, company, message fields | | |
| Contact form submits | POST to Express API → success message | | |
| CTA Banner renders | Dark CTA section at bottom | | |
| Page offset from navbar | Content starts below 100px navbar | | |

---

## 3. Services Page (`/services`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Page header renders | Eyebrow, headline, subtitle | | |
| 3 service cards render | IT Strategy, Project Management, Software Development | | |
| Service cards show bullet lists | 4 items per card | | |
| WhyUs section renders | Dark navy bg with 4 reason cards | | |
| CTA Banner at bottom | | | |
| Direct URL navigation works | `/services` doesn't 404 | | |

---

## 4. About Page (`/about`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Page header renders | "Who We Are" eyebrow | | |
| About section renders | 2-column: image placeholder + text | | |
| 4 value chips visible | Strategic Advisory, Delivery Excellence, etc. | | |
| CTA Banner at bottom | | | |
| Direct URL navigation works | `/about` doesn't 404 | | |

---

## 5. Industries Page (`/industries`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Page header renders | "Industries" eyebrow | | |
| 4 industry cards render | Government, Financial, Energy, Healthcare | | |
| Industry icons render | Landmark, Banknote, Droplets, HeartPulse | | |
| CTA Banner at bottom | | | |
| Direct URL navigation works | `/industries` doesn't 404 | | |

---

## 6. Careers — Public (`/careers`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Hero section renders | Dark navy gradient, headline, CTA buttons | | |
| "Create Your Profile" links to `/careers/signup` | | | |
| "Sign In" links to `/careers/login` | | | |
| Why JTLD section | 4 cards: Cross-Border, Senior-Led, Outcome, Proven | | |
| Job listings render | 6 open positions in card/row layout | | |
| Each job shows title, type, location, dept badge | | | |
| "Apply Now" buttons link to `/careers/signup` | | | |
| Direct URL navigation works | `/careers` doesn't 404 | | |

---

## 7. Careers — Signup (`/careers/signup`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Form renders all fields | Full Name, Email, Phone, Location, Password, Confirm | | |
| Optional fields labeled | Phone and Location marked optional | | |
| Password mismatch shows error | "Passwords do not match" | | |
| Short password shows error | "Must be at least 8 characters" | | |
| Valid signup creates Supabase user | Auth user created | | |
| Valid signup creates candidates row | Row in candidates table | | |
| Redirect to `/careers/profile` on success | | | |
| Supabase error shown inline | e.g., "User already registered" | | |
| "Sign in" link goes to `/careers/login` | | | |
| "Back to Careers" link goes to `/careers` | | | |

---

## 8. Careers — Login (`/careers/login`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Email + password fields render | | | |
| Wrong credentials show error | "Invalid login credentials" | | |
| Valid login redirects to `/careers/profile` | | | |
| "Create profile" link goes to `/careers/signup` | | | |
| "Back to Careers" link goes to `/careers` | | | |

---

## 9. Careers — Profile (`/careers/profile`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Unauthenticated redirect to `/careers/login` | | | |
| Profile loads with candidate data | Name, email pre-filled | | |
| Email field is disabled | Cannot change email | | |
| Save profile updates candidates row | Changes persist after reload | | |
| Save shows success toast | Green toast for 4 seconds | | |
| Error shows error toast | Red toast | | |
| Resumes tab renders upload box | Dashed border, Upload icon | | |
| File input accepts PDF, DOC, DOCX only | Non-matching files rejected | | |
| File > 10MB shows error toast | "File must be under 10MB" | | |
| Valid upload appears in list | File name, size, date shown | | |
| Download button generates signed URL | Opens file in new tab | | |
| Delete button removes file + metadata | Row removed from list | | |
| Sign Out button logs out | Redirects to `/careers` | | |
| Logo links to `/careers` | | | |

---

## 10. Blog Listing (`/blog`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Published posts listed | Cards with title, excerpt, date | | |
| Empty state handled | Friendly message when no posts | | |
| Pagination renders if >10 posts | Prev/next buttons | | |
| Post cards link to `/blog/:slug` | | | |
| Direct URL navigation works | `/blog` doesn't 404 | | |

---

## 11. Blog Post (`/blog/:slug`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Post loads by slug | Correct post shown | | |
| Invalid slug shows 404 state | "Post Not Found" with back link | | |
| Back to Blog link works | | | |
| Body renders HTML | Rich text content | | |

---

## 12. Admin Login (`/login`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Login form renders | Email + password | | |
| Wrong credentials show error | "Invalid credentials" | | |
| Valid admin login redirects to `/admin` | | | |
| Non-admin Supabase user is rejected | 403 or redirect back to login | | |
| Back to website link works | | | |

---

## 13. Admin Dashboard (`/admin`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Unauthenticated redirect to `/login` | | | |
| Stat cards render | Contacts total, unread, posts, page views | | |
| Admin sidebar renders | Dashboard, Inquiries, Blog links | | |
| Sign out works | Clears session, redirects | | |

---

## 14. Admin Inquiries (`/admin/inquiries`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Contact submissions listed | Table with name, email, date, status | | |
| Status badge color-coded | New=blue, Read=gray, Replied=green | | |
| Click submission shows detail | Message expanded | | |
| Status can be updated | Dropdown or button changes status | | |
| PATCH request succeeds | 200 response, UI updates | | |

---

## 15. Admin Blog Editor (`/admin/blog`)

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Post list renders | All posts including drafts | | |
| Empty state shows FileText icon | No crash when list is empty | | |
| "New Post" button opens editor | | | |
| Title, slug, excerpt, body, status fields render | | | |
| Slug auto-generates from title | | | |
| Save draft saves with status=draft | | | |
| Publish saves with status=published | Published posts appear on `/blog` | | |
| Edit existing post loads data | | | |
| Delete post removes from list | | | |

---

## 16. API Endpoints

| Endpoint | Test | Expected | Pass/Fail |
|----------|------|----------|-----------|
| `GET /api/health` | curl | `{ status: "ok" }` | |
| `POST /api/contacts` (valid) | curl with body | 201 + `{ data: submission }` | |
| `POST /api/contacts` (invalid) | missing fields | 422 + validation errors | |
| `POST /api/contacts` (rate limit) | 6th request in 1hr | 429 response | |
| `GET /api/contacts` (no auth) | curl without token | 401 Unauthorized | |
| `GET /api/contacts` (admin token) | curl with Bearer token | 200 + list | |
| `GET /api/blog` | curl | 200 + published posts | |
| `GET /api/blog/invalid-slug` | curl | 404 | |
| `POST /api/blog` (no auth) | curl | 401 | |
| `GET /api/admin/dashboard` (admin) | curl | 200 + stats | |

---

## 17. Dark Mode

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| Default is light | No dark class on `<html>` | | |
| Toggle adds dark class | `document.documentElement.classList.contains('dark')` | | |
| Navbar dark styles apply | `dark:bg-navy-950` background | | |
| Cards dark styles apply | `dark:bg-navy-800` backgrounds | | |
| Text dark styles apply | `dark:text-white` / `dark:text-gray-300` | | |
| Gold accents in dark mode | ThemeToggle and CTA show gold | | |
| Mega-menu always dark | Navy-950 regardless of theme | | |
| Preference survives reload | `localStorage` read on mount | | |

---

## 18. Cross-Cutting Concerns

| Item | Expected | Pass/Fail | Notes |
|------|----------|-----------|-------|
| All pages offset by 100px | `pt-[100px]` clears fixed navbar | | |
| SPA routing — no 404 on refresh | `vercel.json` rewrite handles all paths | | |
| React Router `<Link>` for internal nav | No full page reloads | | |
| CORS — frontend can call API | No CORS errors in console | | |
| API rate limiter — POST /contacts | 5 per hour per IP | | |
| Mobile responsive — all pages | No horizontal overflow at 375px | | |
| Images / icons load | No broken lucide icons | | |
| TypeScript compiles cleanly | No `tsc` errors in client or server | | |
| `import.meta.env` works | `vite-env.d.ts` reference included | | |
| Render cold start acceptable | First request < 60s after idle | | |
| Supabase connection healthy | No connection errors in Render logs | | |
