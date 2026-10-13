"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CartLine } from "@/context/cart-context";
import type { TableRef } from "@/lib/table";
import { formatPrice } from "@/lib/format";
import { CloseIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { useI18n } from "@/i18n/i18n-provider";

type CartSheetProps = {
  lines: CartLine[];
  table: TableRef;
  total: number;
  onClose: () => void;
  onInc: (key: string) => void;
  onDec: (key: string) => void;
  onSubmit: (guestName: string, notes: string) => Promise<void>;
};

export function CartSheet({
  lines,
  table,
  total,
  onClose,
  onInc,
  onDec,
  onSubmit,
}: CartSheetProps) {
  const { t } = useI18n();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [guestName, setGuestName] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sentOk, setSentOk] = useState(false);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit() {
    if (sending || lines.length === 0) return;
    setSending(true);
    setSendError("");
    try {
      await onSubmit(guestName.trim(), notes.trim());
      setSentOk(true);
    } catch (error) {
      const code = error instanceof Error ? error.message : "network";
      if (code === "rate_limited") setSendError(t("cart.rateLimited"));
      else if (code === "invalid") setSendError(t("cart.invalid"));
      else setSendError(t("cart.networkError"));
      setSending(false);
    }
  }

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-ink-text/40">
      <button
        type="button"
        className="absolute inset-0"
        aria-label={t("cart.closeCart")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[86dvh] w-full overflow-y-auto rounded-t-[1.4rem] bg-surface px-5 pb-8 pt-5 shadow-card"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id={titleId} className="font-display text-3xl text-ink-text">
            {t("cart.title")}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-full border border-line text-accent"
            aria-label={t("cart.close")}
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="py-8 text-center text-muted">{t("cart.empty")}</p>
        ) : (
          <>
            <ul className="divide-y divide-line">
              {lines.map((line) => (
                <li key={line.key} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.95rem] font-medium text-ink-text">{line.name}</p>
                    {line.flavor ? <p className="text-xs text-accent">{line.flavor}</p> : null}
                    <p className="text-sm text-muted">{formatPrice(line.price)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onDec(line.key)}
                      className="flex size-11 items-center justify-center rounded-full border border-line text-accent"
                      aria-label={t("cart.remove")}
                    >
                      <MinusIcon className="size-4" />
                    </button>
                    <span className="w-6 text-center text-sm">{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => onInc(line.key)}
                      className="flex size-11 items-center justify-center rounded-full border border-line text-accent"
                      aria-label={t("cart.add")}
                    >
                      <PlusIcon className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-line bg-bg px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                  {t("cart.tableQr")}
                </p>
                <p className="mt-1 font-display text-2xl leading-none text-ink-text">
                  {t("cart.table", { n: table.label })}
                </p>
              </div>
              <label className="grid gap-1 text-sm">
                <span className="text-muted">{t("cart.name")}</span>
                <input
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  className="min-h-12 rounded-xl border border-line bg-bg px-4 text-ink-text outline-none focus:border-accent"
                  placeholder={t("cart.namePh")}
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-muted">{t("cart.note")}</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={2}
                  className="rounded-xl border border-line bg-bg px-4 py-3 text-ink-text outline-none focus:border-accent"
                  placeholder={t("cart.notePh")}
                />
              </label>
            </div>

            {sendError ? <p className="mt-3 text-sm text-danger">{sendError}</p> : null}
            {sentOk ? <p className="mt-3 text-sm text-accent">{t("cart.sendOk")}</p> : null}

            <div className="mt-5 flex items-center justify-between text-ink-text">
              <span className="text-sm uppercase tracking-[0.18em] text-muted">{t("cart.total")}</span>
              <span className="font-display text-3xl">{formatPrice(total)}</span>
            </div>

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={sending || sentOk}
              className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-accent text-[0.95rem] font-semibold text-white disabled:opacity-60"
            >
              {sending ? t("cart.sending") : t("cart.send")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
