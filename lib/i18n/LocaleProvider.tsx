"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { dictionaries, type Dictionary } from "./index";
import { LOCALE_COOKIE, type Locale, locales } from "./config";

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = (next: Locale) => {
    if (!locales.includes(next)) return;
    setLocaleState(next);
    persistLocale(next);
  };

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dict: dictionaries[locale], setLocale }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function useTranslations() {
  return useLocale().dict;
}
