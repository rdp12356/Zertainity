# AGENTS.md — guidance for AI coding agents

This file orients automated assistants working in the **Zertainity** repository: a student career-guidance web app (React, TypeScript, Vite). Human-oriented process and standards live in [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Project map

| Area | Path |
|------|------|
| App entry, router | `src/App.tsx`, `src/main.tsx` |
| Pages (routes) | `src/pages/` |
| Shared UI | `src/components/` (includes shadcn-style primitives under `ui/`) |
| Hooks | `src/hooks/` |
| Supabase client & generated types | `src/integrations/supabase/` |
| Edge functions / SQL helpers | `supabase/` |

Imports use the `@/` alias to `src/` (see `tsconfig.app.json`).

## Commands

```bash
npm install          # dependencies
npm run dev          # Vite dev server (default http://localhost:5173)
npm run build        # production build
npm run lint         # ESLint — should pass before finishing a task
npm test             # Jest — pass `-- <path>` for a single file (see package.json)
```

Prefer running **lint** (and **tests** when behaviour changes) before concluding work.

## Conventions

- **Language**: TypeScript; match existing patterns (functional components, hooks).
- **UI**: Tailwind utility classes and existing Radix/shadcn components; keep spacing, typography, and dark/light behaviour consistent with nearby code.
- **Routing**: React Router v6; new screens usually get a route in `App.tsx` and a component under `src/pages/`.
- **Data**: Supabase JS client from `@/integrations/supabase/client`; respect Row Level Security — never ship **service role** keys to the browser. Use env-prefixed **publishable** URL/key only (`VITE_*` as defined for this project).
- **Scope**: Change only what the task requires; avoid drive-by refactors and unrelated files. Do not add secrets, real API keys, or personal machine paths (`file:///...`) to the repo.

## Security & privacy

- Treat `.env` as local-only; never commit credentials.
- User-facing copy and legal pages should not embed private paths or internal tooling URLs in committed docs.
- For admin or role-gated features, keep checks aligned with how the app already verifies sessions/roles (see existing admin and permission patterns).

## When unsure

- Align with [CONTRIBUTING.md](CONTRIBUTING.md) (branching, commits, PR expectations).
- If a generated file is marked as auto-generated (e.g. parts of `src/integrations/supabase/`), prefer updating the **source** of truth (schema, CLI, or docs) rather than hand-editing unless the project already does otherwise.
