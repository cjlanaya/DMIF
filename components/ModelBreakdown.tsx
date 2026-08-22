"use client";

import { useTranslations } from "@/lib/i18n/LocaleProvider";

export function ModelBreakdown({
  lstmPct,
  cnnPct,
  lstmWeight,
  cnnWeight,
}: {
  lstmPct: number;
  cnnPct: number;
  lstmWeight: number;
  cnnWeight: number;
}) {
  const t = useTranslations();

  return (
    <div className="rounded-md border border-border p-4">
      <h3 className="text-sm font-semibold text-ink">{t.dashboard.modelBreakdownTitle}</h3>

      <div className="mt-3 space-y-3">
        <BreakdownRow label={t.dashboard.lstmLabel} pct={lstmPct} />
        <BreakdownRow label={t.dashboard.cnnLabel} pct={cnnPct} />
      </div>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-surface-alt" aria-hidden="true">
        <div className="flex h-full w-full">
          <div className="h-full bg-accent" style={{ width: `${lstmWeight}%` }} />
          <div className="h-full bg-ink-muted/50" style={{ width: `${cnnWeight}%` }} />
        </div>
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-ink-muted">
        <span>LSTM {lstmWeight.toFixed(0)}%</span>
        <span>CNN {cnnWeight.toFixed(0)}%</span>
      </div>

      <p className="mt-3 text-xs text-ink-muted">{t.dashboard.fusionNote}</p>
    </div>
  );
}

function BreakdownRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-ink-muted">
        <span>{label}</span>
        <span className="tabular-nums">{pct.toFixed(1)}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
