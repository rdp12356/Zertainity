# 🤖 AGENTS.md — Guidance for AI Coding Agents

> [!NOTE]
> This file is a dedicated reference for agentic AI coding assistants working in the **Zertainity** repository. It contains codebase maps, execution requirements, and architectural rules to follow during implementation tasks.

---

## 🗺️ Project Directory Map

Refer to these target paths when looking for specific application layers:

| Component / Area | File / Folder Path | Reference Link |
| :--- | :--- | :--- |
| **App Entry & Routing** | `src/App.tsx`, `src/main.tsx` | [App.tsx](file:///c:/Users/johan/Documents/Zertainity.in/src/App.tsx) |
| **Pages & Views** | `src/pages/` | [pages/](file:///c:/Users/johan/Documents/Zertainity.in/src/pages) |
| **Reusable UI Components** | `src/components/` | [components/](file:///c:/Users/johan/Documents/Zertainity.in/src/components) |
| **Shared Primitives** | `src/components/ui/` | [ui/](file:///c:/Users/johan/Documents/Zertainity.in/src/components/ui) |
| **Custom React Hooks** | `src/hooks/` | [hooks/](file:///c:/Users/johan/Documents/Zertainity.in/src/hooks) |
| **Supabase Integration & Typings**| `src/integrations/supabase/` | [supabase/](file:///c:/Users/johan/Documents/Zertainity.in/src/integrations/supabase) |
| **Edge Functions / DB Migrations**| `supabase/` | [supabase/](file:///c:/Users/johan/Documents/Zertainity.in/supabase) |
| **Careers Single Source** | `src/data/careersCatalog.ts` | [careersCatalog.ts](file:///c:/Users/johan/Documents/Zertainity.in/src/data/careersCatalog.ts) |
| **Pathway Merge Logic** | `src/data/pathwayFromCatalog.ts` | [pathwayFromCatalog.ts](file:///c:/Users/johan/Documents/Zertainity.in/src/data/pathwayFromCatalog.ts) |

> [!TIP]
> Imports use the `@/` path alias pointing to the `src/` directory as configured in `tsconfig.app.json`.

---

## 🛠️ CLI Commands & Verification

Always use the following commands to install dependencies, run the dev server, and check code validity:

```bash
npm install          # Install required dependencies
npm run dev          # Run Vite development server (default http://localhost:5173)
npm run build        # Build production artifact
npm run lint         # Run ESLint validation checks (must pass with 0 errors)
npm test             # Run Jest unit and integration tests
```

> [!IMPORTANT]
> You **MUST** run `npm run lint` and verify that the build succeeds before concluding any codebase modifications.

---

## 📌 Coding Conventions

### 1. Languages & Types
*   Use TypeScript for all components, helpers, and hooks. Avoid using the `any` type.
*   Match existing patterns such as functional components and standard hooks.

### 2. Styling & Layout Spacing
*   Rely on Tailwind CSS utility classes and preexisting Radix UI primitives.
*   Ensure that component margins, paddings, color schemes, and dark/light mode toggle behaviors match neighboring UI files.

### 3. Database Interactions
*   Interact with Supabase using the client instance exported from `@/integrations/supabase/client`.
*   **SECURITY RULE**: Never include or leak **service role** API keys in client-side bundles. Only use compile-time publishable environment variables (`VITE_SUPABASE_*`).

### 4. Code Edits & Scope
*   Limit code modifications strictly to the files necessary for the user's task.
*   Avoid arbitrary styling refactors or editing files outside the requested scope.
*   Never commit local path references (`file:///...`) or raw credentials into the repository index.

---

## 🛡️ Security & Privacy Requirements

*   **Variables**: Keep local values and developer configurations inside `.env`. Never commit credentials to Git.
*   **Legal Documentation**: Do not hardcode internal development URLs in legal/privacy templates or customer-facing pages.
*   **Role Verifications**: Align admin checks with current database-level session verify functions.

---

## ❓ Troubleshooting & Questions

*   If you find any ambiguities, align your design with [CONTRIBUTING.md](file:///c:/Users/johan/Documents/Zertainity.in/CONTRIBUTING.md).
*   For generated Supabase typescript types, do not perform edits by hand. Instead, request schema updates via migrations or CLI scripts.
*   Reference the design specifications in [DESIGN.md](file:///c:/Users/johan/Documents/Zertainity.in/DESIGN.md) for style requirements.
