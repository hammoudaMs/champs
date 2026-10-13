"use client";

import { useI18n } from "@/i18n/i18n-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SiteFooter } from "@/components/site-footer";

export function ScanTableGate() {
  const { t } = useI18n();

  return (
    <main className="app-frame flex min-h-dvh flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
          Café Champ&apos;s
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink-text">
          {t("scan.title")}
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          {t("scan.copy")}
        </p>
        <div className="mt-8 flex size-24 items-center justify-center rounded-3xl border border-line bg-surface shadow-card">
          <span className="font-display text-3xl text-accent">QR</span>
        </div>
        <div className="mt-8">
          <LanguageSwitcher />
        </div>
      </div>
      <SiteFooter compact />
    </main>
  );
}
