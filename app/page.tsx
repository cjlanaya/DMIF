"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

export default function LandingPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            {t.common.appName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border ledger-rules">
          <div className="mx-auto max-w-5xl px-6 py-20 md:px-10 md:py-28 animate-fade-up">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {t.landing.heroEyebrow}
            </p>
            <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-6xl">
              {t.landing.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
              {t.landing.heroSubtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-5">
              <Link
                href="/login"
                className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-contrast shadow-card transition-transform hover:-translate-y-0.5"
              >
                {t.landing.ctaPrimary}
              </Link>
              <Link
                href="/register"
                className="rounded-md border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent"
              >
                {t.landing.ctaSecondary}
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              title={t.landing.featureDualModelTitle}
              desc={t.landing.featureDualModelDesc}
            />
            <FeatureCard title={t.landing.featureCseTitle} desc={t.landing.featureCseDesc} />
            <FeatureCard
              title={t.landing.featureResearchTitle}
              desc={t.landing.featureResearchDesc}
            />
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-border px-6 py-6 md:px-10">
        <p className="max-w-3xl text-xs leading-relaxed text-ink-muted">
          {t.landing.disclaimer}
        </p>
        <p className="mt-2 text-xs text-ink-muted/80">{t.landing.footerRights}</p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{desc}</p>
    </div>
  );
}
