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

**Backend:** localStorage (auth + data) + Anthropic Claude AI (optional — graceful fallback when key is absent)

All routes live under `app/` using file-based routing:
- `/` — Login
- `/signup` — Registration
- `/dashboard` — Main health dashboard with AI-powered health score
- `/log-meals` — Meal tracking with Manual Entry and AI Suggest tabs
- `/profile` — User profile (editable)
- `/settings` — App settings
- `/api/health-score` — Server-side API route; calls Claude AI (or returns computed fallback) for health score + recommendations
- `/api/meal-suggestions` — Server-side API route; takes ingredients + meal type, returns 3 meal suggestions with calorie counts (Claude AI or hardcoded fallback)

Every page is a client component (`'use client'`). API routes are server-side Next.js route handlers.

**State:** Local `useState` only. No global state (no Redux, Zustand, or Context API).

**Auth:** localStorage-based (not Firebase). All pages except `/` and `/signup` are protected — each page checks `onAuthStateChanged` from `lib/auth.ts` and redirects unauthenticated users to `/`.

**Path alias:** `@/*` maps to the project root.

## Project Structure

```
app/                    # Pages and API routes
components/
  BottomNav.tsx         # Shared bottom navigation bar (accepts `active` prop)
lib/
  auth.ts               # localStorage auth (signIn, signUp, signOut, onAuthStateChanged)
  storage.ts            # localStorage data layer (getUserProfile, saveUserProfile, getMealsByDate, addMeal)
  types.ts              # Shared TypeScript interfaces (Meal, UserProfile)
  constants.ts          # App-wide constants (e.g. DEFAULT_CALORIE_GOAL)
  validation.ts         # Input validation and sanitization functions
  firebase.ts           # Unused — Firebase was replaced with localStorage; safe to delete
```

## Data Layer

**localStorage schema:**
```
hsai_users                        → { [uid]: { uid, email, password, createdAt } }
hsai_session                      → { uid, email, createdAt } | null
hsai_profile_{uid}                → UserProfile fields (firstName, lastName, email, gender, age, height, weight, activityLevel, healthGoal, calorieGoal)
hsai_meals_{uid}                  → Meal[] (all meals across all dates for the user)
ai_cache_{uid}_{date}_{mealCount} → { healthScore, recommendations } (cached daily, pruned on new day)
```

**AI integration:** Both `/api/health-score` and `/api/meal-suggestions` check for `ANTHROPIC_API_KEY` at runtime. If missing, they return computed/hardcoded fallback data — the app is fully functional without a key. When a key is present, they call `claude-haiku-4-5`. AI responses must never include emojis — the prompt explicitly instructs this.

## UI Conventions

- Mobile-first layout, constrained to `max-w-sm` centered containers
- Shared `<BottomNav active="...">` component used on all authenticated pages; contained within `max-w-sm`, not full-width
- Inline SVG icons only — no icon library. Stroke-based (`fill="none"`), `strokeWidth={1.75}` standard
- **No emojis anywhere** — not in UI, not in fallback text, not in AI prompts or responses
- Tailwind v4 configured via `@import "tailwindcss"` in `globals.css` (not v3 `@tailwind` directives)

## Design System

**Font:** Plus Jakarta Sans (via `next/font/google`), applied globally through `layout.tsx` and `globals.css`

**Color palette:**
- Primary yellow: `#FDE68A` (amber-200) for backgrounds/selected states, `#FCD34D` (amber-300) for gradients, `#F59E0B` (amber-400) for accents/borders
- Primary green: `#86EFAC` (green-300) for success states and AI badge
- Text: `#111827` (gray-900) headings, `#374151` (gray-700) body, `#9CA3AF` (gray-400) secondary
- Danger: `#F43F5E` (rose-500) for errors/logout

**Backgrounds:**
- All pages use a warm off-white gradient: `background: linear-gradient(160deg, #FFFDF7 0%, #FFF6E6 100%)`
- Dashboard and Log Meals pages include 2–3 soft blurred blob shapes (absolute positioned, `opacity-[0.04–0.07]`, `filter: blur(50–60px)`) in amber and green

**Cards:**
- `bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] rounded-3xl`
- Frosted glass style throughout all authenticated pages

**Buttons:**
- Primary: `background: linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)` with `text-amber-900 font-bold rounded-full`
- Danger/logout: `border border-rose-200 text-rose-500 bg-white/60 rounded-full`

**Stat cards with faded background icons:**
- Health Score card: large faded heart SVG at `opacity-[0.12]` in bottom-right corner
- Calories card: large faded flame SVG at `opacity-[0.06]`
- AI Recommendations card: large faded lightbulb SVG at `opacity-[0.06]`; badge icon is a hollow 4-point bezier sparkle star

**Meal type icons (SVG, stroke-based):**
- Breakfast → sun (rays + circle)
- Lunch → bowl (horizontal line + arc)
- Dinner → crescent moon
- Snack → apple (oval body + stem + leaf curl)

**Meal type color coding (dashboard list badges):**
- Breakfast: `bg-amber-100 text-amber-600`
- Lunch: `bg-green-100 text-green-600`
- Dinner: `bg-sky-100 text-sky-600`
- Snack: `bg-emerald-100 text-emerald-600`

**Profile avatar:** Shows user's initials (first + last name initial) in the yellow gradient circle — not a generic person icon.

## Validation & Security

Input validation and sanitization is centralized in `lib/validation.ts`:
- `validateName()` — letters, spaces, hyphens, apostrophes (2–50 chars)
- `validateFoodName()` — alphanumeric + basic punctuation (max 100 chars)
- `validateNumber()` — range checks with min/max bounds
- `sanitizeText()` — strips HTML characters
- `sanitizeForPrompt()` — strips newlines and limits length before sending to AI

## Environment Variables

No environment variables are required to run the app. All data is stored in `localStorage`.

Optionally, add to `.env.local` to enable real AI features:
- `ANTHROPIC_API_KEY` — enables live health score generation and ingredient-based meal suggestions. Without it, both features fall back to computed/hardcoded responses.
