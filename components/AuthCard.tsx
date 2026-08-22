"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          {t.common.appName}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-lg border border-border bg-surface p-8 shadow-card animate-fade-up">
          {children}
        </div>
      </main>
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-down">{message}</p>;
}

export function TextField({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        {...props}
        className="w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent"
      />
    </label>
  );
}
