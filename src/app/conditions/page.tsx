import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Conditions",
};

export default function ConditionsPage() {
  return (
    <main className="app-frame px-4 py-10">
      <Link href="/" className="text-sm text-accent underline-offset-2 hover:underline">
        ← Café Champ&apos;s
      </Link>
      <h1 className="mt-6 font-display text-4xl text-ink-text">Conditions</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Les prix affichés sont en dinars tunisiens (DT), TTC. Le paiement s&apos;effectue au
          comptoir lors du retrait ou selon les modalités indiquées en salle.
        </p>
        <p>
          Allergènes : les fiches produit indiquent les allergènes courants lorsque connus.
          En cas d&apos;allergie ou d&apos;intolérance, demandez confirmation au bar avant
          de commander — la composition peut varier.
        </p>
        <p>
          La commande passée via le QR engage la préparation. Toute modification après envoi
          doit être demandée au comptoir. Café Champ&apos;s peut refuser une commande en cas
          d&apos;indisponibilité d&apos;un produit.
        </p>
      </div>
      <SiteFooter compact />
    </main>
  );
}
