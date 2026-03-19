# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

**Stack:** Next.js (App Router) + React 19 + TypeScript + Tailwind CSS v4

**Backend:** Firebase (Authentication + Firestore) + Anthropic Claude AI

All routes live under `app/` using file-based routing:
- `/` — Login
- `/signup` — Registration
- `/dashboard` — Main health dashboard with AI-powered health score
- `/log-meals` — Meal tracking
- `/profile` — User profile (editable)
- `/settings` — App settings
- `/api/health-score` — Server-side API route; calls Claude AI to generate a health score and recommendations

Every page is a client component (`'use client'`). The one API route (`/api/health-score`) is a server-side Next.js route handler.

**State:** Local `useState` only. No global state (no Redux, Zustand, or Context API).

**Auth:** Firebase Authentication (email/password). All pages except `/` and `/signup` are protected — each page checks `onAuthStateChanged` and redirects unauthenticated users to `/`.

**Path alias:** `@/*` maps to the project root.

## Project Structure

```
app/                    # Pages and API routes
components/
  BottomNav.tsx         # Shared bottom navigation bar (accepts `active` prop)
lib/
  firebase.ts           # Firebase app, auth, and Firestore exports
  types.ts              # Shared TypeScript interfaces (Meal, UserProfile)
  constants.ts          # App-wide constants (e.g. DEFAULT_CALORIE_GOAL)
  validation.ts         # Input validation and sanitization functions
```

## Data Layer

**Firestore schema:**
```
users/{userId}
  firstName, lastName, email, gender, age, height, weight,
  activityLevel, healthGoal, calorieGoal, createdAt

users/{userId}/meals/{mealId}
  foodName, calories, time, mealType, date, createdAt
```

**AI integration:** The `/api/health-score` endpoint sends user profile and daily meal data to Claude (`claude-haiku-4-5`) and returns a score (0–100) with 3 personalized recommendations. Results are cached in `localStorage` per day to avoid redundant API calls.

## UI Conventions

- Mobile-first layout, constrained to `max-w-sm` centered containers
- Shared `<BottomNav active="...">` component used on all authenticated pages
- Inline SVG icons — no icon library
- Color palette: yellow-400 (primary/brand), green-400/500 (success), gray scale (neutral)
- Tailwind v4 is configured via `@import "tailwindcss"` in `globals.css` (not the v3 `@tailwind` directives)

## Validation & Security

Input validation and sanitization is centralized in `lib/validation.ts`:
- `validateName()` — letters, spaces, hyphens, apostrophes (2–50 chars)
- `validateFoodName()` — alphanumeric + basic punctuation (max 100 chars)
- `validateNumber()` — range checks with min/max bounds
- `sanitizeText()` — strips HTML characters
- `sanitizeForPrompt()` — strips newlines and limits length before sending to AI

## Environment Variables

The app requires the following environment variables (set in `.env.local`, not committed):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `ANTHROPIC_API_KEY`
