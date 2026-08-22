/**
 * DMIF design tokens — "Ceylon Ledger" identity.
 *
 * Concept: a research-grade trading terminal with the warmth of a Ceylon
 * spice-trade ledger book rather than a generic dark AI dashboard. Light
 * theme reads like parchment and ink; dark theme reads like a terminal lit
 * by a single warm lamp, not cold blue/teal glass.
 *
 * These are the single source of truth for color — reference them via the
 * Tailwind classes generated from tailwind.config.ts, never hardcode hex
 * values in components.
 */

export const lightTheme = {
  bg: "#F6F0E4",
  surface: "#FFFFFF",
  surfaceAlt: "#EFE6D2",
  border: "#DACBAA",
  text: "#221A12",
  textMuted: "#6B5D48",
  accent: "#A8541F",
  accentContrast: "#FFFFFF",
  accentSoft: "#F1DCC5",
  up: "#1E7A54",
  upSoft: "#DCEFE4",
  down: "#A63333",
  downSoft: "#F3DCDC",
} as const;

export const darkTheme = {
  bg: "#141109",
  surface: "#1D1810",
  surfaceAlt: "#241E14",
  border: "#3A3021",
  text: "#F1E9D6",
  textMuted: "#B7A88C",
  accent: "#E2934F",
  accentContrast: "#1A1207",
  accentSoft: "#3A2A15",
  up: "#4FB98A",
  upSoft: "#1C3329",
  down: "#E2685F",
  downSoft: "#3A211D",
} as const;

export const fonts = {
  display: "var(--font-display)",
  body: "var(--font-body)",
} as const;

export type ThemeTokens = typeof lightTheme;
