"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

export function CompanySelector({
  companies,
  value,
  onChange,
}: {
  companies: string[];
  value: string;
  onChange: (ticker: string) => void;
}) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query) return companies;
    const q = query.toUpperCase();
    return companies.filter((c) => c.includes(q));
  }, [companies, query]);

  function handleSelect(ticker: string) {
    onChange(ticker);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {t.dashboard.selectCompanyLabel}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-md border border-border bg-surface px-3 py-2.5 text-left text-sm text-ink hover:border-accent"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="font-semibold tabular-nums">{value || "—"}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full rounded-md border border-border bg-surface shadow-card">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.dashboard.searchPlaceholder}
            className="w-full border-b border-border bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-muted"
          />
          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {filtered.map((ticker) => (
              <li key={ticker}>
                <button
                  type="button"
                  onClick={() => handleSelect(ticker)}
                  className={`block w-full px-3 py-1.5 text-left text-sm tabular-nums hover:bg-surface-alt ${
                    ticker === value ? "text-accent font-semibold" : "text-ink"
                  }`}
                >
                  {ticker}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-ink-muted">—</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
