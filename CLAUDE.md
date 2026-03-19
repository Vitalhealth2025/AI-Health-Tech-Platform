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

All routes live under `app/` using file-based routing:
- `/` — Login
- `/signup` — Registration
- `/dashboard` — Main health dashboard
- `/log-meals` — Meal tracking
- `/profile` — User profile (editable)
- `/settings` — App settings

Every page is a client component (`'use client'`). There are no API routes, no server components, and no backend integration yet — all data is hardcoded mock data in each page component.

**State:** Local `useState` only. No global state (no Redux, Zustand, or Context API).

**Path alias:** `@/*` maps to the project root.

## UI Conventions

- Mobile-first layout, constrained to `max-w-sm` centered containers
- Bottom navigation bar is duplicated inline in each page (no shared component yet)
- Inline SVG icons — no icon library
- Color palette: yellow-400 (primary/brand), green-400/500 (success), gray scale (neutral)
- Tailwind v4 is configured via `@import "tailwindcss"` in `globals.css` (not the v3 `@tailwind` directives)

## Current State

The `components/` directory is empty — reusable components have not been extracted yet. The bottom nav, icon patterns, and card layouts are candidates for componentization when needed.
