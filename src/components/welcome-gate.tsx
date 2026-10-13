"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, registerGsap, SplitText, useGSAP } from "@/lib/gsap";
import type { TableRef } from "@/lib/table";
import { useI18n } from "@/i18n/i18n-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

registerGsap();

type WelcomeGateProps = {
  table: TableRef;
  onEnter: () => void;
};

export function WelcomeGate({ table, onEnter }: WelcomeGateProps) {
  const root = useRef<HTMLElement>(null);
  const { t, locale } = useI18n();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".welcome-anim", { autoAlpha: 1, y: 0, scale: 1 });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const title = document.querySelector(".welcome-title");
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".welcome-kicker", { y: 18, autoAlpha: 0, duration: 0.55 });
        if (locale === "ar-TN" || !title) {
          tl.from(".welcome-title", { y: 24, autoAlpha: 0, duration: 0.55 }, "-=0.2");
        } else {
          const split = SplitText.create(".welcome-title", {
            type: "chars, words",
            aria: "auto",
          });
          tl.from(
            split.chars,
            { yPercent: 80, autoAlpha: 0, stagger: 0.028, duration: 0.65 },
            "-=0.2",
          );
        }
        tl.from(".welcome-copy", { y: 16, autoAlpha: 0, duration: 0.5 }, "-=0.2")
          .from(".welcome-table", { y: 10, autoAlpha: 0, duration: 0.4 }, "-=0.2")
          .from(".welcome-cta", { y: 18, autoAlpha: 0, duration: 0.45 }, "-=0.15");
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [locale] },
  );

  return (
    <section ref={root} className="relative flex min-h-dvh flex-col overflow-hidden bg-bg">
      <div className="relative h-[42vh] w-full shrink-0">
        <Image
          src="/menu/hero-cup.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[18%_12%]"
          sizes="(max-width: 640px) 100vw, 640px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-black/25" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-10 pt-4">
        <div className="flex justify-center">
          <LanguageSwitcher />
        </div>
        <p className="welcome-anim welcome-kicker mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-accent">
          Café Champ&apos;s
        </p>
        <p className="welcome-anim mt-3 text-center text-sm text-muted">{t("welcome.hello")}</p>
        <h1 className="welcome-title mt-2 text-center font-display text-[3rem] font-semibold leading-[0.95] text-ink-text">
          {t("welcome.selfService")}
        </h1>
        <p className="welcome-anim welcome-copy mx-auto mt-4 max-w-[18rem] whitespace-pre-line text-center text-sm leading-relaxed text-muted">
          {t("welcome.copy")}
        </p>
        <p className="welcome-anim welcome-table mt-4 text-center text-sm font-medium text-accent">
          {t("welcome.table", { n: table.label })}
        </p>
        <button
          type="button"
          onClick={onEnter}
          className="welcome-anim welcome-cta mt-auto flex min-h-12 w-full items-center justify-center rounded-xl bg-accent px-6 text-[0.95rem] font-semibold text-white"
        >
          {t("welcome.enter")}
        </button>
      </div>
    </section>
  );
}
