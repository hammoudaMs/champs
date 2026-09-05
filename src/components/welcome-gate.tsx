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
        tl.from(".welcome-kicker", { y: 18, autoAlpha: 0, duration: 0.6 });
        if (locale === "ar-TN" || !title) {
          tl.from(".welcome-title", { y: 24, autoAlpha: 0, duration: 0.6 }, "-=0.2");
        } else {
          const split = SplitText.create(".welcome-title", {
            type: "chars, words",
            aria: "auto",
          });
          tl.from(
            split.chars,
            { yPercent: 80, autoAlpha: 0, stagger: 0.028, duration: 0.7 },
            "-=0.2",
          );
        }
        tl.from(".welcome-rule", { scaleX: 0, duration: 0.55 }, "-=0.35")
          .from(".welcome-copy", { y: 16, autoAlpha: 0, duration: 0.55 }, "-=0.25")
          .from(".welcome-table", { y: 10, autoAlpha: 0, duration: 0.4 }, "-=0.25")
          .from(".welcome-cta", { y: 18, autoAlpha: 0, duration: 0.5 }, "-=0.2")
          .from(".welcome-cup", { autoAlpha: 0, y: 24, duration: 1.1 }, 0.15);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [locale] },
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-dvh flex-col overflow-hidden px-6 pb-10 pt-14"
    >
      <div className="welcome-cup pointer-events-none absolute inset-x-0 -top-6 h-[58vh] opacity-80">
        <Image
          src="/menu/hero-cup.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[18%_12%]"
          sizes="430px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/55 to-ink" />
      </div>

      <div className="relative z-10 flex justify-center">
        <LanguageSwitcher />
      </div>

      <p className="welcome-anim welcome-kicker relative z-10 mt-4 text-center text-[11px] font-medium uppercase tracking-[0.38em] text-gold">
        Café Champ&apos;s
      </p>

      <div className="relative z-10 mt-auto">
        <p className="welcome-anim mb-3 text-center font-script text-[1.85rem] leading-none text-gold-bright">
          {t("welcome.hello")}
        </p>
        <h1 className="welcome-title overflow-hidden font-display text-center text-[3.35rem] font-semibold leading-[0.9] tracking-tight text-cream">
          {t("welcome.selfService")}
        </h1>
        <div className="welcome-anim welcome-rule gold-rule mx-auto mt-5 w-40 origin-center" />
        <p className="welcome-anim welcome-copy mx-auto mt-5 max-w-[18rem] whitespace-pre-line text-center text-[0.98rem] leading-relaxed text-muted">
          {t("welcome.copy")}
        </p>
        <p className="welcome-anim welcome-table mt-4 text-center text-sm tracking-wide text-gold">
          {t("welcome.table", { n: table.label })}
        </p>
        <button
          type="button"
          onClick={onEnter}
          className="welcome-anim welcome-cta mt-8 flex min-h-12 w-full items-center justify-center rounded-full bg-gold px-6 text-[0.95rem] font-semibold tracking-wide text-ink transition-colors hover:bg-gold-bright"
        >
          {t("welcome.enter")}
        </button>
      </div>
    </section>
  );
}
