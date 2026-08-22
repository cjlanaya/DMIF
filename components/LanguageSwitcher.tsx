"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { locales, localeLabels } from "@/lib/i18n/config";

export function LanguageSwitcher() {
  const { locale, setLocale, dict } = useLocale();

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">{dict.common.language}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
        className="rounded-md border border-border bg-surface px-2 py-1.5 text-ink text-sm cursor-pointer hover:border-accent transition-colors"
        aria-label={dict.common.language}
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeLabels[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
