# Supertest - Playtesting platform for game developers.

<p align="center">
  <a href="package.json"><img src="https://img.shields.io/badge/version-0.1.0-white?style=for-the-badge" alt="Version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="MIT License"></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge" alt="Next.js 16"></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge" alt="Supabase"></a>
</p>

**Supertest** is an open-source playtesting platform. Upload your game, play each other's builds, leave structured feedback. Ratings, bug reports, video evidence, custom questions, AI summaries, leaderboard. Built by [@ijtihedk](https://github.com/Ijtihed).

> **The deployed instance is for the Supercell AI Lab cohort only.** Sign in with Google, enter your Supercell email, DM **@ijtihedk** on Slack to get approved.
>
> **The code is MIT licensed.** Fork it, deploy your own instance, swap the branding, use it for your own team/studio/class/jam. Everything is configurable - cohorts, questions, admin system, i18n. No Supercell-specific code baked in.

---

## What it does

| You want to... | Supertest does... |
|---|---|
| Share your game | Paste an itch.io / Google Drive link, add description + cover image |
| Get feedback | 15 preset tester questions + custom questions you define |
| See results | Ratings breakdown, bug reports, video links, AI summary, CSV export |
| Find games to test | Browse page with genre/platform filters |
| Track engagement | Review points system - +10 per review, leaderboard |
| Control access | Public dashboard or private invite link per game |
| Admin | Approve/reject users, bulk approve, search by name/email |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase PostgreSQL + Row Level Security |
| Storage | Supabase Storage (cover images only, 5MB limit) |
| Styling | Tailwind CSS v4, Monolith Protocol design system |
| i18n | English / 日本語 (client-side, localStorage) |
| Testing | Vitest + React Testing Library (26 tests) |
| CI | GitHub Actions (lint, typecheck, test, build) |

---

## Routes

20 routes total.

| Route | Access | What it does |
|---|---|---|
| `/` | Public | Landing page |
| `/security` | Public | Security & privacy breakdown |
| `/onboarding` | Auth | Cohort + Supercell email setup |
| `/pending` | Auth | Waiting for admin approval |
| `/rejected` | Auth | Account not approved |
| `/dashboard` | Approved | Your games + reviews + points |
| `/games` | Approved | Browse all public games |
| `/games/new` | Approved | Create a new game |
| `/games/[id]` | Approved | Game detail - ratings, description, download |
| `/games/[id]/edit` | Owner | Edit game after publishing |
| `/games/[id]/feedback` | Approved | Submit structured feedback |
| `/games/[id]/results` | Owner | Feedback dashboard + AI summary + CSV export |
| `/leaderboard` | Approved | Top 50 reviewers by points |
| `/profile/[id]` | Approved | User profile - games, reviews, stats |
| `/admin` | Admin | Approve/reject users, bulk approve, search |
| `/settings` | Approved | Cohort, language, account |
| `/invite/[code]` | Approved | Private invite link resolver |

---

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/Ijtihed/supertest.git
cd supertest
npm install

# 2. Configure
cp .env.local.example .env.local
# Fill in your Supabase URL + anon key

# 3. Database setup - run these in Supabase SQL editor:
#    supabase/schema.sql        (base tables)
#    supabase/add_cohort.sql    (cohort column)
#    supabase/add_admin_and_points.sql  (admin + points system)

# 4. Enable Google Auth
#    Supabase → Authentication → Providers → Google
#    Set redirect URL to http://localhost:3000/auth/callback

# 5. Make yourself admin (replace YOUR_USER_ID_HERE)
#    UPDATE public.profiles SET status = 'approved', is_admin = true WHERE id = 'YOUR_USER_ID_HERE';

# 6. Run
npm run dev
```

---

## Features

### Feedback System

Every game gets a structured feedback form with:
- Overall rating (1-5)
- Gameplay, visuals, fun factor ratings
- Bug reports (free text)
- Play-again probability (yes / maybe / no)
- Video evidence links (YouTube, Loom)
- 15 preset tester questions (controls, difficulty, crashes, audio, UI, pacing...)
- Custom questions defined by the game owner
- Free text area

Reviewers earn **+10 points** per review. Points show on the leaderboard.

### Results Dashboard

Game owners see:
- Stats row - response count, average rating, average fun, play-again %
- **AI summary** - one-click analysis of all feedback (runs locally, no API key)
- Custom question bar charts
- Verbatim feedback logs with relative timestamps
- **CSV export** - download all feedback as a spreadsheet

### Admin System

- Users sign up → enter Supercell email → wait for approval
- Admin panel: approve/reject individual users or **bulk approve all**
- Search users by name or email
- Only admins see the admin nav item

### Game Management

- Create games with external links (itch.io, Google Drive) or web game URLs
- Cover image upload (5MB max, PNG/JPG/WEBP only)
- 28 genre tags, 6 platform options
- Public dashboard or private invite link
- **Disable builds** - optionally redirect to a successor build
- **Re-enable builds** - bring disabled games back
- Edit everything after publishing

### i18n

Full English / Japanese translation across every page. Toggle in the topnav. Persists in localStorage.

---

## Project Structure

```
src/
├── app/                      # 20 Next.js routes
│   ├── admin/                # Admin panel
│   ├── auth/                 # OAuth callback + sign out
│   ├── dashboard/            # Dashboard + loading skeleton
│   ├── games/                # Browse, detail, edit, feedback, results, new
│   ├── leaderboard/          # Review points leaderboard
│   ├── onboarding/           # Cohort + email setup
│   ├── pending/              # Awaiting approval
│   ├── profile/              # User profiles
│   ├── security/             # Security page
│   └── settings/             # User settings
├── components/
│   ├── admin/                # Admin content
│   ├── auth/                 # Sign-in button
│   ├── dashboard/            # Dashboard content
│   ├── feedback/             # Feedback form + results
│   ├── games/                # Cards, browse, detail, forms
│   ├── layout/               # Sidebar, topnav, footer, app shell
│   ├── leaderboard/          # Leaderboard content
│   ├── onboarding/           # Cohort selector, email step
│   ├── profile/              # Profile page content
│   ├── settings/             # Settings content
│   └── ui/                   # Toast, markdown renderer
├── lib/
│   ├── actions/              # Server actions (auth)
│   ├── auth/                 # requireProfile, requireAdmin
│   ├── i18n/                 # Translations (EN/JA) + context
│   ├── supabase/             # Client, server, middleware
│   ├── toast/                # Toast notification context
│   ├── types/                # Database types
│   └── utils/                # AI summarizer, relative time
├── __tests__/                # 26 tests across 6 suites
└── middleware.ts              # Supabase session refresh
```

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run test` | Tests (watch mode) |
| `npm run test:run` | Tests (single run) |
| `npm run lint` | ESLint |

---

## Security

Full breakdown at [`/security`](src/app/security/page.tsx). Summary:

- **Auth**: Google OAuth via Supabase, HTTP-only session cookies
- **Database**: Row Level Security on every table - users can only read/write what they're allowed to
- **SQL injection**: Impossible - all queries use Supabase client parameterized API, zero raw SQL
- **Uploads**: Cover images only (PNG/JPG/WEBP, 5MB max). No game file uploads. Two-layer size check (client + pre-upload)
- **Admin gate**: All routes require approved status. Pending users see a waiting screen.
- **No secrets in code**: env vars only, `.env.local` gitignored

What's NOT covered: no E2E encryption, no rate limiting beyond Supabase defaults, no pen testing, storage bucket is public (URLs are unguessable but not private).

---

## Design System

**The Monolith Protocol** - dark-mode only, monochrome, brutalist.

- Background `#131313` / Surfaces `#0E0E0E` → `#393939`
- Text `#e8e8e8` primary / `#d0d0d0` secondary / `#525252` muted
- Fonts: Space Grotesk (headlines), Inter (body), Geist Mono (labels/data)
- No shadows, no gradients, no rounded corners > 4px
- Root font size: 18px

---

## License

MIT - do whatever you want with it.
