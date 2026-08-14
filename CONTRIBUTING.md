# 🤝 Contributing to Zertainity

> [!NOTE]
> Thank you for taking the time to contribute to Zertainity! This document outlines local development setups, coding conventions, testing frameworks, and pull request procedures.

---

## 🗺️ Table of Contents
1.  [Code of Conduct](#-code-of-conduct)
2.  [Getting Started](#-getting-started)
3.  [Development Workflow](#-development-workflow)
4.  [Coding Standards](#-coding-standards)
5.  [Testing Framework](#-testing-framework)
6.  [Commit Messages](#-commit-messages)
7.  [Pull Request Process](#-pull-request-process)
8.  [Documentation Files](#-documentation-files)

---

## 🧑‍⚖️ Code of Conduct

This project is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By contributing, you agree to uphold its pledge. Please report any violation to `security@zertainity.in`.

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js** ≥ 18
*   **npm** ≥ 9
*   **Git** installed on your workstation
*   A free **Supabase** account for authentication and database testing

### Local Workspace Setup

1.  **Fork & Clone**: Fork the repository on GitHub and clone it locally:
    ```bash
    git clone https://github.com/<your-username>/zertainity.git
    cd zertainity
    ```

2.  **Install Node Modules**:
    ```bash
    npm install
    ```

3.  **Environment Setup**: Copy the development template and configure your Supabase parameters:
    ```bash
    cp .env.example .env
    ```

4.  **Launch Web Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛣️ Development Workflow

1.  **Checkout Feature Branch**: Make a branch off `main` before starting your changes:
    ```bash
    git checkout -b feat/your-feature-name
    # Or for bug fixes
    git checkout -b fix/issue-description
    ```

2.  **Implement Changes**: Keep commits focused on specific modules. Test your modifications across multiple browser sizes.

3.  **Run Linter**:
    ```bash
    npm run lint
    ```
    Ensure this outputs **0 errors** before staging files.

4.  **Submit Branch**: Push your branch to GitHub and create a Pull Request targeting `main`.

---

## 🎨 Coding Standards

> [!IMPORTANT]
> Consistency is key. Align your changes with the design specification detailed in [DESIGN.md](./DESIGN.md).

*   **TypeScript**: Write explicit typings where possible. Avoid generic type fallbacks like `any`.
*   **Styling**: Use Tailwind utility classes and shadcn/ui components. Keep component spacing, margins, and dark mode toggles aligned with nearby code.
*   **Reusable Components**: Custom components belong in `src/components/`, while page/view routing layouts belong in `src/pages/`.
*   **Database**: Perform all API access using the client exported from `@/integrations/supabase/client`. Respect Row Level Security (RLS) constraints.

---

## 🧪 Testing Framework

Tests are run using **Jest** with **ts-jest** support.

*   **Run All Tests**:
    ```bash
    npm test
    ```

*   **Run Single Test File**:
    ```bash
    npm test -- src/lib/utils.test.ts
    ```

*   **Writing Tests**: File names must end with `.test.ts` or `.test.tsx` and reside in the same directory as the module under test.

---

## 📝 Commit Messages

We enforce [Conventional Commits](https://www.conventionalcommits.org/) standards. Format your commit messages as follows:

```text
<type>(<scope>): <description>

[body]
```

### Commit Types

| Commit Type | Purpose |
| :--- | :--- |
| **`feat`** | Addition of a new user feature |
| **`fix`** | Patching of a bug or resolving an error |
| **`docs`** | Updates to documentation or markdown logs |
| **`style`** | Code formatting, alignment, or spacing tweaks (no logic change) |
| **`refactor`**| Restructuring code logic (no new feature or fix) |
| **`test`** | Creating new test coverage |
| **`chore`** | Updating package dependencies, configurations, or builds |

---

## 📥 Pull Request Process

1.  Fill out the pull request templates completely.
2.  Verify that `npm run lint` and `npm test` execute cleanly with **0 errors**.
3.  Add links referencing the corresponding GitHub issues (e.g. `Closes #12`).
4.  Request reviews from `@rdp12356`.

---

## 📖 Documentation Files

Please refer to the following local documents for extra guides:
*   [AGENTS.md](./AGENTS.md) — Guidelines for AI agents.
*   [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) — Community covenant rules.
*   [SECURITY.md](./SECURITY.md) — Security policies.
*   [DESIGN.md](./DESIGN.md) — Design system specification.
