"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/i18n-provider";
import { VENUE } from "@/lib/venue";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();

  return (
    <footer className={`border-t border-line px-4 ${compact ? "py-6" : "py-10"}`}>
      <div className="mx-auto max-w-[640px]">
        <p className="font-display text-2xl text-ink-text">{VENUE.name}</p>
        {!compact ? (
          <div className="mt-3 space-y-1 text-sm text-muted">
            <p>{VENUE.address}</p>
            <p>
              <a className="underline-offset-2 hover:underline" href={VENUE.phoneHref}>
                {VENUE.phone}
              </a>
            </p>
            <p>{VENUE.hours}</p>
            <p>
              <a
                className="underline-offset-2 hover:underline"
                href={VENUE.instagram}
                target="_blank"
                rel="noreferrer"
              >
                {VENUE.instagramHandle}
              </a>
              {" · "}
              <a
                className="underline-offset-2 hover:underline"
                href={VENUE.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t("footer.maps")}
              </a>
            </p>
          </div>
        ) : null}
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
          <Link href="/mentions-legales" className="hover:text-ink-text">
            {t("footer.legal")}
          </Link>
          <Link href="/confidentialite" className="hover:text-ink-text">
            {t("footer.privacy")}
          </Link>
          <Link href="/conditions" className="hover:text-ink-text">
            {t("footer.terms")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
