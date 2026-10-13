"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { OrderStatus, StoredOrder } from "@/lib/order-types";
import { formatClock, formatPrice } from "@/lib/format";
import { useI18n } from "@/i18n/i18n-provider";
import type { MsgKey } from "@/i18n/fr";
import { LanguageSwitcher } from "@/components/language-switcher";
import { QrTables } from "@/app/comptoir/qr-tables";

const COLUMNS: { status: OrderStatus; title: MsgKey }[] = [
  { status: "new", title: "counter.new" },
  { status: "preparing", title: "counter.preparing" },
  { status: "ready", title: "counter.ready" },
];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  new: "preparing",
  preparing: "ready",
  ready: "served",
};

const ACTION_LABEL: Partial<Record<OrderStatus, MsgKey>> = {
  new: "counter.prepare",
  preparing: "counter.markReady",
  ready: "counter.served",
};

type Tab = "orders" | "qr";

export function CounterBoard() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/orders", { cache: "no-store" });
      if (response.status === 401) {
        window.location.reload();
        return;
      }
      if (!response.ok) throw new Error("load");
      const data: unknown = await response.json();
      const list =
        data && typeof data === "object" && Array.isArray((data as { orders?: unknown }).orders)
          ? (data as { orders: StoredOrder[] }).orders
          : [];
      setOrders(list);
      setError("");
    } catch {
      setError(t("counter.loadError"));
    }
  }, [t]);

  useEffect(() => {
    if (tab !== "orders") return;
    const start = window.setTimeout(() => {
      void load();
    }, 0);
    const timer = window.setInterval(() => {
      void load();
    }, 2500);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [load, tab]);

  async function advance(order: StoredOrder) {
    const status = NEXT_STATUS[order.status];
    if (!status) return;
    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      await load();
    }
  }

  async function logout() {
    await fetch("/api/comptoir/logout", { method: "POST" });
    window.location.reload();
  }

  const grouped = useMemo(() => {
    return COLUMNS.map((column) => ({
      ...column,
      items: orders.filter((order) => order.status === column.status),
    }));
  }, [orders]);

  const openCount = orders.filter((order) => order.status !== "served").length;

  return (
    <div className="min-h-dvh bg-ink px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))] md:px-8">
      <header className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Café Champ&apos;s</p>
          <h1 className="font-display text-4xl text-cream md:text-5xl">{t("counter.title")}</h1>
          <p className="mt-1 text-sm text-muted">{t("counter.live")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LanguageSwitcher compact />
          {tab === "orders" ? (
            <p className="text-sm text-gold">{t("counter.open", { n: openCount })}</p>
          ) : null}
          <button
            type="button"
            onClick={() => void logout()}
            className="min-h-10 rounded-full border border-[var(--line)] px-4 text-sm text-muted"
          >
            {t("counter.logout")}
          </button>
        </div>
      </header>

      <div
        className="mx-auto mt-5 flex max-w-6xl gap-1 rounded-full border border-[var(--line)] p-1"
        role="tablist"
        aria-label={t("counter.title")}
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "orders"}
          onClick={() => setTab("orders")}
          className={`min-h-10 flex-1 rounded-full px-4 text-sm ${
            tab === "orders" ? "bg-accent font-semibold text-white" : "text-muted"
          }`}
        >
          {t("counter.tabOrders")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "qr"}
          onClick={() => setTab("qr")}
          className={`min-h-10 flex-1 rounded-full px-4 text-sm ${
            tab === "qr" ? "bg-accent font-semibold text-white" : "text-muted"
          }`}
        >
          {t("counter.tabQr")}
        </button>
      </div>

      {tab === "qr" ? (
        <div className="mt-6">
          <QrTables />
        </div>
      ) : (
        <>
          {error ? (
            <p className="mx-auto mt-4 max-w-6xl text-sm text-[var(--danger)]">{error}</p>
          ) : null}

          <div className="mx-auto mt-6 grid max-w-6xl gap-4 md:grid-cols-3">
            {grouped.map((column) => (
              <section key={column.status} className="rounded-[1.4rem] border border-[var(--line)] p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <h2 className="font-display text-2xl text-gold">{t(column.title)}</h2>
                  <span className="text-sm text-muted">{column.items.length}</span>
                </div>
                <div className="grid gap-3">
                  {column.items.length === 0 ? (
                    <p className="px-2 py-8 text-center text-sm text-muted">{t("counter.empty")}</p>
                  ) : (
                    column.items.map((order) => (
                      <article key={order.id} className="rounded-2xl bg-ink-soft px-4 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display text-2xl text-cream">{order.ticketId}</p>
                            <p className="text-sm text-gold">
                              {t("cart.table", { n: order.table.label })}
                            </p>
                            <p className="text-[11px] text-muted">{order.table.id}</p>
                          </div>
                          <p className="text-sm text-muted">{formatClock(new Date(order.createdAt))}</p>
                        </div>
                        <ul className="mt-3 space-y-1 text-sm">
                          {order.lines.map((line) => (
                            <li key={line.key} className="flex justify-between gap-3 text-cream">
                              <span>
                                {line.qty}× {line.name}
                                {line.flavor ? ` (${line.flavor})` : ""}
                              </span>
                              <span className="text-gold">
                                {formatPrice(line.price * line.qty)}
                              </span>
                            </li>
                          ))}
                        </ul>
                        {order.guestName ? (
                          <p className="mt-2 text-sm text-muted">{order.guestName}</p>
                        ) : null}
                        {order.notes ? (
                          <p className="mt-1 text-sm italic text-muted">« {order.notes} »</p>
                        ) : null}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-display text-xl text-gold">
                            {formatPrice(order.total)}
                          </span>
                          {ACTION_LABEL[order.status] ? (
                            <button
                              type="button"
                              onClick={() => void advance(order)}
                              className="min-h-11 rounded-full bg-accent px-4 text-sm font-semibold text-white"
                            >
                              {t(ACTION_LABEL[order.status]!)}
                            </button>
                          ) : null}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
