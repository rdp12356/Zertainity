# Contributing to Zertainity

Thank you for your interest in improving Zertainity! Please read this guide before opening issues or submitting pull requests.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing](#testing)
6. [Commit Messages](#commit-messages)
7. [Pull Request Process](#pull-request-process)
8. [Areas to Improve](#areas-to-improve)

---

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold these standards. Please report unacceptable behaviour to `security@zertainity.in`.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 9
- A free [Supabase](https://supabase.com/) account (for local auth and database testing)
- Git

### Local Setup

1. **Fork the repository** on GitHub, then clone your fork:
   ```bash
   git clone https://github.com/<your-username>/zertainity.git
   cd zertainity
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Parameters**: Copy the environment template and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Development Workflow

1. **Create a branch** from `main` for your work:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes** in small, focused commits. Ensure you review how layout spacing and alignment look at multiple viewpoints.

3. **Lint your code** before committing:
   ```bash
   npm run lint
   ```

4. **Verify changes map properly** to the `src/pages` component logic if introducing UI routing updates in `App.tsx`.

5. **Push your branch** and open a Pull Request against `main`.

---

## Coding Standards

- **Language**: TypeScript — avoid `any` unless absolutely necessary. Rely on proper Zod inference for schemas if applicable.
- **Formatting**: Follow the existing ESLint configuration (`eslint.config.js`). Running `npm run lint` must produce no errors.
- **Styling**: Use **Tailwind CSS** utility classes and the existing `shadcn/ui` component library. **Do not** introduce additional CSS frameworks. Maintain consistent layout alignments (using standard `flex` properties, standard margins, e.g., `mb-4`, `p-6`).
- **Components**: 
  - Place reusable, generic UI components under `src/components/`. 
  - Entire application views/screens belong in `src/pages/`.
- **Imports**: Use path aliases defined in `tsconfig.app.json` (e.g., `@/components/...`).
- **Secrets**: Never commit API keys, tokens, or passwords. Rely exclusively on environment variables (`.env`).

---

## Testing

Tests use **Jest** with **ts-jest** and **jsdom**.

- Run all tests:
  ```bash
  npm test
  ```
- Run a specific test file:
  ```bash
  npm test -- src/lib/utils.test.ts
  ```

- Test files must be named `*.test.ts` or `*.test.tsx` and live next to the file they test.
- All new utility functions and business-logic hooks should have unit tests.
- UI components need not be exhaustively tested, but any complex conditional rendering should have coverage.

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<optional scope>): <short description>

[optional body]

[optional footer]
```

### Common Types: 
`feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`.

### Examples:
- `feat(quiz): add weighted scoring for PCB stream`
- `fix(darkmode): correct CSS variable for neon glow on mobile`
- `docs: expand CONTRIBUTING guide`

---

## Pull Request Process

1. Fill in the pull request template completely.
2. Ensure `npm run lint` and `npm test` pass locally.
3. Link the related issue (e.g., `Closes #42`).
4. Request a review from at least one maintainer (`@rdp12356` or `@vineyragesh333`).
5. Address all review comments before the PR is merged.
6. Squash commits if requested by the reviewer.

---

## Areas to Improve

- **UI/UX**: Better mobile responsiveness across nested flows, accessibility (ARIA labels, keyboard navigation).
- **Career Data**: Expand the career database with more streams and real-world salary/job data.
- **Performance**: Lazy-load heavy components, optimize Supabase queries.
- **Testing**: Increase unit and integration test coverage.
- **Documentation**: Improve inline code comments.
---

## 🟢 Good First Issues

If you're new to the project, start here:

* Improve UI spacing and responsiveness
* Fix minor bugs in forms or navigation
* Add new career entries to the dataset
* Improve documentation clarity

Look for issues labeled:

* `good first issue`
* `help wanted`

---

## 🌍 Ways to Contribute

You don’t need to be a developer to help!

* 🐛 Report bugs
* 💡 Suggest features
* 🎨 Improve UI/UX
* 📝 Improve documentation
* 📊 Add career or education data

---

## 💬 Communication

* Open an issue for discussions
* Be respectful and constructive
* Keep PRs focused and minimal

---

## ⭐ Why Contribute?

By contributing to Zertainity, you help:

* Students make better career decisions
* Build an open AI-driven education platform
* Grow an impactful open-source project

---
