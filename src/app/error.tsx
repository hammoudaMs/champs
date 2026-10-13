"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/i18n-provider";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="app-frame flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl text-ink-text">{t("error.title")}</h1>
      <p className="mt-3 max-w-sm text-sm text-muted">{t("error.copy")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="min-h-12 rounded-xl border border-line bg-surface px-5 text-sm font-semibold text-ink-text"
        >
          Retry
        </button>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-white"
        >
          {t("error.back")}
        </Link>
      </div>
    </main>
  );
}
