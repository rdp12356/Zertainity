# Zertainity - AI-Powered Career Guidance Platform

This is the central codebase for **Zertainity**, an AI-driven educational technology platform built to help students navigate their options and discover real-world careers that match their academic strengths.

## 🚀 Features Currently Implemented

* **Dynamic Education Paths**: Custom tailored workflows based on education stage—Primary (Classes 1-5), Middle (Classes 6-8), Secondary (Classes 9-10), and Senior Secondary (Classes 11-12) based on the CBSE 2025 structure.
* **Subject & Marks Entry Selection**: Intuitive interfaces for selecting streams (PCM, PCB, Commerce, Arts) or custom subjects, paired with detailed academic performance entry.
* **Strengths & Interest Engine**: Deep evaluation quizzes that prefer subjects chosen explicitly by the student, calculating real-world potential using rigorous weighted algorithms.
* **AI Pathfinding & Career Insights**: Recommends "Best Match" streams and specific careers with interactive progress bars mapping out the student's compatibility.
* **User Authentication & Profiles**: Complete sign-up, login, and robust user settings managed through Supabase Auth.
* **Admin Dashboard**: Specialized tools for verifying metrics and managing pathways.
* **Premium Dark Mode**: Seamless, system-independent Global Dark Mode with bespoke neon glow aesthetics, CSS variable theming, and smooth component transitions.

## 💻 Tech Stack

* **Frontend Framework**: React + TypeScript + Vite
* **Styling**: Tailwind CSS + shadcn/ui (Radix Primitives)
* **State / Routing**: React Router DOM (v6) + TanStack Query
* **Icons & UI Extras**: Lucide React + Embla Carousel
* **Backend / Database Shell**: Supabase integration (@supabase/supabase-js)

## 🛠 Setup Instructions

1. Clone this repository.
   ```bash
   git clone https://github.com/rdp12356/zertainity.git
   cd zertainity
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables by copying the example file and adding your Supabase credentials.
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The application will launch on `http://localhost:5173`.

## 🌐 Live Demo

The app is deployed to GitHub Pages and accessible at:

**<https://rdp12356.github.io/zertainity/>**

It is automatically rebuilt and redeployed on every push to `main` via the [GitHub Actions workflow](.github/workflows/deploy.yml).

### How it works

| Step | Detail |
|------|--------|
| Build tool | Vite – outputs static files to `dist/` |
| Base path | `/zertainity/` (set at build time; local dev still uses `/`) |
| Deployment | `actions/deploy-pages` uploads `dist/` to GitHub Pages |
| SPA routing | `dist/404.html` is a copy of `index.html` so React Router routes survive a hard refresh |

To enable Pages in a fork: **Settings → Pages → Source → GitHub Actions**.

## 📄 License

Copyright © 2026 Zertainity. All rights reserved.
