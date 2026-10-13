"use client";

import { useI18n, type Locale } from "@/i18n/i18n-provider";
import type { MsgKey } from "@/i18n/fr";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  const options: { id: Locale; key: MsgKey }[] = [
    { id: "fr", key: "lang.fr" },
    { id: "en", key: "lang.en" },
    { id: "ar-TN", key: "lang.ar" },
  ];

  return (
    <div className={`flex ${compact ? "gap-1" : "gap-2"}`} role="group" aria-label="Language">
      {options.map((option) => {
        const active = locale === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setLocale(option.id)}
            className={`min-h-10 rounded-full border px-3 text-xs tracking-wide ${
              active ? "border-accent bg-accent text-white" : "border-line bg-surface text-muted"
            }`}
          >
            {t(option.key)}
          </button>
        );
      })}
    </div>
  );
}
