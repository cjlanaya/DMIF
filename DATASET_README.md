# Dataset — README

This file explains where the data included in this submission came from and
how it was constructed. It accompanies the source code and the dissertation
(see Chapter 5, "Implementation", Section 5.3 for the full methodological
account).

---

## 1. Where the data was obtained

The historical market data underpinning this project was obtained from the
**Colombo Stock Exchange (CSE)**, Sri Lanka's national stock exchange.

The CSE does not provide a public, programmatic (API-based) interface for
historical data. All data used in this project was therefore obtained
through a **paid CSE premium data subscription**, which grants access to
full historical Open, High, Low, Close and Volume (OHLCV) records for
individual listed securities. Each security's historical record was
retrieved **individually** through the CSE subscription service, since no
bulk or automated export was available.

This subscription authorises use of the data for **personal academic
research**. In line with that licence:

- The raw subscription data is **not redistributed** in full anywhere in
  this submission or the deployed web application.
- Only the derived, cleaned dataset and the technical indicators computed
  from it are included here, for the purpose of reproducing this research.
- The deployed web interface exposes model outputs and a limited derived
  price series for chart display only — it does not expose the underlying
  subscription dataset.

---

## 2. Companies included

Eighty (80) CSE-listed securities were selected for inclusion, chosen on
the basis of data completeness (i.e. securities with a sufficiently long
and continuous trading history to support the 30-day sequence construction
described below). The full list of included securities is available in
`data/company-list.json`.

---

## 3. How the raw data was cleaned and consolidated

Each security's file was retrieved separately from the CSE subscription
portal, in the exchange's own export format. The following steps were
applied to consolidate and clean this data into a single master dataset:

1. **File discovery** — retrieved files were matched to their security
   symbol using a filename-pattern convention.
2. **Schema normalisation** — column names were standardised across all
   files into a common schema (Date, Open, High, Low, Close, Share_Volume).
3. **Date parsing** — the CSE's exchange-specific textual date format was
   parsed into proper timestamp objects to guarantee correct chronological
   ordering across month and year boundaries.
4. **Quality correction**:
   - Missing opening prices were forward-filled from the preceding day's
     closing price (reflecting days the security did not trade).
   - Missing low/high values were derived as the minimum/maximum of that
     day's open and close.
   - Zero share volume was retained as a genuine observation of market
     inactivity, not treated as missing data.
   - Records with no closing price were removed entirely, since no
     defensible value could be imputed for the field the target label
     depends on.
5. **Chronological sorting** — records were sorted by date within each
   security.

This process was applied consistently across all 80 securities and
produced a consolidated master dataset of **323,998 daily records**.

---

## 4. How the engineered dataset was built

From the cleaned OHLCV records, **30 technical indicators** were computed
per security, spanning four categories:

- **Price-derived** — Daily/Log Return, High-Low Range, Open-Close Range
- **Trend** — Moving Averages (24/30/500-day), Parabolic SAR and SAR Trend
- **Momentum** — RSI, MACD, MACD Signal, MACD Histogram
- **Volatility** — Bollinger Bands (Upper/Lower/Middle/Width), 10-day
  realised volatility
- **Support/resistance** — Fibonacci retracement levels (6 levels)
- **Volume-derived** — Log Volume, Volume Moving Average, Volume Ratio

The binary directional target label was assigned per record: **1 (UP)** if
the following trading day's closing price is strictly higher than the
current day's close, **0 (DOWN)** otherwise. The final record of each
security (which has no subsequent day to compare against) was excluded.

Full details of every indicator's formula, the exact cleaning rules, and
the resulting class distribution (approximately 65.4% DOWN / 34.6% UP) are
documented in Chapter 5 of the dissertation.

---

## 5. How the chart image dataset was built

A separate visual dataset was generated **from the same cleaned master
dataset** described above, by sliding a 30-day window across each
security's price history (stride: 5 trading days) and rendering each
window as an image in two encodings:

- **Candlestick charts** — a conventional candlestick rendering of the
  30-day window, styled to match standard technical-analysis presentation.
- **Correlation heatmaps** — a Pearson correlation matrix of 14 selected
  features computed over the same 30-day window.

This produced a labelled corpus of **111,104 chart images** in total,
carrying the identical directional label as the corresponding numerical
sequence for that window. Full generation parameters (resolution, stride,
colour conventions) are documented in Chapter 5, Section 5.4.

---

## 6. What is and isn't included in this submission

**Included:**
- `data/company-list.json` — the list of 80 CSE ticker symbols
- `data/chart-data/*.json` — derived OHLC series per security, used to
  render historical charts in the deployed web interface
- All source code (notebooks and web application) used to clean, engineer,
  train, evaluate and deploy the models

**Not included (by design, per the subscription licence and file size):**
- The raw CSE subscription export files
- The full 111,104-image chart corpus (regenerable from the master
  dataset using the code provided)
- The full master dataset CSV with all 30 engineered features (available
  on request; regenerable from raw CSE data using the provided cleaning
  and feature-engineering code, given a valid CSE subscription)

---

## 7. Reproducing the dataset

Given access to raw CSE OHLCV exports for the same 80 securities, the
complete master dataset and chart corpus can be regenerated by running the
data preparation cells in the provided notebooks, in the order described
in Chapter 5 of the dissertation and in the main project `README.md`.
