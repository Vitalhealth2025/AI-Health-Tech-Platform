# HealthSmart AI

An AI-powered personal health companion that helps users track meals, monitor calorie intake, and receive intelligent health recommendations — built as a school group project.

---

## Getting Started

No accounts, API keys, or environment variables are required. The app runs entirely locally.

```bash
git clone https://github.com/yourusername/healthsmartai.git
cd healthsmartai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and create an account to get started.

---

## Optional: Enable Live AI Features

The app works fully without an API key using built-in fallback responses. To enable real AI-generated health scores and meal suggestions, create a `.env.local` file in the project root:

```
ANTHROPIC_API_KEY=your_key_here
```

---

## Features

- User authentication — sign up and log in, all stored locally
- Personalized health profile — age, height, weight, activity level, health goal
- Daily meal logging — manual entry by meal type with calorie tracking
- AI Suggest — enter ingredients and get 3 meal ideas with calorie estimates
- Calorie progress — visual progress bar against a custom daily goal
- AI health score — daily score (0–100) with 3 personalized recommendations
- Mobile-first design — optimized for phone-sized screens

---

## Pages

| Route | Description |
|---|---|
| `/` | Login |
| `/signup` | Create account |
| `/dashboard` | Health score, calorie summary, AI recommendations, recent meals |
| `/log-meals` | Log food manually or use AI Suggest |
| `/profile` | View and edit health profile |
| `/settings` | App preferences |

---

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) — framework
- [React 19](https://react.dev/) — UI
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — typography
- [Anthropic Claude](https://anthropic.com/) (`claude-haiku-4-5`) — AI features (optional)
- localStorage — all auth and data storage, no database required

---

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

---

## Notes

- All data is stored in the browser's localStorage — clearing browser data will reset the app
- Each team member runs their own local instance; accounts are not shared between devices
- The app has no backend server, no database, and no deployment — it is local only
