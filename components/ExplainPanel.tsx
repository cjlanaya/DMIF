"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import type { ExplainFeature, ExplainResponse } from "@/app/api/explain/[ticker]/route";

type ExplainState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "unavailable" }
  | { status: "success"; data: ExplainResponse };

/**
 * Secondary, click-only drill-down below the main prediction result. Calls
 * the /explain/<ticker> backend endpoint (built separately in the Colab
 * notebook) via our /api/explain proxy. Deliberately never simulates data —
 * if the endpoint isn't live yet, this just shows a small "unavailable"
 * message without touching the main prediction panel above it.
 */
export function ExplainPanel({ ticker }: { ticker: string }) {
  const t = useTranslations();
  const [state, setState] = useState<ExplainState>({ status: "idle" });

  async function handleExplain() {
    setState({ status: "loading" });
    try {
      const res = await fetch(`/api/explain/${encodeURIComponent(ticker)}`);
      if (!res.ok) {
        setState({ status: "unavailable" });
        return;
      }
      const data = (await res.json()) as ExplainResponse;
      setState({ status: "success", data });
    } catch {
      setState({ status: "unavailable" });
    }
  }

  return (
    <div className="mt-4 border-t border-border pt-4">
      <button
        type="button"
        onClick={handleExplain}
        disabled={state.status === "loading"}
        className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-accent hover:text-ink disabled:opacity-60"
      >
        {state.status === "loading" ? t.dashboard.explainLoading : t.dashboard.explainButton}
      </button>

      {state.status === "unavailable" && (
        <p className="mt-2 text-xs text-ink-muted">{t.dashboard.explainUnavailable}</p>
      )}

      {state.status === "success" && <ExplainResult data={state.data} />}
    </div>
  );
}

function ExplainResult({ data }: { data: ExplainResponse }) {
  const t = useTranslations();
  const features: ExplainFeature[] = Array.isArray(data.top_features) ? data.top_features : [];

  return (
    <div className="mt-3 max-w-sm space-y-1.5 animate-fade-up">
      {features.map((f, i) => (
        <div key={`${f.feature}-${i}`} className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-ink-muted">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                f.direction === "UP" ? "bg-up" : "bg-down"
              }`}
              aria-hidden="true"
            />
            {f.feature}
          </span>
          <span className="tabular-nums text-ink" title={t.dashboard.explainContributionLabel}>
            {f.contribution.toFixed(5)}
          </span>
        </div>
      ))}

      {data.note && <p className="mt-2 text-xs italic text-ink-muted">{data.note}</p>}
    </div>
  );
}
