# DMIF — Dual-Modal Intelligence Framework (Web)

A Next.js 14 (App Router, TypeScript) web application for a BSc Computer
Science dissertation project: a research prototype that predicts next-trading-day
UP/DOWN direction for Colombo Stock Exchange (CSE) listed companies, by fusing
an LSTM (technical indicators) and a CNN (candlestick chart images) trained
separately in Google Colab and served through a Flask + ngrok API.

This repository is the web app only — it does **not** train or run the ML
models. It calls out to an external Flask API for live predictions, with a
built-in demo/offline fallback so the site is always demonstrable.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with a custom design token system (`lib/theme.ts`, `app/globals.css`)
- `@vercel/postgres` for the database
- Custom email/password auth: `bcryptjs` for hashing, `jose` for signed JWT session cookies (httpOnly)
- `lightweight-charts` (TradingView OSS) for the candlestick chart
- Custom JSON-dictionary i18n (English / Sinhala / Tamil) — see `lib/i18n/` — chosen over `next-intl` to keep locale switching instant and cookie-based without URL prefix routing, which better fits a single authenticated dashboard app

## Design system

The visual identity ("Ceylon Ledger") is defined once in `lib/theme.ts` and
wired into Tailwind via CSS variables in `app/globals.css` — light and dark
themes are both fully hand-tuned palettes (not simple inversions). Fonts are
Fraunces (display) and IBM Plex Sans (body/UI), loaded via `next/font/google`
in `app/layout.tsx`.

## Getting started (local development)

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

- `POSTGRES_URL` — point this at any Postgres instance for local dev (a free
  [Neon](https://neon.tech) or [Supabase](https://supabase.com) database
  works, or `vercel env pull .env.local` once the project is linked to Vercel
  Postgres).
- `SESSION_SECRET` — any long random string. Generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `DEMO_MODE` — set to `true` to make `/api/predict` return deterministic,
  clearly-labeled simulated predictions instead of calling a live Flask API.
  Recommended for local dev and for demos/vivas when the Colab notebook isn't
  running.
- `PREDICTION_API_BASE_URL` — the current `pyngrok` tunnel base URL printed by
  the Colab notebook (e.g. `https://xxxx.ngrok-free.app`), only used when
  `DEMO_MODE` is not `true`. This changes every time the notebook restarts —
  update it in Vercel project settings (or `.env.local` for local dev) as
  needed. Never hardcoded in code.

Then create the database tables:

```bash
npm run db:init
```

Seed placeholder per-company accuracy stats (see `scripts/seed-accuracy-stats.ts`
— clearly marked as placeholder data; replace with real per-company evaluation
results once that step of the ML pipeline exists):

```bash
npm run seed:accuracy
```

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`, register an account, and use the dashboard.

## Prediction API integration

`POST /api/predict` (`app/api/predict/route.ts`):

1. If `DEMO_MODE=true`, returns a deterministic pseudo-random prediction
   (seeded by ticker + date) labeled `"Demo data"` in the UI. No network call
   is made.
2. Otherwise, forwards to `${PREDICTION_API_BASE_URL}/predict/<ticker>` and
   maps the response directly (field names match the existing Flask notebook
   API exactly — see `lib/predict.ts`).
3. If that call fails or times out (Colab not running, ngrok tunnel expired,
   etc.), the route returns a `503` with an honest "prediction engine
   offline" message — never a raw error or a crash.
4. For target dates beyond the next trading day, `lib/predict.ts` applies a
   simple iterative post-processing step on top of the single next-day Flask
   response (regresses the up/down split toward 50/50 and decays confidence
   per extra trading day). This is an explicit simplification — the Flask API
   itself only predicts one day ahead — and the UI labels these results as a
   "multi-step estimate" distinct from a direct next-day call.
5. On success, the prediction is saved to Postgres against the logged-in user
   for the History page.

## Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket and import it in Vercel.
2. Add a Vercel Postgres database to the project (Storage tab), which
   populates `POSTGRES_URL` automatically.
3. In Project Settings → Environment Variables, set `SESSION_SECRET`,
   `DEMO_MODE`, and `PREDICTION_API_BASE_URL`.
4. Run the schema + seed scripts once against the deployed database:
   ```bash
   vercel env pull .env.local
   npm run db:init
   npm run seed:accuracy
   ```
5. Deploy. Whenever the Colab notebook is restarted and prints a new ngrok
   URL, update `PREDICTION_API_BASE_URL` in Vercel's dashboard (no redeploy
   required for env var changes to take effect on new requests, though a
   redeploy/restart of the serverless functions may be needed depending on
   caching).

## Project structure

```
app/                 Routes (App Router): landing, auth, dashboard, API handlers
components/          Client UI components (chart, panels, switchers, forms)
lib/                 Server/client libraries: auth, db, i18n, theme, chart data, prediction logic
data/                Bundled dataset: company-list.json + chart-data/{TICKER}.json
scripts/             DB schema init + accuracy-stats seed scripts
```

## Notes / known simplifications

- No live/real-time CSE market data — historical bundled data only, per spec.
- Multi-step ("future date") forecasting is a Next.js-side post-processing
  approximation on top of the Flask API's single next-day response, not a
  true recursive re-invocation of the model's feature pipeline. Clearly
  commented in `lib/predict.ts` and labeled in the UI.
- Company display names are shown as raw tickers (e.g. `AAF.N`) since the
  bundled dataset has no company name lookup.
