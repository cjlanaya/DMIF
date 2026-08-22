import en, { type Dictionary } from "./dictionaries/en";
import si from "./dictionaries/si";
import ta from "./dictionaries/ta";
import type { Locale } from "./config";

export const dictionaries: Record<Locale, Dictionary> = { en, si, ta };

export type { Dictionary };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

export * from "./config";
