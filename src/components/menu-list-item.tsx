"use client";

import Image from "next/image";
import type { MenuItem } from "@/data/menu";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/i18n/i18n-provider";

type MenuListItemProps = {
  item: MenuItem;
  onOpen: (item: MenuItem) => void;
};

export function MenuListItem({ item, onOpen }: MenuListItemProps) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="flex w-full gap-3 rounded-2xl bg-surface p-4 text-start shadow-card"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {item.badge === "signature" ? (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-white">
              {t("menu.chefChoice")}
            </span>
          ) : null}
          {item.badge === "nouveau" ? (
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
              {t("menu.new")}
            </span>
          ) : null}
        </div>
        <h3 className="mt-1 text-[0.95rem] font-semibold uppercase tracking-wide text-ink-text">
          {item.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-ink-text">{formatPrice(item.price)}</p>
        {item.description ? (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{item.description}</p>
        ) : null}
      </div>
      <div className="relative size-24 shrink-0">
        <div className="relative size-24 overflow-hidden rounded-xl bg-accent-soft">
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              fill
              className="object-cover"
              sizes="96px"
              loading="lazy"
            />
          ) : (
            <div className="flex size-full items-center justify-center font-display text-2xl text-accent">
              C
            </div>
          )}
        </div>
        <span className="absolute -bottom-1 -end-1 flex size-8 items-center justify-center rounded-full bg-accent text-lg leading-none text-white shadow-card">
          +
        </span>
      </div>
    </button>
  );
}
