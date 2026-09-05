"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import QRCode from "qrcode";
import { guestMenuUrl, tableIdFromNumber } from "@/lib/table";
import { useI18n } from "@/i18n/i18n-provider";

function parseTableNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d{1,2}$/.test(trimmed)) return null;
  const n = Number(trimmed);
  if (!Number.isInteger(n) || n < 1 || n > 99) return null;
  return n;
}

function subscribeOrigin(): () => void {
  return () => undefined;
}

function readOrigin(): string {
  return window.location.origin;
}

export function QrTables() {
  const { t } = useI18n();
  const [raw, setRaw] = useState("4");
  const [qr, setQr] = useState<{ menuUrl: string; dataUrl: string }>({
    menuUrl: "",
    dataUrl: "",
  });
  const origin = useSyncExternalStore(subscribeOrigin, readOrigin, () => "");

  const tableNumber = useMemo(() => parseTableNumber(raw), [raw]);
  const tableId = tableNumber ? tableIdFromNumber(tableNumber) : null;
  const menuUrl = tableId && origin ? guestMenuUrl(origin, tableId) : "";
  const dataUrl = qr.menuUrl === menuUrl ? qr.dataUrl : "";

  useEffect(() => {
    if (!menuUrl) return;
    let cancelled = false;
    void QRCode.toDataURL(menuUrl, {
      margin: 2,
      width: 360,
      color: { dark: "#070605", light: "#ffffff" },
      errorCorrectionLevel: "M",
    }).then((url) => {
      if (!cancelled) setQr({ menuUrl, dataUrl: url });
    });
    return () => {
      cancelled = true;
    };
  }, [menuUrl]);

  function downloadPng() {
    if (!dataUrl || !tableNumber) return;
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = `champs-table-${String(tableNumber).padStart(2, "0")}.png`;
    anchor.click();
  }

  function printCard() {
    window.print();
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-[1.4rem] border border-[var(--line)] bg-ink-soft p-5 md:p-6">
        <h2 className="font-display text-3xl text-cream">{t("qr.title")}</h2>
        <p className="mt-1 text-sm text-muted">{t("qr.copy")}</p>

        <label className="mt-5 grid gap-1.5 text-sm">
          <span className="text-muted">{t("qr.table")}</span>
          <input
            value={raw}
            onChange={(event) => setRaw(event.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            className="min-h-12 max-w-[8rem] rounded-2xl border border-[var(--line)] bg-ink px-4 text-center text-lg tracking-wide text-cream outline-none focus:border-gold"
            aria-invalid={tableNumber === null}
          />
        </label>
        {tableNumber === null ? (
          <p className="mt-2 text-sm text-[var(--danger)]">{t("qr.invalid")}</p>
        ) : null}

        {tableNumber && dataUrl ? (
          <div
            id="qr-print-card"
            className="mt-6 flex flex-col items-center rounded-[1.2rem] border border-[var(--line)] bg-cream px-6 py-7 text-ink"
          >
            <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(7,6,5,0.55)]">
              Café Champ&apos;s
            </p>
            <p className="mt-1 font-display text-3xl leading-none">
              {t("cart.table", { n: String(tableNumber) })}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrl}
              alt=""
              width={220}
              height={220}
              className="mt-4 size-[220px] rounded-xl bg-white p-2"
            />
            <p className="mt-3 break-all text-center text-[11px] text-[rgba(7,6,5,0.55)]">
              {menuUrl}
            </p>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!dataUrl}
            onClick={downloadPng}
            className="min-h-11 rounded-full bg-gold px-5 text-sm font-semibold text-ink disabled:opacity-40"
          >
            {t("qr.download")}
          </button>
          <button
            type="button"
            disabled={!dataUrl}
            onClick={printCard}
            className="min-h-11 rounded-full border border-[var(--line)] px-5 text-sm text-cream disabled:opacity-40"
          >
            {t("qr.print")}
          </button>
        </div>

        {menuUrl ? (
          <p className="mt-4 text-xs text-muted">
            <span className="text-gold">{t("qr.link")}: </span>
            <span className="break-all">{menuUrl}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
