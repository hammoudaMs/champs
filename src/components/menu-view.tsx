"use client";

import { useRef, useState } from "react";
import { PROMISES, itemsForFilter, type FilterId } from "@/data/menu";
import { createTicketId, formatPrice } from "@/lib/format";
import { useCart, type PlacedOrder } from "@/context/cart-context";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { CartIcon, ChefIcon, HeartIcon, LeafIcon } from "@/components/icons";
import { CartSheet } from "@/components/cart-sheet";
import { LanguageSwitcher } from "@/components/language-switcher";
import { CategoryFilter } from "@/components/category-filter";
import { ProductCard } from "@/components/product-card";
import { useI18n } from "@/i18n/i18n-provider";
import type { MsgKey } from "@/i18n/fr";
import type { StoredOrder } from "@/lib/order-types";

registerGsap();

type MenuViewProps = {
  onPlaced: (order: PlacedOrder) => void;
};

export function MenuView({ onPlaced }: MenuViewProps) {
  const root = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const { lines, table, count, total, addItem, inc, dec, qtyForItem, removeOneFromItem } = useCart();
  const [active, setActive] = useState<FilterId>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const items = itemsForFilter(active);
  const heading =
    active === "all" ? t("menu.filterAll") : t(`category.${active}` as MsgKey);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".product-card", {
          y: 12,
          duration: 0.32,
          stagger: 0.03,
          ease: "power2.out",
          clearProps: "transform",
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!badgeRef.current || count < 1) return;
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.7 },
        { scale: 1, duration: 0.22, ease: "back.out(2.5)", overwrite: "auto" },
      );
    },
    { dependencies: [count] },
  );

  async function placeOrder(guestName: string, notes: string) {
    const payload = {
      ticketId: createTicketId(),
      table,
      guestName,
      notes,
      lines: lines.map((line) => ({ ...line })),
      total,
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("order");
    }

    const data: unknown = await response.json();
    const created =
      data && typeof data === "object" && "order" in data
        ? (data as { order: StoredOrder }).order
        : null;

    if (!created?.id) {
      throw new Error("order");
    }

    onPlaced({
      id: created.id,
      ticketId: created.ticketId,
      table: created.table,
      guestName: created.guestName,
      notes: created.notes,
      lines: created.lines,
      total: created.total,
      createdAt: created.createdAt,
      status: created.status,
    });
  }

  return (
    <div ref={root} className="relative min-h-dvh pb-28">
      <header className="menu-head sticky top-0 z-20 border-b border-[var(--gold-dim)] bg-ink/90 px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold">
              {t("menu.selfService", { n: table.label })}
            </p>
            <h1 className="font-display text-[1.85rem] leading-none text-cream">
              Café Champ&apos;s
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex size-12 items-center justify-center rounded-full border border-[var(--line)] text-gold"
            aria-label={t("menu.cart", { n: count })}
          >
            <CartIcon className="size-5" />
            {count > 0 ? (
              <span
                ref={badgeRef}
                className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-ink"
              >
                {count}
              </span>
            ) : null}
          </button>
        </div>
        <div className="mt-3">
          <LanguageSwitcher compact />
        </div>
        <div className="mt-3">
          <CategoryFilter
            active={active}
            onChange={setActive}
            open={filterOpen}
            onOpen={() => setFilterOpen(true)}
            onClose={() => setFilterOpen(false)}
          />
        </div>
      </header>

      <section className="px-4 pt-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl leading-none text-cream">{heading}</h2>
          <p className="text-xs text-muted">{t("menu.results", { n: items.length })}</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              qty={qtyForItem(item.id)}
              onAdd={addItem}
              onRemove={removeOneFromItem}
            />
          ))}
        </div>
      </section>

      <section className="mt-6 flex gap-2 overflow-x-auto px-4 pb-6">
        {PROMISES.map((promise) => (
          <div
            key={promise.id}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[var(--line)] px-3"
          >
            {promise.id === "homemade" ? (
              <ChefIcon className="size-3.5 text-gold" />
            ) : promise.id === "service" ? (
              <HeartIcon className="size-3.5 text-gold" />
            ) : (
              <LeafIcon className="size-3.5 text-gold" />
            )}
            <p className="text-[10px] uppercase tracking-[0.12em] text-gold">
              {t(`promise.${promise.id}` as MsgKey)}
            </p>
          </div>
        ))}
      </section>

      {count > 0 ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="pointer-events-auto flex min-h-14 w-full items-center justify-between rounded-full bg-gold px-5 text-ink shadow-[0_12px_40px_rgba(227,154,42,0.28)]"
          >
            <span className="text-sm font-semibold">
              {t("menu.viewCart", { n: count })}
            </span>
            <span className="font-display text-xl">{formatPrice(total)}</span>
          </button>
        </div>
      ) : null}

      {cartOpen ? (
        <CartSheet
          lines={lines}
          table={table}
          total={total}
          onClose={() => setCartOpen(false)}
          onInc={inc}
          onDec={dec}
          onSubmit={placeOrder}
        />
      ) : null}
    </div>
  );
}
