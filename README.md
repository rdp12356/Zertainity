# Zertainity - AI-Powered Career Guidance

This is the central codebase for **Zertainity**, an AI-driven platform built to help students navigate their educational options and find real-world careers that match their academic strengths.

## Features Currently Implemented

*   **Grade Level Detection**: Custom tailored flows for Primary (Classes 1-5), Middle (Classes 6-8), Secondary (Classes 9-10), and Senior Secondary (Classes 11-12) based on the CBSE 2025 structure.
*   **Subject Selection**: Dynamic subject selection interface including easy-select stream combinations (PCM, PCB, etc.) for high school students, plus custom "Other Subject" options for absolute flexibility.
*   **Strengths & Interest Engine**: Deep evaluation quizzes that prefer subjects chosen explicitly by the student, calculating real-world potential using rigorous weight algorithms.
*   **AI Pathfinding**: Recommends "Best Match" streams and specific careers with interactive progress bars mapping out the student's compatibility.
*   **Premium Dark Mode**: Seamless, system-independent Global Dark Mode with bespoke neon glow aesthetics, CSS variable theming, and smooth component transitions.

## Tech Stack
*   **Frontend Framework**: React + TypeScript + Vite
*   **Styling**: Tailwind CSS + shadcn/ui (Radix Primitives)
*   **State / Routing**: React Router DOM (v6) + TanStack Query
*   **Icons**: Lucide React
*   **Auth / Backend**: Supabase integration

## Setup Instructions

1.  Clone this repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## License
Copyright © 2026 Zertainity. All rights reserved.
