# Supertest

Supertest is a playtesting platform for indie game developers. Upload your game, share it with testers, and collect structured feedback — ratings, bug reports, video evidence, and free-form notes — all in one place.

Built with the **Monolith Protocol** design system: dark-mode only, brutalist, terminal-inspired. Supports English and Japanese.

## Features

- **Google login** via Supabase Auth — one click, you're in
- **Cohort onboarding** — users pick Helsinki, San Francisco, or Tokyo on first login
- **Game uploads** — file uploads, external links (itch.io, Steam), or web game URLs
- **28 genre tags** — Action, RPG, Roguelike, Souls-like, Visual Novel, Battle Royale, and more
- **Public or private** — public dashboard for open testing, private invite links for closed testing
- **Structured feedback form** — overall rating, gameplay/visuals/fun ratings, bug reports, play-again probability, video links, free text
- **15 preset tester questions** — pre-populated when you create a game (controls, difficulty, crashes, audio, UI, pacing, etc.) — delete what you don't need, add your own
- **Results dashboard** — stats overview, AI summary (local browser LLM), bar charts for custom questions, verbatim feedback logs
- **i18n** — full English/Japanese translation across every page, toggleable from the topnav
- **CI/CD** — GitHub Actions pipeline (lint, typecheck, test, build)
- **25 tests** across 6 test suites (Vitest + React Testing Library)

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16, App Router, TypeScript |
| Styling | Tailwind CSS v4, custom design tokens |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase PostgreSQL + Row Level Security |
| Storage | Supabase Storage (game files, cover images) |
| i18n | Custom React context (EN/JA) |
| Testing | Vitest + React Testing Library |
| CI | GitHub Actions |

## Quick Start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.local.example .env.local
# Fill in your Supabase URL + anon key

# 3. Set up database
# Paste supabase/schema.sql into your Supabase SQL editor and run it
# Then paste supabase/add_cohort.sql and run it

# 4. Enable Google Auth in Supabase dashboard
# Authentication > Providers > Google
# Set redirect URL to http://localhost:3000/auth/callback

# 5. Run
npm run dev
```

## Routes

| Route | Access | What it does |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/onboarding` | Auth | Cohort selection (first login) |
| `/dashboard` | Auth | Your games + your reviews |
| `/games` | Auth | Browse all public games |
| `/games/new` | Auth | Create a new game |
| `/games/[id]` | Auth | Game detail page |
| `/games/[id]/feedback` | Auth | Submit feedback |
| `/games/[id]/results` | Auth (owner) | View feedback results + AI summary |
| `/settings` | Auth | Profile, cohort, language |
| `/invite/[code]` | Auth | Private invite link resolver |

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run test` | Tests (watch mode) |
| `npm run test:run` | Tests (single run) |
| `npm run lint` | ESLint |

## Project Structure

```
src/
├── app/                     # Pages (App Router)
│   ├── page.tsx             # Landing
│   ├── onboarding/          # Cohort selection
│   ├── dashboard/           # Dashboard + loading skeleton
│   ├── games/               # Browse, detail, feedback, results, new
│   ├── settings/            # User settings
│   ├── invite/              # Private invite resolver
│   └── auth/                # OAuth callback + sign out
├── components/
│   ├── auth/                # Sign-in button
│   ├── dashboard/           # Dashboard content
│   ├── feedback/            # Feedback form + results view
│   ├── games/               # Game card, browse, detail, new form
│   ├── layout/              # Sidebar, topnav, footer, app shell
│   ├── onboarding/          # Cohort selector
│   └── settings/            # Settings content
├── lib/
│   ├── actions/             # Server actions (auth)
│   ├── auth/                # requireProfile helper
│   ├── i18n/                # Translations + context
│   ├── supabase/            # Client, server, middleware
│   └── types/               # Database types
└── __tests__/               # Test suites
```

## Design System

Dark-mode only. Monochrome. No shadows, no gradients, no rounded corners > 4px.

- **Background:** `#131313` / **Surfaces:** `#0E0E0E` to `#393939`
- **Text:** `#e8e8e8` primary / `#d0d0d0` secondary / `#525252` muted
- **Fonts:** Space Grotesk (headlines), Inter (body), Geist Mono (labels/data)
- **Root font size:** 18px
