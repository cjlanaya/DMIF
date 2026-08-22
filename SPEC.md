# DMIF Web App — Build Specification

**Read this entire file before writing any code.** This is the complete spec for building the DMIF (Dual-Modal Intelligence Framework) web application — a stock direction prediction platform for the Colombo Stock Exchange (CSE), built as the final-year dissertation project of a BSc Computer Science student.

Build this as a **real, working, deployable Next.js application**, not a mockup. Every part described below should be implemented in full.

---

## 1. Project Overview

**What this is:** A web platform where a logged-in user picks one of 80 CSE-listed companies, views its historical price chart, and requests an AI-generated UP/DOWN direction prediction (for the next trading day, or optionally a future date via multi-step forecasting). The prediction is powered by a fusion of an LSTM model (numerical technical indicators) and a CNN model (candlestick chart image recognition), both already trained separately (outside this web app, in Google Colab) and served via a Flask API tunneled through ngrok.

**This web app's job:**
- User accounts (register/login) with data stored in Postgres
- A dashboard where the user selects a company, sees its historical chart, and requests a prediction
- Calls out to an external prediction API (Flask + ngrok URL, configurable) to get the actual UP/DOWN + confidence result
- Displays the prediction with a model breakdown (LSTM % vs CNN % contribution) and the fusion confidence score
- Shows historical accuracy stats for that company (static, precomputed data — not live-computed)
- Supports 3 languages: English, Sinhala (සිංහල), Tamil (தமிழ்)
- Supports light and dark theme, user-toggleable
- Looks and feels like a real, professionally designed fintech product — NOT a generic AI-generated template. See Section 4 (Design System) — follow it precisely.

**What this web app is NOT responsible for:**
- Training any ML models (already done, in Colab notebooks)
- Live/real-time CSE market data (explicitly out of scope for this version — use only the bundled historical dataset described in Section 3)
- Actually calling a live Flask/ngrok endpoint during initial build — build the integration with a clearly marked mock/fallback mode first (see Section 6), since the ngrok URL changes every Colab session and isn't always live

---

## 2. Tech Stack (fixed — do not substitute)

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript throughout
- **Styling:** Tailwind CSS (custom config per Section 4 tokens — do not use default Tailwind palette)
- **Database:** Vercel Postgres (`@vercel/postgres`)
- **Auth:** Custom email + password auth (NOT a third-party auth provider). Passwords hashed with `bcrypt`. Sessions via signed HTTP-only cookies (use `jose` or `iron-session` for JWT/session signing — your choice, pick one and use it consistently).
- **Charts:** `lightweight-charts` (TradingView's own open-source library, free, npm package `lightweight-charts`) for the candlestick chart — this gives an authentic TradingView look without needing their paid widget or live data feed.
- **i18n:** `next-intl` or a simple custom JSON-dictionary approach (your choice — pick whichever integrates more cleanly with the App Router; document which you chose in the README)
- **Deployment target:** Vercel

---

## 3. Data Files (provided — bundle these into the project)

Two data assets are provided alongside this spec. Place them in the project as follows:

### 3.1 `company_list.json`
- Location: `/data/company-list.json`
- Format: flat JSON array of 80 strings, e.g. `["AAF.N", "AAIC.N", "ABAN.N", ...]`
- These are CSE ticker symbols. Use this to populate the company dropdown/picker.
- **Note:** this file has ONLY tickers, no company display names. For the UI, it is acceptable to just show the ticker symbol itself as the display name (e.g. "AAF.N") unless you want to maintain a small manual lookup map for a handful of well-known ones — do not fabricate full company names for all 80, since that would be inaccurate. Prefer showing the raw ticker consistently.

### 3.2 `chart_data/` folder (80 JSON files, one per company)
- Location: bundle as `/data/chart-data/{TICKER}.json`
- Format per file: JSON array of daily OHLC records, e.g.:
  ```json
  [
    {"Date": "2024-02-26", "Open": 185.75, "High": 208.5, "Low": 185.75, "Close": 200.0},
    {"Date": "2024-02-27", "Open": 187.0, "High": 188.0, "Low": 187.0, "Close": 200.0}
  ]
  ```
- Roughly 2 years of daily data per company, already cleaned.
- **No Volume field is present** — do not build a volume panel under the chart; candlestick body/wick only.
- Total size ~2.9MB across all 80 files — small enough to bundle directly in the repo and read server-side or statically import; no need for blob storage.

### 3.3 How to wire this into the app
Write a small server-side data access module (e.g. `/lib/chart-data.ts`) that:
- Exposes `getCompanyList(): string[]`
- Exposes `getCompanyChartData(ticker: string): OHLCRecord[]`
- Reads directly from the bundled JSON files (via `fs` in a server component / API route, or static import — whichever is idiomatic for the chosen Next.js data-fetching pattern)

---

## 4. Design System — Read Carefully, Do Not Default

**Critical instruction:** Do NOT produce a generic "fintech blue" or generic "dark AI dashboard" template. This student has explicitly said the site must "not look AI generated." Take a real design pass — pick a distinctive, intentional visual identity grounded in the actual subject matter (Sri Lankan capital markets, candlestick/technical analysis culture, dual-model AI), not a default template.

### Required process before coding:
1. Design a real token system: 4–6 named hex colors (for BOTH a light theme and a dark theme — two coherent, deliberately designed palettes, not just color-inverted defaults), two type roles (a characterful display face + a complementary body/UI face — pull real Google Fonts, do not use system-ui/Arial), and a layout concept.
2. The design should feel like a serious, credible fintech / trading terminal product — think the calm confidence of Bloomberg Terminal or a well-designed brokerage app, filtered through a distinctive point of view (not literally copying Bloomberg's amber-on-black look — that IS a known cliché to avoid defaulting into, same as generic teal/navy AI-dashboard defaults).
3. Consider incorporating something authentically Sri Lankan/CSE-specific into the visual identity (e.g. typographic nod, a signature motif) — but do not force decorative Sinhala/Tamil script into logos or headers purely for decoration; keep actual multilingual text limited to real UI copy translated properly (Section 8).
4. Both light and dark themes must be fully realized, not just CSS variable inversions that break contrast — design each as its own coherent palette.
5. Respect `prefers-reduced-motion`. Keep animation purposeful (page transitions, chart load, subtle hover states) — not decorative.

### Non-negotiables regardless of visual direction chosen:
- Fully responsive down to mobile width
- Visible keyboard focus states on all interactive elements
- WCAG AA contrast minimum in both themes
- A dedicated `/lib/theme.ts` or `tailwind.config.ts` extension holding all design tokens as named values — no magic hex codes scattered inline in components

---

## 5. Pages & Routes

### 5.1 `/` — Landing page
- Brief, confident landing page introducing DMIF. One clear CTA to Sign In / Register.
- Should establish the visual identity immediately (this is the "hero" per design principles — make it count, don't just center a headline over a gradient).
- Mention (briefly, factually, not oversold): dual-model AI (LSTM + CNN), CSE-focused, research prototype.
- Footer disclaimer: predictions are for academic research purposes only, not financial advice.

### 5.2 `/register` and `/login`
- Simple email + name + password registration form.
- Login form: email + password.
- Passwords hashed with bcrypt before storage — never store or log plaintext passwords.
- Proper inline validation and error states (wrong password, email already registered, etc.) — written in the interface's voice, not generic "Error occurred."
- On success, set a signed session cookie and redirect to `/dashboard`.

### 5.3 `/dashboard` — Main authenticated page
This is the core of the product. Layout:

- **Company selector:** dropdown/searchable list of the 80 tickers from `company-list.json`.
- **Chart panel:** TradingView-style candlestick chart (via `lightweight-charts`) rendered from that company's `chart-data/{TICKER}.json`. Should feel like a real trading terminal — crosshair, zoom/pan, clean axis labels. Respect the active theme (light/dark chart styling, not just a light chart forced onto a dark page).
- **Prediction panel:**
  - A date picker: defaults to "next trading day," but allow picking a future date further out (explain briefly in the UI, in plain language, that further-out dates use iterative/multi-step forecasting and carry lower confidence — do not oversell certainty).
  - A "Run Prediction" button.
  - Result display: UP or DOWN direction (clear visual treatment — color + icon, not just text), confidence percentage, and the date the prediction is for.
  - **Model breakdown sub-panel:** show LSTM contribution % and CNN contribution % (from the fusion layer's learned weights) as a simple, legible visual (e.g. a small horizontal split bar or two labeled numbers — do not over-engineer this into a full chart).
- **Historical accuracy panel:** for the selected company, show precomputed accuracy stats (e.g. "Test accuracy for this company: 61.2%", sample count, last evaluated date). This is STATIC data you'll store as a small JSON/table (see Section 7) — it is not computed live in the browser.
- **Language switcher and theme switcher:** accessible from the dashboard header/nav at all times.

### 5.4 `/dashboard/history` (or a tab/section within dashboard)
- List of the logged-in user's past predictions (ticker, date requested, date predicted for, result, confidence) — pulled from Postgres.

### 5.5 `/api/*` routes
Implement as Next.js Route Handlers:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/companies` — returns the bundled company list
- `GET /api/chart-data/[ticker]` — returns that company's OHLC JSON
- `POST /api/predict` — see Section 6, this is the important one
- `GET /api/history` — returns the logged-in user's saved predictions

---

## 6. Prediction API Integration (the important part — read carefully)

The actual ML inference happens OUTSIDE this Next.js app, in a Flask API running inside an active Google Colab session, exposed via a `pyngrok` tunnel. That means:

- The ngrok URL is **not stable** — it changes every time the Colab notebook restarts.
- The Flask API may not be running at all when someone visits this deployed site.

**Build `/api/predict` (Next.js Route Handler) to:**

1. Read the current ngrok base URL from an environment variable: `PREDICTION_API_BASE_URL` (set in Vercel project settings; NOT hardcoded — the student will update this env var whenever they restart their Colab session).
2. Forward the prediction request to `${PREDICTION_API_BASE_URL}/predict/<ticker>` (matching the existing Flask route already built — see the exact response shape below, taken from the existing notebook code so you match field names exactly).
3. If the request fails (timeout, ngrok URL down, network error, non-200 response) — **do not crash or show a raw error**. Instead:
   - Return a clear, honest fallback response indicating the live prediction service is currently offline (in the interface's voice — e.g. "The prediction engine is offline right now — the model runs from a research notebook that isn't always active. Try again shortly.")
   - Optionally: allow a `DEMO_MODE` environment variable that, when true, returns a clearly-labeled simulated/demo prediction instead (deterministic pseudo-random based on ticker + date, NOT claiming to be a real model output — labeled visibly as "Demo data" in the UI) so the site remains demonstrable even when the Colab notebook isn't running. Implement this fallback — it matters for being able to show the site working at any time, including during a viva when Colab might not be live.
4. On success, save the prediction result to Postgres against the logged-in user (for the History page) before returning it to the frontend.

**Exact expected response shape from the real Flask API** (already implemented in the existing Colab notebook, do not change these field names):

```json
{
  "company": "ASIR.N",
  "direction": "UP",
  "up_pct": 62.4,
  "down_pct": 37.6,
  "confidence": 24.8,
  "lstm_pct": 65.0,
  "cnn_pct": 58.0,
  "lstm_weight": 60,
  "cnn_weight": 40,
  "as_of": "2026-08-20"
}
```

Map this directly into the dashboard's Prediction panel and Model breakdown sub-panel described in Section 5.3.

For "predict a future date beyond next trading day": the existing Flask API as currently built only predicts the immediate next day from the latest available window. Implement the future-date UI now, but have it call `/api/predict` with a `targetDate` parameter; on the backend, if `targetDate` is further out than the next trading day, loop by feeding the model's own prediction back in as a synthetic next input (simple iterative forecasting) for however many steps are needed, and clearly reduce/discount the displayed confidence the further out the date is (e.g. multiply confidence by a decay factor per step). Label this clearly in the UI as a multi-step estimate, distinctly from the direct next-day prediction. If wiring this fully into the live Flask API is too complex initially, implement it in the Next.js API route as a post-processing step on top of whatever the Flask API returns for the next immediate day, and be explicit in code comments about this simplification.

---

## 7. Database Schema (Vercel Postgres)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE predictions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  ticker TEXT NOT NULL,
  target_date DATE NOT NULL,
  direction TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  lstm_pct NUMERIC,
  cnn_pct NUMERIC,
  lstm_weight NUMERIC,
  cnn_weight NUMERIC,
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE company_accuracy_stats (
  ticker TEXT PRIMARY KEY,
  test_accuracy NUMERIC,
  sample_count INTEGER,
  last_evaluated DATE
);
```

For `company_accuracy_stats`, seed this table with placeholder/reasonable values for now (the student will provide real per-company stats later, from a "per-company accuracy profiling" step that is a separate, not-yet-built piece of their ML pipeline) — write a seed script (`/scripts/seed-accuracy-stats.ts` or `.sql`) that inserts one row per ticker from `company-list.json` with a plausible placeholder accuracy (e.g. random between 52–68%) CLEARLY commented as `-- PLACEHOLDER: replace with real per-company evaluation results`.

---

## 8. Internationalization (English / Sinhala / Tamil)

- All UI copy (buttons, labels, headers, error messages, disclaimers) must be translatable via the chosen i18n approach.
- Provide complete translation dictionaries for all three languages — English, Sinhala (සිංහල), Tamil (தமிழ்) — for every piece of UI copy used. Do not leave Sinhala/Tamil as English placeholders; write real, correct translations for all strings (login form labels, dashboard section headers, prediction result text, error messages, disclaimer text, etc.).
- Company ticker symbols themselves stay in Latin script in all languages (they're stock codes, not translatable content).
- Provide a persistent language switcher (e.g. header dropdown) that updates the whole UI immediately and persists the choice (cookie or localStorage).

---

## 9. What NOT to build right now (explicitly out of scope)

- Do not integrate any live/real-time CSE market data API (the unofficial `cse.lk/api/*` endpoints) — this was explicitly deferred by the student. Historical data only, from the bundled JSON files.
- Do not build SHAP explainability visualizations in this web app (that's a separate research-notebook deliverable, not a web feature, at least not yet).
- Do not attempt to actually train or retrain any model from this codebase.
- Do not hardcode any specific ngrok URL — always read from environment variable.

---

## 10. Deliverable Checklist

Build and verify all of the following work end-to-end before considering this done:

- [ ] `npm install && npm run dev` runs cleanly with no errors
- [ ] Register a new user → land on dashboard
- [ ] Log out, log back in with same credentials
- [ ] Company dropdown shows all 80 tickers from `company-list.json`
- [ ] Selecting a company renders its real candlestick chart from the bundled data
- [ ] Switching light/dark theme updates the entire UI including chart styling
- [ ] Switching language (EN/SI/TA) updates all visible UI text
- [ ] Clicking "Run Prediction" with `DEMO_MODE=true` returns a clearly-labeled demo result and displays direction, confidence, and model breakdown correctly
- [ ] Prediction history page shows past predictions for the logged-in user
- [ ] Picking a future date beyond next-trading-day shows the multi-step forecast UI path with reduced confidence and a clear "estimated" label
- [ ] A README.md exists explaining: how to set `PREDICTION_API_BASE_URL` and `DEMO_MODE` env vars, how to run the Postgres seed script, and how to deploy to Vercel

---

## 11. Context on the ML system (for realistic copy/labels only — do not reimplement)

For writing accurate UI copy/labels (not for building any of this logic client-side):

- **LSTM model:** Stacked LSTM (64→32 units), trained on 30-day sequences of 29–30 technical indicators (OHLCV, RSI, MACD, Bollinger Bands, Parabolic SAR, Fibonacci retracement levels, moving averages, volatility) per CSE company.
- **CNN model:** EfficientNetB0 (transfer learning from ImageNet), trained on 224×224 (or 64×64 in some runs) candlestick chart images representing 30-day price windows.
- **Fusion layer:** Logistic Regression meta-learner combining both models' output probabilities into a final direction + confidence.
- **Target:** binary UP/DOWN — whether next trading day's close is higher than current close.
- **Dataset:** 80 CSE-listed companies, sourced via CSE premium subscription (no public API exists for CSE), class imbalance present (~65% DOWN / ~35% UP historically, addressed via class weighting in training).
- This is a final-year BSc Computer Science research project — the tone throughout the product should be "credible research prototype," not "we guarantee profits." Keep any performance/confidence language honest and appropriately hedged.

---

**End of spec. Build the complete application described above.**
