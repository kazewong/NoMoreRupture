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

`src/main.rs` is still the default `cargo new` stub. `Cargo.toml` already declares the target stack; build toward:

- **Web**: `axum` (+ `axum-extra`, `axum-macros`) with `tower`/`tower-http` (CORS for the SvelteKit origin, request size limits, static serving). Async on `tokio`.
- **Database**: `sqlx` against **Postgres** with `chrono` types. No migrations exist yet — establish a `migrations/` dir and the schema (athletes, measurements, injury reports) as the first real backend work. Model schema around optional/nullable fields to match the privacy-first, partial-data reality.
- **Auth: OAuth social login is the intended model.** Use `oauth2` for the provider flow and `jsonwebtoken` (aws_lc_rs backend) to issue/verify session JWTs. `argon2` and `lettre` are present in `Cargo.toml` but are **not** the primary path — only relevant if a self-hosted email/password fallback is added later.
- **API docs**: annotate handlers with `utoipa` and serve `utoipa-swagger-ui`.
- **Other**: `uuid` v4 for IDs, `serde`/`serde_json` for (de)serialization, `reqwest` for outbound calls, `tracing` for structured logs.

Design the API surface to serve the frontend's needs: authenticating athletes via OAuth, accepting measurement and injury submissions (with most fields optional), and returning aggregate/anonymized statistics for the dashboard. Do not expose endpoints that return individuals' identifying data in aggregate views.
