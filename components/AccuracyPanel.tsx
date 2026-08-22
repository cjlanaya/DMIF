"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

type AccuracyStats = {
  ticker: string;
  test_accuracy: number;
  sample_count: number;
  last_evaluated: string;
} | null;

export function AccuracyPanel({ ticker }: { ticker: string }) {
  const t = useTranslations();
  const [stats, setStats] = useState<AccuracyStats>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/accuracy/${encodeURIComponent(ticker)}`)
      .then((res) => (res.ok ? res.json() : { stats: null }))
      .then((body) => {
        if (!cancelled) setStats(body.stats ?? null);
      })
      .catch(() => {
        if (!cancelled) setStats(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ticker]);

  return (
    <section className="rounded-lg border border-border bg-surface p-6 shadow-card">
      <h2 className="font-display text-lg font-semibold text-ink">
        {t.dashboard.accuracyPanelTitle}
      </h2>

      {loading && <p className="mt-3 text-sm text-ink-muted">{t.common.loading}</p>}

      {!loading && !stats && (
        <p className="mt-3 text-sm text-ink-muted">{t.dashboard.noAccuracyData}</p>
      )}

      {!loading && stats && (
        <div className="mt-4 space-y-3">
          <Row label={t.dashboard.testAccuracyLabel} value={`${Number(stats.test_accuracy).toFixed(1)}%`} />
          <Row label={t.dashboard.sampleCountLabel} value={String(stats.sample_count)} />
          <Row label={t.dashboard.lastEvaluatedLabel} value={stats.last_evaluated?.slice(0, 10)} />
          <p className="pt-2 text-xs text-ink-muted">{t.dashboard.accuracyNote}</p>
        </div>
      )}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="font-semibold tabular-nums text-ink">{value}</span>
    </div>
  );
}
