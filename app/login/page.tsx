"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { AuthShell, FieldError, TextField } from "@/components/AuthCard";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(t.auth.errorMissingFields);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 401) {
        setError(t.auth.errorInvalidCredentials);
        return;
      }
      if (!res.ok) {
        setError(t.auth.errorGeneric);
        return;
      }
      const next = searchParams.get("next") || "/dashboard";
      router.push(next);
      router.refresh();
    } catch {
      setError(t.auth.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-semibold text-ink">{t.auth.loginTitle}</h1>
      <p className="mt-1.5 text-sm text-ink-muted">{t.auth.loginSubtitle}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextField
          label={t.auth.emailLabel}
          type="email"
          placeholder={t.auth.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextField
          label={t.auth.passwordLabel}
          type="password"
          placeholder={t.auth.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <FieldError message={error ?? undefined} />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast disabled:opacity-60"
        >
          {submitting ? t.auth.submitting : t.auth.submitLogin}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        {t.auth.noAccount}{" "}
        <Link href="/register" className="font-medium text-accent">
          {t.auth.switchToRegister}
        </Link>
      </p>
    </AuthShell>
  );
}
