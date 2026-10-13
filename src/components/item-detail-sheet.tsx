"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import type { MenuItem } from "@/data/menu";
import { formatPrice } from "@/lib/format";
import { CloseIcon } from "@/components/icons";
import { useI18n } from "@/i18n/i18n-provider";

type ItemDetailSheetProps = {
  item: MenuItem;
  onClose: () => void;
  onAdd: (item: MenuItem, flavor?: string) => void;
};

export function ItemDetailSheet({ item, onClose, onAdd }: ItemDetailSheetProps) {
  const { t } = useI18n();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const flavors = item.flavors ?? [];
  const [picked, setPicked] = useState(flavors[0]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function add() {
    onAdd(item, picked);
    onClose();
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-ink-text/40">
      <button type="button" className="absolute inset-0" aria-label={t("item.close")} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[88dvh] w-full overflow-y-auto rounded-t-[1.4rem] bg-surface px-5 pb-8 pt-5 shadow-card"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="font-display text-3xl text-ink-text">
              {item.name}
            </h2>
            <p className="mt-1 text-sm font-semibold text-ink-text">{formatPrice(item.price)}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-full border border-line text-accent"
            aria-label={t("item.close")}
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="relative mx-auto h-44 w-full max-w-sm overflow-hidden rounded-2xl bg-accent-soft">
          {item.image ? (
            <Image src={item.image} alt="" fill className="object-cover" sizes="400px" priority />
          ) : (
            <div className="flex size-full items-center justify-center font-display text-5xl text-accent">
              C
            </div>
          )}
        </div>

        {item.description ? (
          <p className="mt-4 text-sm leading-relaxed text-muted">{item.description}</p>
        ) : null}

        {item.allergens && item.allergens.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {t("item.allergens")}
            </p>
            <p className="mt-1 text-sm text-ink-text">{item.allergens.join(" · ")}</p>
          </div>
        ) : null}

        {flavors.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {t("item.options")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {flavors.map((flavor) => {
                const selected = picked === flavor;
                return (
                  <button
                    key={flavor}
                    type="button"
                    onClick={() => setPicked(flavor)}
                    className={`min-h-10 rounded-full border px-3 text-sm ${
                      selected
                        ? "border-accent bg-accent text-white"
                        : "border-line bg-surface text-ink-text"
                    }`}
                  >
                    {flavor}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={add}
          className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-white"
        >
          {t("item.add")}
        </button>
      </div>
    </div>
  );
}
