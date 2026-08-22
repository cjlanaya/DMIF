"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function DashboardHeader({ userName }: { userName: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        pathname === href ? "text-accent" : "text-ink-muted hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-10">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-display text-lg font-semibold text-ink">
            {t.common.appName}
          </Link>
          <nav className="flex items-center gap-6">
            {navLink("/dashboard", t.nav.dashboard)}
            {navLink("/dashboard/history", t.nav.history)}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-ink-muted sm:inline">{userName}</span>
          <LanguageSwitcher />
          <ThemeSwitcher />
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-ink hover:border-down hover:text-down transition-colors"
          >
            {t.common.logout}
          </button>
        </div>
      </div>
    </header>
  );
}
