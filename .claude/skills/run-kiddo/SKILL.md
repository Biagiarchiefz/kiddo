---
name: run-kiddo
description: Build, run, and drive the kiddo app. Use when asked to start kiddo, run it, take a screenshot of its UI, interact with the running app, verify a UI change, or preview a page.
---

Kiddo is a React 19/Vite web app for kids' education (Indonesian). Drive it by starting the Vite dev server on port 5173, then running `.claude/skills/run-kiddo/driver.mjs` which launches a headless Chromium via Playwright, navigates to routes, and saves screenshots.

All paths below are relative to the project root (`E:\web-dev-learn\web-project\kiddo`).

## Prerequisites

Node.js 18+ (already present). Playwright and Chromium must be installed once:

```bash
npm install                               # install all deps incl. playwright devDependency
npx playwright install chromium           # download Chromium browser (~150 MB)
```

No additional OS packages needed on Windows.

## Setup

Copy `.env` or create one with:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

The `.env` file already exists in the repo (not committed). Without it, the app loads but Supabase calls fail silently.

## Run (agent path)

The driver auto-starts the dev server if port 5173 is free, takes screenshots, then stops. Run from the **project root**:

```bash
# Default: screenshots /, /login, /daftar
node .claude/skills/run-kiddo/driver.mjs

# Specific routes — MUST be passed as a single quoted string to avoid Bash expansion
node .claude/skills/run-kiddo/driver.mjs "/challenges" "/leaderboard"
```

Screenshots land in `.claude/skills/run-kiddo/shots/<slug>.png` where slug is the route with `/` replaced by `_` (home page → `home.png`, `/login` → `login.png`, `/challenges` → `challenges.png`).

If the dev server is already running on port 5173, the driver skips startup and uses it.

**Authenticated routes** (`/dashboard`, `/challenges`, `/leaderboard`, `/materi`, `/badges`) redirect to `/` if not logged in. To screenshot them, log in via the `/login` page first inside the same Playwright session, or seed a session cookie. The driver as written shows the redirect target; extend it with a fill/click login sequence if you need the authenticated view.

## Run (human path)

```bash
npm run dev   # → http://localhost:5173 in browser. Ctrl-C to stop.
```

## Gotchas

- **Bash expands bare `/`** — passing `/` as a CLI arg in Git Bash expands it to the Git Bash root (`C:/Program Files/Git/`). Always quote route args: `"/challenges"`. The default run (no args) avoids this entirely.

- **Port conflict → Vite picks 5174** — if another process holds 5173, Vite silently moves to 5174. The driver's HTTP readiness check (`fetch http://localhost:5173`) will then time out. Kill any stale servers first: `npx kill-port 5173` (requires `kill-port` package or Task Manager).

- **IPv6 vs IPv4 on Windows** — `localhost` resolves to `::1` on Windows, not `127.0.0.1`. The driver uses `fetch('http://localhost:5173/')` for readiness checks (which handles DNS resolution correctly). A raw TCP connect to `127.0.0.1:5173` fails even when Vite is up.

- **Slow first-nav** — Vite compiles routes on demand. The first navigation after startup can take 3–5 s. The driver's 2 s `waitForTimeout` handles this for already-started servers; if you add routes, increase it for the first nav.

- **React controlled inputs** — filling login form fields via `page.fill()` works. Using `page.evaluate(() => el.value = '...')` does NOT trigger React's `onChange` and leaves the form state empty.

## Troubleshooting

- **`Cannot navigate to invalid URL "http://localhost:5173C:/..."`**: Bash expanded a bare `/` arg. Quote your route args: `"/login"`.

- **`Port 5173 not ready after 30000ms`**: Vite is up but on a different port (5174+). Kill all Vite processes (`pkill -f vite` in Bash or Task Manager) and retry.

- **`Cannot find module 'playwright'`**: Run `npm install` in the project root first (playwright is a devDependency).

- **`browserType.launch: Executable doesn't exist`**: Run `npx playwright install chromium` to download the Chromium browser binary.
