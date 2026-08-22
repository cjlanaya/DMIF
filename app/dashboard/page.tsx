"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { CompanySelector } from "@/components/CompanySelector";
import { PriceChart } from "@/components/PriceChart";
import { PredictionPanel } from "@/components/PredictionPanel";
import { AccuracyPanel } from "@/components/AccuracyPanel";
import type { OHLCRecord } from "@/lib/chart-data";

export default function DashboardPage() {
  const t = useTranslations();
  const [companies, setCompanies] = useState<string[]>([]);
  const [ticker, setTicker] = useState<string>("");
  const [chartData, setChartData] = useState<OHLCRecord[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((body: { companies: string[] }) => {
        setCompanies(body.companies);
        if (body.companies.length > 0) setTicker(body.companies[0]);
      });
  }, []);

  useEffect(() => {
    if (!ticker) return;
    setChartLoading(true);
    fetch(`/api/chart-data/${encodeURIComponent(ticker)}`)
      .then((res) => res.json())
      .then((body: { data: OHLCRecord[] }) => setChartData(body.data ?? []))
      .finally(() => setChartLoading(false));
  }, [ticker]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">{t.dashboard.title}</h1>
      </div>

      <div className="max-w-xs">
        <CompanySelector companies={companies} value={ticker} onChange={setTicker} />
      </div>

      {ticker ? (
        <>
          <section className="rounded-lg border border-border bg-surface p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">
              {t.dashboard.chartTitle} — <span className="tabular-nums">{ticker}</span>
            </h2>
            {chartLoading ? (
              <div className="flex h-[420px] items-center justify-center text-sm text-ink-muted">
                {t.common.loading}
              </div>
            ) : (
              <PriceChart data={chartData} />
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
            <PredictionPanel key={ticker} ticker={ticker} />
            <AccuracyPanel ticker={ticker} />
          </div>
        </>
      ) : (
        <p className="text-sm text-ink-muted">{t.dashboard.selectCompanyPrompt}</p>
      )}
    </div>
  );
}
