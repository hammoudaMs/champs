"use client";

import { useId, useRef } from "react";
import { CATEGORIES, QUICK_FILTERS, type FilterId } from "@/data/menu";
import { CategoryGlyph, GridIcon, PlusIcon } from "@/components/icons";
import { useI18n } from "@/i18n/i18n-provider";
import type { MsgKey } from "@/i18n/fr";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";

registerGsap();

type CategoryFilterProps = {
  active: FilterId;
  onChange: (id: FilterId) => void;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

function filterLabel(id: FilterId, t: (key: MsgKey) => string): string {
  if (id === "all") return t("menu.filterAll");
  return t(`category.${id}` as MsgKey);
}

const extraCategories = CATEGORIES.filter((category) => !QUICK_FILTERS.includes(category.id));

export function CategoryFilter({
  active,
  onChange,
  open,
  onOpen,
  onClose,
}: CategoryFilterProps) {
  const { t } = useI18n();
  const panelId = useId();
  const plusRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const primed = useRef(false);
  const moreActive = open || !QUICK_FILTERS.includes(active);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const plus = plusRef.current;
      if (!panel || !plus) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const duration = reduced ? 0 : 0.26;

      if (!primed.current) {
        primed.current = true;
        gsap.set(panel, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0 });
        gsap.set(plus, { rotation: open ? 45 : 0 });
        return;
      }

      gsap.to(panel, {
        height: open ? "auto" : 0,
        autoAlpha: open ? 1 : 0,
        duration,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(plus, {
        rotation: open ? 45 : 0,
        duration: reduced ? 0 : 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    { dependencies: [open] },
  );

  function pick(id: FilterId) {
    onChange(id);
    onClose();
  }

  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5" role="tablist" aria-label={t("menu.categories")}>
        {QUICK_FILTERS.map((id) => {
          const selected = !open && active === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => pick(id)}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border px-1 text-center ${
                selected ? "border-gold bg-gold text-ink" : "border-[var(--line)] text-muted"
              }`}
            >
              {id === "all" ? (
                <GridIcon className="size-4" />
              ) : (
                <CategoryGlyph
                  icon={CATEGORIES.find((category) => category.id === id)?.icon ?? "star"}
                  className="size-4"
                />
              )}
              <span className="line-clamp-2 text-[10px] leading-tight">{filterLabel(id, t)}</span>
            </button>
          );
        })}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => (open ? onClose() : onOpen())}
          className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border px-1 text-center ${
            moreActive ? "border-gold bg-gold text-ink" : "border-[var(--line)] text-muted"
          }`}
        >
          <span ref={plusRef} className="flex size-4 items-center justify-center">
            <PlusIcon className="size-4" />
          </span>
          <span className="line-clamp-2 text-[10px] leading-tight">{t("menu.more")}</span>
        </button>
      </div>

      <div
        id={panelId}
        ref={panelRef}
        className="h-0 overflow-hidden opacity-0"
        aria-hidden={!open}
      >
        <div className="flex gap-1.5 overflow-x-auto pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {extraCategories.map((category) => {
            const selected = active === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => pick(category.id)}
                className={`flex h-12 shrink-0 items-center gap-1.5 rounded-full border px-3 ${
                  selected ? "border-gold bg-gold text-ink" : "border-[var(--line)] text-cream"
                }`}
              >
                <CategoryGlyph icon={category.icon} className="size-3.5" />
                <span className="whitespace-nowrap text-[11px] leading-none">
                  {t(`category.${category.id}` as MsgKey)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
