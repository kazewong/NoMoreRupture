# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

NoMoreRupture is an athlete data platform that collects performance-testing and injury data over time to identify statistical patterns preceding acute tendon injuries (e.g. Achilles ruptures). Read `README.md` for the full motivation — its principles are binding on product decisions:

- **The only goal is reducing acute injury risk for the population** — not money, fame, or growth metrics. Reject features that compromise this.
- **Privacy-first.** Personally-identifying fields (name, geolocation, etc.) are always optional. Never make them required and never wire the data to advertising/analytics that profile individuals. The methodology assumes noisy, partial data and extracts signal statistically — design for missing fields as the norm, not the exception.
- **Non-commercial.** Don't add monetization, paywalls, or third-party trackers.

The repo is two independent projects, both in **early scaffolding** — most of what follows describes the *intended* architecture to build toward, not code that exists yet:

- `frontend/` — SvelteKit (Svelte 5, runes mode) + TypeScript + Tailwind v4 + daisyUI
- `backend/` — Rust + Axum API server (Postgres via sqlx)

## Frontend (`frontend/`)

Run all commands from `frontend/`.

- `npm run dev` — dev server
- `npm run build` / `npm run preview` — production build / preview
- `npm run check` — sync SvelteKit types and run `svelte-check`
- `npm run lint` — `prettier --check .` + `eslint .`
- `npm run format` — apply prettier
- `npm run test` — run vitest once (`npm run test:unit` = watch mode)
- Single test file: `npx vitest run path/to/file.spec.ts`

### Conventions (important — follow these, not the existing prototype code)

- **Svelte 5 runes only.** Runes mode is force-enabled project-wide in `svelte.config.js`. Use `$state`, `$derived`, `$effect`, `$props`. Use event *attributes* (`onclick`, `onsubmit`) — **not** Svelte 4 `on:click` directives. Don't use `export let`; destructure `$props()`.
- **Use daisyUI components for UI.** Reach for daisyUI classes (`btn`, `card`, `navbar`, `input`, `alert`, `tabs`, etc.) and its semantic theme tokens (`bg-base-100`, `text-primary`, …) rather than hand-rolling raw Tailwind with hardcoded colors. Tailwind v4 is wired via `@tailwindcss/vite`. Keep markup theme-able — avoid hardcoded `indigo-*`/`gray-*` palettes.
- **Validate Svelte before finishing.** When the Svelte MCP server is available, use its `svelte-autofixer` on any component you write and resolve all issues; consult its docs tools for Svelte 5 / SvelteKit APIs (see `frontend/AGENTS.md`).
- **Real routes use `+page.svelte`.** Pages live in `src/routes/<name>/+page.svelte`; shared layout/nav in `+layout.svelte`. Reusable components go in `src/lib/` and import via the `$lib` alias.
- **Testing** is split into two vitest projects (`vite.config.ts`): `client` runs browser tests (Playwright/Chromium) matching `src/**/*.svelte.{test,spec}.{js,ts}`; `server` runs Node-env tests for other `src/**/*.{test,spec}.{js,ts}`. `src/lib/vitest-examples/` holds template examples to copy from. `requireAssertions` is on — every test must assert.

### Existing code status

The route-level components `src/routes/{login,dashboard,data-entry}.svelte` are **throwaway vibe-coded prototypes** — they use Svelte 4 syntax, hardcoded Tailwind instead of daisyUI, mocked `setTimeout`/`alert` logic, and in places invalid syntax. Treat them as rough UX references only; rebuild as proper `+page.svelte` routes following the conventions above rather than copying them. The same applies to `Navbar.svelte`'s links (`/dashboard`, `/profile`, `/settings`) — none are backed by real routes yet.

## Backend (`backend/`)

Run all commands from `backend/`.

- `cargo run` — run the server
- `cargo build` / `cargo check` — build / fast type-check
- `cargo test` — tests

### Architecture (intended)

**Current state (scaffold):** `src/main.rs` is a working Axum server implementing the frontend's full API contract (`/api/v1/auth/{google,dev,me,logout}`, `/api/v1/stats/{public,aggregate}`, `/api/v1/data/{measurement,injury}`). Storage is **in-memory** (`src/store.rs`, a `Db` type seeded with demo data on boot) — a deliberate placeholder for the Postgres layer; data does not persist across restarts. DTOs live in `src/models.rs` (serde `camelCase` to match the frontend). Session auth is a JWT in an HttpOnly cookie. **Dev login:** with `DEV_AUTH` on (default), `GET /api/v1/auth/google` skips Google and logs in a fixed "Dev Tester" athlete — set `DEV_AUTH=0` to disable. Config via env (`PORT`, `FRONTEND_URL`, `JWT_SECRET`, `DEV_AUTH`); see `backend/.env.example`. Real Google OAuth (start + callback) is still a TODO in `auth_start`.

The **intended** target stack (build toward this):

- **Web**: `axum` (+ `axum-extra`, `axum-macros`) with `tower`/`tower-http` (CORS for the SvelteKit origin, request size limits, static serving). Async on `tokio`.
- **Database**: `sqlx` against **Postgres** with `chrono` types. No migrations exist yet — establish a `migrations/` dir and the schema (athletes, measurements, injury reports) as the first real backend work. Model schema around optional/nullable fields to match the privacy-first, partial-data reality.
- **Auth: OAuth social login is the intended model.** Use `oauth2` for the provider flow and `jsonwebtoken` (aws_lc_rs backend) to issue/verify session JWTs. `argon2` and `lettre` are present in `Cargo.toml` but are **not** the primary path — only relevant if a self-hosted email/password fallback is added later.
- **API docs**: annotate handlers with `utoipa` and serve `utoipa-swagger-ui`.
- **Other**: `uuid` v4 for IDs, `serde`/`serde_json` for (de)serialization, `reqwest` for outbound calls, `tracing` for structured logs.

Design the API surface to serve the frontend's needs: authenticating athletes via OAuth, accepting measurement and injury submissions (with most fields optional), and returning aggregate/anonymized statistics for the dashboard. Do not expose endpoints that return individuals' identifying data in aggregate views.

## Roadmap — not yet implemented

What exists today is an end-to-end scaffold (working dev auth, in-memory data, all pages wired). The work below is what remains; roughly ordered by priority. Keep this list current as items land.

### Backend
- **Postgres + sqlx persistence.** Replace the in-memory `Db` (`backend/src/store.rs`) with a real database. Create `backend/migrations/` and the schema (athletes, measurements, injury reports) modeled around nullable/optional fields. This unblocks everything else (data currently resets on restart). Keep the `Db` access boundary so handlers change minimally.
- **Real Google OAuth.** Implement the actual flow in `auth_start` (authorize redirect with state/PKCE) plus a `GET /api/v1/auth/google/callback` that exchanges the code, looks up/creates the athlete, and sets the same session cookie. The `DEV_AUTH` bypass stays for local testing.
- **`PATCH /api/v1/profile`** — persist athlete profile edits. The profile page form is built but its Save button is disabled pending this endpoint.
- **`DELETE /api/v1/account`** — delete all of an athlete's contributed data. Required by the privacy-first commitment; the settings page has a disabled button waiting on it.
- **Correlation analysis.** `Db::aggregate_stats` returns an empty `correlations` list. This is the scientific core (see README) — compute statistical signals relating strength metrics to injury occurrence over time.
- **API docs.** Annotate handlers with `utoipa` and serve `utoipa-swagger-ui` (deps present, unused).
- **Production hardening.** Request size limits (`tower-http`), input validation, and a production cookie config (`SameSite=None; Secure` for cross-site deployments — current `Lax` only works for same-site localhost).

### Frontend
- **Charts.** The dashboard renders injury trends as a table and correlation insights as placeholders; add a charting solution for the time-series and scatter views (no chart lib is installed yet).
- **Wire the stubbed actions.** Profile Save → `PATCH /api/v1/profile`; data-deletion → `DELETE /api/v1/account` (both currently disabled buttons marked with `TODO`).
- **Deployment adapter.** `@sveltejs/adapter-auto` can't detect a target; swap in a concrete adapter once the hosting platform is chosen.
- **Tests.** Only the scaffold example tests exist (`src/lib/vitest-examples/`); add real coverage for the API client, auth/theme state, and key routes.

### Product / research
- **Annual analysis report** (README) — a periodic, deeper anonymized writeup beyond the live `/stats` page.
