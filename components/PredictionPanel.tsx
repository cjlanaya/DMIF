"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { NEXT_TRADING_DATE } from "@/lib/predict";
import type { PredictionResult } from "@/lib/predict";
import { ModelBreakdown } from "@/components/ModelBreakdown";
import { ExplainPanel } from "@/components/ExplainPanel";

type PanelState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; result: PredictionResult };

export function PredictionPanel({ ticker }: { ticker: string }) {
  const t = useTranslations();
  const defaultDate = NEXT_TRADING_DATE;
  const [targetDate, setTargetDate] = useState(defaultDate);
  const [state, setState] = useState<PanelState>({ status: "idle" });

  async function runPrediction() {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, targetDate }),
      });
      if (!res.ok) {
        setState({ status: "error" });
        return;
      }
      const result = (await res.json()) as PredictionResult;
      setState({ status: "success", result });
    } catch {
      setState({ status: "error" });
    }
  }

  const isMultiStep = targetDate !== defaultDate;

  return (
    <section className="rounded-lg border border-border bg-surface p-6 shadow-card">
      <h2 className="font-display text-lg font-semibold text-ink">
        {t.dashboard.predictionPanelTitle}
      </h2>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            {t.dashboard.targetDateLabel}
          </span>
          <input
            type="date"
            value={targetDate}
            min={defaultDate}
            onChange={(e) => setTargetDate(e.target.value || defaultDate)}
            className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink"
          />
        </label>

        <button
          type="button"
          onClick={runPrediction}
          disabled={state.status === "loading"}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast disabled:opacity-60"
        >
          {state.status === "loading" ? t.dashboard.runningPrediction : t.dashboard.runPrediction}
        </button>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-ink-muted">
        {isMultiStep
          ? t.dashboard.multiStepHint
          : t.dashboard.nextTradingDayHint.replace("{date}", NEXT_TRADING_DATE)}
      </p>

      {state.status === "error" && (
        <div className="mt-5 rounded-md border border-down/40 bg-down-soft p-4">
          <p className="text-sm font-semibold text-down">{t.dashboard.offlineTitle}</p>
          <p className="mt-1 text-sm text-ink">{t.dashboard.offlineMessage}</p>
        </div>
      )}

      {state.status === "success" && (
        <PredictionResultView result={state.result} ticker={ticker} />
      )}
    </section>
  );
}

function PredictionResultView({
  result,
  ticker,
}: {
  result: PredictionResult;
  ticker: string;
}) {
  const t = useTranslations();
  const isUp = result.direction === "UP";

  return (
    <div className="mt-6 space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center gap-2">
        {result.isDemo && (
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
            {t.dashboard.demoDataBadge}
          </span>
        )}
        {result.isMultiStep && (
          <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-muted">
            {t.dashboard.multiStepBadge}
          </span>
        )}
      </div>

      <div
        className={`flex items-center gap-4 rounded-md p-5 ${
          isUp ? "bg-up-soft" : "bg-down-soft"
        }`}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            isUp ? "bg-up text-white" : "bg-down text-white"
          }`}
        >
          {isUp ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div>
          <p className={`font-display text-2xl font-semibold ${isUp ? "text-up" : "text-down"}`}>
            {isUp ? t.dashboard.directionUp : t.dashboard.directionDown}
          </p>
          <p className="text-sm text-ink-muted">
            {t.dashboard.resultFor} {result.targetDate}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            {t.dashboard.confidenceLabel}
          </p>
          <p className="font-display text-2xl font-semibold tabular-nums text-ink">
            {result.confidence.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md border border-border p-3">
          <p className="text-xs text-ink-muted">{t.dashboard.upProbabilityLabel}</p>
          <p className="font-semibold tabular-nums text-ink">{result.up_pct.toFixed(1)}%</p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="text-xs text-ink-muted">{t.dashboard.downProbabilityLabel}</p>
          <p className="font-semibold tabular-nums text-ink">{result.down_pct.toFixed(1)}%</p>
        </div>
      </div>

      <ModelBreakdown
        lstmPct={result.lstm_pct}
        cnnPct={result.cnn_pct}
        lstmWeight={result.lstm_weight}
        cnnWeight={result.cnn_weight}
      />

      <ExplainPanel ticker={ticker} />
    </div>
  );
}
