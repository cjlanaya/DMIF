import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { ThemeProvider, THEME_COOKIE } from "@/lib/ThemeProvider";
import { LOCALE_COOKIE, defaultLocale, locales, type Locale } from "@/lib/i18n/config";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DMIF — Dual-Modal Intelligence Framework",
  description:
    "CSE stock direction research prototype fusing LSTM and CNN model predictions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value as Locale | undefined;
  const locale: Locale = localeCookie && locales.includes(localeCookie) ? localeCookie : defaultLocale;
  const themeCookie = cookieStore.get(THEME_COOKIE)?.value;
  const theme = themeCookie === "dark" ? "dark" : "light";

  return (
    <html lang={locale} className={theme === "dark" ? "dark" : undefined}>
      <body className={`${fraunces.variable} ${plexSans.variable} font-body antialiased`}>
        <ThemeProvider initialTheme={theme}>
          <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
