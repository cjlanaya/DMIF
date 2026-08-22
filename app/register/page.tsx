"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { AuthShell, FieldError, TextField } from "@/components/AuthCard";

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError(t.auth.errorMissingFields);
      return;
    }
    if (password.length < 8) {
      setError(t.auth.errorPasswordShort);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.auth.errorPasswordMismatch);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.status === 409) {
        setError(t.auth.errorEmailTaken);
        return;
      }
      if (!res.ok) {
        setError(t.auth.errorGeneric);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(t.auth.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-semibold text-ink">{t.auth.registerTitle}</h1>
      <p className="mt-1.5 text-sm text-ink-muted">{t.auth.registerSubtitle}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextField
          label={t.auth.nameLabel}
          placeholder={t.auth.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
        <TextField
          label={t.auth.confirmPasswordLabel}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        <FieldError message={error ?? undefined} />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast disabled:opacity-60"
        >
          {submitting ? t.auth.submitting : t.auth.submitRegister}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        {t.auth.haveAccount}{" "}
        <Link href="/login" className="font-medium text-accent">
          {t.auth.switchToLogin}
        </Link>
      </p>
    </AuthShell>
  );
}
