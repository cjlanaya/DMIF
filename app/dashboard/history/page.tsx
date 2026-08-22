"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import type { PredictionRow } from "@/lib/db";

export default function HistoryPage() {
  const t = useTranslations();
  const [predictions, setPredictions] = useState<PredictionRow[] | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => (res.ok ? res.json() : { predictions: [] }))
      .then((body) => setPredictions(body.predictions ?? []));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">{t.history.title}</h1>

      {predictions === null && <p className="text-sm text-ink-muted">{t.common.loading}</p>}

      {predictions !== null && predictions.length === 0 && (
        <p className="text-sm text-ink-muted">{t.history.empty}</p>
      )}

      {predictions !== null && predictions.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-alt text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <Th>{t.history.columnTicker}</Th>
                <Th>{t.history.columnRequested}</Th>
                <Th>{t.history.columnTargetDate}</Th>
                <Th>{t.history.columnDirection}</Th>
                <Th>{t.history.columnConfidence}</Th>
                <Th>{t.history.columnSource}</Th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-semibold tabular-nums">{p.ticker}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{String(p.target_date).slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        p.direction === "UP" ? "text-up" : "text-down"
                      }`}
                    >
                      {p.direction === "UP" ? t.dashboard.directionUp : t.dashboard.directionDown}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{Number(p.confidence).toFixed(1)}%</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {p.is_demo ? t.history.sourceDemo : t.history.sourceLive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}
