"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CATEGORIES,
  MENU,
  categoryItemCount,
  featuredItems,
  itemsByCategory,
  type CategoryId,
  type MenuItem,
} from "@/data/menu";
import { createIdempotencyKey, createTicketId, formatPrice } from "@/lib/format";
import { useCart, type PlacedOrder } from "@/context/cart-context";
import { CartIcon } from "@/components/icons";
import { CartSheet } from "@/components/cart-sheet";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MenuListItem } from "@/components/menu-list-item";
import { ItemDetailSheet } from "@/components/item-detail-sheet";
import { SiteFooter } from "@/components/site-footer";
import { useI18n } from "@/i18n/i18n-provider";
import type { MsgKey } from "@/i18n/fr";
import type { StoredOrder } from "@/lib/order-types";
import { VENUE } from "@/lib/venue";

type MenuViewProps = {
  onPlaced: (order: PlacedOrder) => void;
};

export function MenuView({ onPlaced }: MenuViewProps) {
  const { t } = useI18n();
  const { lines, table, count, total, addItem, inc, dec } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [detail, setDetail] = useState<MenuItem | null>(null);
  const [activeCat, setActiveCat] = useState<CategoryId>(CATEGORIES[0].id);
  const sectionRefs = useRef<Partial<Record<CategoryId, HTMLElement | null>>>({});
  const popular = useMemo(() => featuredItems(), []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    CATEGORIES.forEach((category) => {
      const node = sectionRefs.current[category.id];
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveCat(category.id);
          });
        },
        { rootMargin: reduced ? "-20% 0px -55% 0px" : "-25% 0px -55% 0px", threshold: 0.01 },
      );
      observer.observe(node);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  function scrollToCategory(id: CategoryId) {
    setActiveCat(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function placeOrder(guestName: string, notes: string) {
    const payload = {
      ticketId: createTicketId(),
      table,
      guestName,
      notes,
      lines: lines.map((line) => ({
        itemId: line.itemId,
        qty: line.qty,
        flavor: line.flavor,
      })),
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": createIdempotencyKey(),
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 429) {
      throw new Error("rate_limited");
    }
    if (!response.ok) {
      throw new Error(response.status >= 500 ? "network" : "invalid");
    }

    const data: unknown = await response.json();
    const created =
      data && typeof data === "object" && "order" in data
        ? (data as { order: StoredOrder }).order
        : null;

    if (!created?.id) {
      throw new Error("invalid");
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
    <div className="relative min-h-dvh pb-28">
      <header className="relative overflow-hidden">
        <div className="relative h-[220px] w-full bg-accent">
          <Image
            src="/menu/hero-cup.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-5 pt-16 text-white">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/80">
              {t("menu.selfService", { n: table.label })}
            </p>
            <h1 className="mt-1 font-display text-4xl leading-none">Café Champ&apos;s</h1>
            <p className="mt-1 text-sm text-white/85">{VENUE.hours}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 px-4 py-3">
          <a
            href={VENUE.instagram}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-text shadow-card"
          >
            {t("menu.instagram")}
          </a>
          <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-text shadow-card">
            {t("menu.wifi")}
          </span>
          <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-text shadow-card">
            {t("menu.hours")}
          </span>
          <div className="ms-auto">
            <LanguageSwitcher compact />
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex size-10 items-center justify-center rounded-full border border-line bg-surface text-accent shadow-card"
            aria-label={t("menu.cart", { n: count })}
          >
            <CartIcon className="size-5" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </header>

      <section className="px-4 pt-2">
        <h2 className="font-display text-2xl text-ink-text">{t("menu.popular")}</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {popular.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setDetail(item)}
              className="relative h-[180px] w-[150px] shrink-0 overflow-hidden rounded-2xl bg-accent-soft shadow-card"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="150px"
                  loading="lazy"
                />
              ) : (
                <div className="flex size-full items-center justify-center font-display text-3xl text-accent">
                  C
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2.5 pb-2.5 pt-10 text-start text-white">
                <p className="line-clamp-2 text-xs font-semibold leading-snug">{item.name}</p>
                <p className="mt-0.5 text-[11px] opacity-90">{formatPrice(item.price)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <nav
        className="sticky top-0 z-20 mt-4 border-b border-line bg-bg/95 px-4 py-2 backdrop-blur-md"
        aria-label={t("menu.categories")}
      >
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((category) => {
            const selected = activeCat === category.id;
            const countItems = categoryItemCount(category.id);
            const thumb = MENU.find((item) => item.category === category.id && item.image)?.image;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => scrollToCategory(category.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs ${
                  selected
                    ? "border-accent bg-accent text-white"
                    : "border-line bg-surface text-ink-text"
                }`}
              >
                <span className="relative size-7 overflow-hidden rounded-full bg-accent-soft">
                  {thumb ? (
                    <Image src={thumb} alt="" fill className="object-cover" sizes="28px" />
                  ) : (
                    <span className="flex size-full items-center justify-center text-[10px] font-bold text-accent">
                      C
                    </span>
                  )}
                </span>
                <span className="whitespace-nowrap font-medium">
                  {t(`category.${category.id}` as MsgKey)}
                </span>
                <span className={selected ? "text-white/80" : "text-muted"}>{countItems}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mt-4 space-y-8 px-4">
        {CATEGORIES.map((category) => {
          const items = itemsByCategory(category.id);
          if (items.length === 0) return null;
          return (
            <section
              key={category.id}
              id={`cat-${category.id}`}
              ref={(node) => {
                sectionRefs.current[category.id] = node;
              }}
              className="scroll-mt-24"
            >
              <div className="mb-3 flex items-end justify-between gap-3">
                <h2 className="font-display text-3xl leading-none text-ink-text">
                  {t(`category.${category.id}` as MsgKey)}
                </h2>
                <p className="text-xs text-muted">
                  {t("menu.itemsCount", { n: items.length })}
                </p>
              </div>
              <div className="grid gap-3">
                {items.map((item) => (
                  <MenuListItem key={item.id} item={item} onOpen={setDetail} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-10">
        <SiteFooter />
      </div>

      {count > 0 ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[640px] px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="pointer-events-auto flex min-h-14 w-full items-center justify-between rounded-xl bg-accent px-5 text-white shadow-[0_12px_40px_rgba(47,59,42,0.28)]"
          >
            <span className="text-sm font-semibold">
              {t("cart.viewTotal", { n: count, total: formatPrice(total) })}
            </span>
          </button>
        </div>
      ) : null}

      {detail ? (
        <ItemDetailSheet item={detail} onClose={() => setDetail(null)} onAdd={addItem} />
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

      <Link href="/comptoir" className="sr-only">
        Comptoir
      </Link>
    </div>
  );
}
