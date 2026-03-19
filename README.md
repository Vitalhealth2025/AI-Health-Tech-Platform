# HealthSmartAI

An AI-driven personalized nutrition and wellness platform that helps users 
track their meals, monitor health metrics, and receive intelligent dietary 
recommendations.

🔗 Live Demo: https://your-vercel-url.vercel.app

## About
HealthSmartAI is built as part of an AI HealthTech group project. The platform 
allows users to log meals, track calorie intake, manage their health profile, 
and receive AI-generated health scores and personalized nutrition recommendations 
powered by Claude AI.

## Features
- 🔐 Secure authentication (Sign Up / Login)
- 👤 Personalized health profile management
- 🍽️ Daily meal logging with calorie tracking
- 📊 Real-time calorie progress toward custom goals
- 🤖 AI-powered health score calculated daily
- 💡 Personalized nutrition recommendations via Claude AI
- ⚙️ App settings and preferences
- 📱 Mobile-first responsive design

## Pages
- **Login** — Secure user authentication
- **Sign Up** — New account creation
- **Dashboard** — Health score, calorie tracking, AI recommendations and recent meals
- **Log Meals** — Track daily food intake by meal type
- **Profile** — View and edit personal health information and goals
- **Settings** — App preferences, security and support

## Tech Stack
- [Next.js 14](https://nextjs.org/) — Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Firebase](https://firebase.google.com/) — Authentication and Firestore database
- [Anthropic Claude AI](https://anthropic.com/) — Health score and recommendations
- [Vercel](https://vercel.com/) — Deployment

## Getting Started

Clone the repo and install dependencies:
```bash
git clone https://github.com/yourusername/AI-Health-Tech-Platform.git
cd AI-Health-Tech-Platform
npm install
```

Set up environment variables by creating a `.env.local` file:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
NEXT_PUBLIC_FIREBASE_APP_ID=your_value
ANTHROPIC_API_KEY=your_value
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Status
✅ UI prototype complete  
✅ Firebase authentication connected  
✅ Firestore database integrated  
✅ Claude AI health score and recommendations live  
⏳ Wearable device integration (planned)  
⏳ Advanced analytics and reporting (planned)  

## Team
Built as part of an AI HealthTech group project.
