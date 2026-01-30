# Car Class12 — Vite + React + TypeScript + shadcn UI 🎮

**A lightweight Vite + React + TypeScript starter with shadcn-style components, Tailwind CSS, and Radix primitives — includes a small car-race game demo.**

---

## 🚀 Project overview

This repository is a front-end application scaffolded with Vite + React + TypeScript and a collection of UI components inspired by **shadcn-ui** (Radix UI primitives + Tailwind). The app contains a small demo game (car race with player select, track, scoreboard), a modular component library under `src/components`, and utilities & hooks for sound, toasts, and mobile support.

Key features:
- TypeScript-first React app
- Tailwind CSS for utility-first styling
- Radix primitives + reusable UI components (in `src/components/ui`)
- Component-driven structure for reuse and testing
- Vitest for unit testing

---

## 🧭 Quick start

1. Clone the repo

```bash
git clone <repo-url>
cd car-class12
```

2. Install dependencies (choose your package manager):

```bash
# npm
npm install

# or pnpm
pnpm install

# or bun
bun install
```

3. Start dev server

```bash
npm run dev
# or pnpm run dev
# or bun run dev
```

Open http://localhost:5173 to view the app locally.

**Live demo:** https://car-class12-6ax1i76vk-sadritaneogi-6560s-projects.vercel.app/

---

## ⚙️ Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Create production build |
| `npm run build:dev` | Create a dev-mode build |
| `npm run preview` | Serve built output locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |

---

## 🧩 Tech stack

- **Vite** — Dev server & build tooling
- **React 18** + **TypeScript** — UI & types
- **Tailwind CSS** — Styling
- **Radix UI** primitives (via `@radix-ui/*`) and shadcn-style components (`src/components/ui`)
- **Vitest** + Testing Library — Unit tests
- **ESLint** — Linting

---

## 📁 Project structure (high level)

- `src/`
  - `components/` — UI components (shadcn-style) and game components
    - `game/` — `GameTitle.tsx`, `PlayerSelect.tsx`, `RaceTrack.tsx`, `Scoreboard.tsx`
    - `ui/` — Reusable UI primitives and components (buttons, dialogs, inputs, toasts, etc.)
  - `hooks/` — Useful React hooks (`use-mobile`, `useGameSounds`, `use-toast`)
  - `lib/` — Shared utilities (`utils.ts`)
  - `pages/` — Top-level pages (`Index.tsx`, `NotFound.tsx`)
  - `main.tsx`, `App.tsx` — App bootstrap and routing

> Tip: The layout is component-driven so you can extract, reuse, and test components easily.

---

## 🧪 Testing

Unit tests use **Vitest** and **@testing-library/react**. Run:

```bash
npm run test
# or
npm run test:watch
```

Place tests next to components (e.g., `Component.test.tsx`) and include simple DOM assertions.

---

## ✅ Linting & Formatting

Run ESLint to find issues:

```bash
npm run lint
```

Consider adding Prettier and a `pre-commit` hook (husky) for consistent styling.

---

## 🚢 Deployment

Build with `npm run build` and deploy the output to static hosts like Vercel, Netlify, GitHub Pages, or any static server. Vercel auto-detects Vite projects and works well for quick deployment.

**Live site:** https://car-class12-6ax1i76vk-sadritaneogi-6560s-projects.vercel.app/

---

## 🤝 Contributing

Thanks for contributing! Suggested workflow:
1. Fork repo and create a branch (`git switch -c feat/awesome`)
2. Implement changes and add tests where applicable
3. Run `npm run lint` and `npm run test`
4. Open a PR with a clear description and screenshots for UI changes

Please keep changes focused and add tests for new behavior.

---

## ⚠️ Notes & TODOs

- Add a `LICENSE` file if you want to open-source this repo (common choice: MIT).
- Add CI (e.g., GitHub Actions) to run lint, tests, and builds on PRs.
- Consider Storybook for component development and documentation.

---

## 📬 Acknowledgements

Built with ❤️ using **Vite**, **React**, **Tailwind CSS**, **Radix UI**, and **Vitest**. If you'd like help extending this starter or making a deploy pipeline, open an issue or PR.

---

*README generated for the `car-class12` project.*

