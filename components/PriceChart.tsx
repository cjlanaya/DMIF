"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";
import { useTheme } from "@/lib/ThemeProvider";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import type { OHLCRecord } from "@/lib/chart-data";

function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function PriceChart({ data }: { data: OHLCRecord[] }) {
  const t = useTranslations();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const bg = readCssVar("--color-surface");
    const text = readCssVar("--color-text");
    const border = readCssVar("--color-border");
    const up = readCssVar("--color-up");
    const down = readCssVar("--color-down");

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: bg },
        textColor: text,
        fontFamily: "var(--font-body)",
      },
      grid: {
        vertLines: { color: border },
        horzLines: { color: border },
      },
      rightPriceScale: { borderColor: border },
      timeScale: { borderColor: border, timeVisible: false },
      crosshair: { mode: 0 },
      height: 420,
      autoSize: true,
    });

    const series = chart.addCandlestickSeries({
      upColor: up,
      downColor: down,
      borderUpColor: up,
      borderDownColor: down,
      wickUpColor: up,
      wickDownColor: down,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
    // theme change requires re-creating the chart to re-read CSS vars
  }, [theme]);

  useEffect(() => {
    if (!seriesRef.current) return;
    const formatted = data
      .map((d) => ({
        time: d.Date,
        open: d.Open,
        high: d.High,
        low: d.Low,
        close: d.Close,
      }))
      .sort((a, b) => (a.time < b.time ? -1 : 1));
    seriesRef.current.setData(formatted);
    chartRef.current?.timeScale().fitContent();
  }, [data, theme]);

  if (data.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-md border border-dashed border-border text-sm text-ink-muted">
        {t.dashboard.noChartData}
      </div>
    );
  }

  return <div ref={containerRef} className="w-full overflow-hidden rounded-md" />;
}
