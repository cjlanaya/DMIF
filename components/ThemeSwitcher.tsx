"use client";

import { useTheme } from "@/lib/ThemeProvider";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-ink hover:border-accent transition-colors"
      aria-label={t.common.theme}
    >
      {theme === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span>{theme === "dark" ? t.common.dark : t.common.light}</span>
    </button>
  );
}
