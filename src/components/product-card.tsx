"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { MenuItem } from "@/data/menu";
import { formatPrice } from "@/lib/format";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { useI18n } from "@/i18n/i18n-provider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

type ProductCardProps = {
  item: MenuItem;
  qty: number;
  onAdd: (item: MenuItem, flavor?: string) => void;
  onRemove: (itemId: string) => void;
};

export function ProductCard({ item, qty, onAdd, onRemove }: ProductCardProps) {
  const { t } = useI18n();
  const addRef = useRef<HTMLButtonElement>(null);
  const flavors = item.flavors ?? [];
  const [picked, setPicked] = useState(flavors[0]);

  function bump(target: HTMLElement | null) {
    if (!target) return;
    gsap.fromTo(
      target,
      { scale: 0.88 },
      { scale: 1, duration: 0.2, ease: "back.out(2.2)", overwrite: "auto" },
    );
  }

  function add() {
    onAdd(item, picked);
    bump(addRef.current);
  }

  return (
    <article className="product-card flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-ink-soft">
      {item.image ? (
        <div className="relative h-[7.25rem]">
          <Image
            src={item.image}
            alt=""
            fill
            className="object-cover object-center"
            sizes="180px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-soft via-transparent to-transparent" />
        </div>
      ) : (
        <div className="h-2 bg-[linear-gradient(90deg,transparent,rgba(227,154,42,0.35),transparent)]" />
      )}
      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2">
        {item.badge === "signature" ? (
          <p className="font-script text-[1.05rem] leading-none text-gold">{t("menu.signature")}</p>
        ) : null}
        <div className="mt-0.5 flex items-start gap-1">
          <h3 className="min-w-0 flex-1 text-[0.86rem] font-medium leading-snug text-cream">
            {item.name}
          </h3>
          {item.badge === "nouveau" ? (
            <span className="shrink-0 rounded-full border border-gold px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-gold">
              {t("menu.new")}
            </span>
          ) : null}
        </div>
        {flavors.length > 0 ? (
          <div className="mt-1.5 flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {flavors.map((flavor) => {
              const selected = picked === flavor;
              return (
                <button
                  key={flavor}
                  type="button"
                  onClick={() => setPicked(flavor)}
                  className={`h-8 shrink-0 touch-manipulation rounded-full border px-2.5 text-[10px] ${
                    selected ? "border-gold bg-gold text-ink" : "border-[var(--line)] text-cream"
                  }`}
                >
                  {flavor}
                </button>
              );
            })}
          </div>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <p className="text-sm text-gold">{formatPrice(item.price)}</p>
          {qty > 0 ? (
            <div className="flex h-11 items-center rounded-full bg-gold text-ink">
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="flex size-11 touch-manipulation items-center justify-center"
                aria-label={t("cart.remove")}
              >
                <MinusIcon className="size-4" />
              </button>
              <span className="min-w-5 text-center text-sm font-semibold">{qty}</span>
              <button
                ref={addRef}
                type="button"
                onClick={add}
                className="flex size-11 touch-manipulation items-center justify-center"
                aria-label={t("cart.add")}
              >
                <PlusIcon className="size-4" />
              </button>
            </div>
          ) : (
            <button
              ref={addRef}
              type="button"
              onClick={add}
              className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full bg-gold text-ink active:scale-90"
              aria-label={t("menu.add", { name: item.name })}
            >
              <PlusIcon className="size-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
