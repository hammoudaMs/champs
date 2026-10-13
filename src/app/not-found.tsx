"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/i18n-provider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <main className="app-frame flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
        Café Champ&apos;s
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink-text">{t("notFound.title")}</h1>
      <p className="mt-3 max-w-sm text-sm text-muted">{t("notFound.copy")}</p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-white"
      >
        {t("notFound.back")}
      </Link>
    </main>
  );
}
