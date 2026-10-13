"use client";

import { useEffect, useRef, useState } from "react";
import type { PlacedOrder } from "@/context/cart-context";
import type { OrderStatus, StoredOrder } from "@/lib/order-types";
import { formatDateTimeTunis, formatPrice } from "@/lib/format";
import { notifyOrderReady, playReadyChime, vibrateReady } from "@/lib/ready-alert";
import { useI18n } from "@/i18n/i18n-provider";
import type { MsgKey } from "@/i18n/fr";
import { LanguageSwitcher } from "@/components/language-switcher";

type OrderTicketProps = {
  order: PlacedOrder;
  onStatus: (order: PlacedOrder) => void;
  onNewOrder: () => void;
};

const STEPS: OrderStatus[] = ["new", "preparing", "ready"];

const TITLE: Record<OrderStatus, MsgKey> = {
  new: "ticket.received",
  preparing: "ticket.preparing",
  ready: "ticket.ready",
  served: "ticket.served",
};

const COPY: Record<OrderStatus, MsgKey> = {
  new: "ticket.receivedCopy",
  preparing: "ticket.preparingCopy",
  ready: "ticket.readyCopy",
  served: "ticket.servedCopy",
};

function stepIndex(status: OrderStatus): number {
  if (status === "served") return STEPS.length;
  return Math.max(0, STEPS.indexOf(status));
}

export function OrderTicket({ order, onStatus, onNewOrder }: OrderTicketProps) {
  const { t } = useI18n();
  const current = stepIndex(order.status);
  const prevStatus = useRef(order.status);
  const [readyBanner, setReadyBanner] = useState(order.status === "ready");
  const [notifyState, setNotifyState] = useState<NotificationPermission | "unsupported">(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported",
  );

  useEffect(() => {
    if (!order.id || order.status === "served") return;
    const timer = window.setInterval(async () => {
      const response = await fetch(`/api/orders/${order.id}`, { cache: "no-store" });
      if (!response.ok) return;
      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || !("order" in data)) return;
      const next = (data as { order: StoredOrder }).order;
      const mapped: PlacedOrder = {
        id: next.id,
        ticketId: next.ticketId,
        table: next.table,
        guestName: next.guestName,
        notes: next.notes,
        lines: next.lines,
        total: next.total,
        createdAt: next.createdAt,
        status: next.status,
      };
      onStatus(mapped);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [order.id, order.status, onStatus]);

  useEffect(() => {
    const was = prevStatus.current;
    if (was !== "ready" && order.status === "ready") {
      setReadyBanner(true);
      playReadyChime();
      vibrateReady();
      void notifyOrderReady(t("ticket.readyNotifyTitle"), t("ticket.readyNotifyBody"));
    }
    prevStatus.current = order.status;
  }, [order.status, t]);

  async function enableNotifications() {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotifyState(permission);
  }

  return (
    <section className="flex min-h-dvh flex-col px-6 pb-10 pt-14">
      <div className="mb-4 flex justify-center">
        <LanguageSwitcher compact />
      </div>

      {readyBanner && order.status === "ready" ? (
        <div
          className="mb-4 rounded-2xl border border-accent bg-accent/15 px-4 py-4 text-center"
          role="status"
        >
          <p className="font-display text-2xl text-accent">{t("ticket.readyBanner")}</p>
          <p className="mt-1 text-sm text-ink-text">{t("ticket.readyCopy")}</p>
        </div>
      ) : null}

      <p className="text-center text-[11px] uppercase tracking-[0.32em] text-accent">
        {t("ticket.kicker")}
      </p>
      <h1 className="mt-3 text-center font-display text-4xl text-ink-text">
        {t(TITLE[order.status])}
      </h1>
      <p className="mx-auto mt-3 max-w-[18rem] text-center text-sm leading-relaxed text-muted">
        {t(COPY[order.status])}
      </p>

      {notifyState === "default" ? (
        <button
          type="button"
          onClick={() => void enableNotifications()}
          className="mx-auto mt-4 min-h-10 rounded-full border border-line px-4 text-xs text-muted"
        >
          {t("ticket.enableNotify")}
        </button>
      ) : null}

      <ol className="mx-auto mt-6 flex w-full max-w-xs items-center justify-between gap-1">
        {STEPS.map((step, index) => {
          const done = current >= index;
          const active = order.status === step || (order.status === "served" && step === "ready");
          const label =
            step === "new"
              ? t("ticket.statusReceived")
              : step === "preparing"
                ? t("ticket.statusPreparing")
                : t("ticket.statusReady");
          return (
            <li key={step} className="flex flex-1 flex-col items-center gap-2">
              <span
                className={`flex size-8 items-center justify-center rounded-full border text-[11px] ${
                  done ? "border-accent bg-accent text-white" : "border-line text-muted"
                } ${active ? "ring-2 ring-accent/30" : ""}`}
              >
                {index + 1}
              </span>
              <span className={`text-[11px] ${done ? "text-accent" : "text-muted"}`}>{label}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 rounded-[1.4rem] border border-line bg-surface px-5 py-6 shadow-card">
        <p className="text-center font-display text-4xl tracking-wide text-accent">
          {order.ticketId}
        </p>
        <p className="mt-4 text-center text-sm text-muted">
          {t("cart.table", { n: order.table.label })}
          {order.guestName ? ` · ${order.guestName}` : ""}
        </p>
        <p className="mt-1 text-center text-xs text-muted">{formatDateTimeTunis(order.createdAt)}</p>
        <ul className="mt-5 space-y-2 text-sm">
          {order.lines.map((line) => (
            <li key={line.key} className="flex justify-between gap-3">
              <span className="text-ink-text">
                {line.qty}× {line.name}
                {line.flavor ? ` (${line.flavor})` : ""}
              </span>
              <span className="text-muted">{formatPrice(line.price * line.qty)}</span>
            </li>
          ))}
        </ul>
        {order.notes ? (
          <p className="mt-4 text-sm italic text-muted">« {order.notes} »</p>
        ) : null}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">{t("cart.total")}</span>
          <span className="font-display text-2xl text-ink-text">{formatPrice(order.total)}</span>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted">{t("ticket.thanks")}</p>

      <button
        type="button"
        onClick={onNewOrder}
        className="mt-auto flex min-h-12 w-full items-center justify-center rounded-xl border border-line bg-surface text-sm font-medium text-ink-text"
      >
        {t("ticket.new")}
      </button>
    </section>
  );
}
