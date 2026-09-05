"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/i18n-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { CounterBoard } from "@/app/comptoir/counter-board";

export function ComptoirGate() {
  const { t } = useI18n();
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetch("/api/comptoir/session", { cache: "no-store" }).then((response) => {
      setUnlocked(response.ok);
    });
  }, []);

  async function submit(event?: { preventDefault: () => void }) {
    event?.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const response = await fetch("/api/comptoir/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    setBusy(false);
    if (!response.ok) {
      setError(t("lock.error"));
      setPin("");
      return;
    }
    setUnlocked(true);
  }

  if (unlocked === null) {
    return <div className="min-h-dvh bg-ink" />;
  }

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6">
        <div className="mb-8 flex justify-center">
          <LanguageSwitcher />
        </div>
        <p className="text-center text-[11px] uppercase tracking-[0.32em] text-gold">
          Café Champ&apos;s
        </p>
        <h1 className="mt-2 text-center font-display text-4xl text-cream">{t("lock.title")}</h1>
        <p className="mt-2 text-center text-sm text-muted">{t("lock.copy")}</p>
        <form className="mt-8 grid gap-3" onSubmit={(event) => void submit(event)}>
          <label className="grid gap-1 text-sm">
            <span className="text-muted">{t("lock.pin")}</span>
            <input
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              className="min-h-12 rounded-2xl border border-[var(--line)] bg-ink-soft px-4 text-center text-lg tracking-[0.4em] text-cream outline-none focus:border-gold"
            />
          </label>
          {error ? <p className="text-center text-sm text-[var(--danger)]">{error}</p> : null}
          <button
            type="submit"
            disabled={busy || pin.length < 4}
            className="mt-2 flex min-h-12 items-center justify-center rounded-full bg-gold font-semibold text-ink disabled:opacity-50"
          >
            {t("lock.enter")}
          </button>
        </form>
      </div>
    );
  }

  return <CounterBoard />;
}
