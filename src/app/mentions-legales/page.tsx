import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { VENUE } from "@/lib/venue";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  return (
    <main className="app-frame px-4 py-10">
      <Link href="/" className="text-sm text-accent underline-offset-2 hover:underline">
        ← Café Champ&apos;s
      </Link>
      <h1 className="mt-6 font-display text-4xl text-ink-text">Mentions légales</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          <strong className="text-ink-text">{VENUE.legalName}</strong>
          <br />
          {VENUE.address}
          <br />
          {VENUE.email}
          <br />
          {VENUE.phone}
        </p>
        <p>
          L&apos;application de commande en self-service est fournie pour faciliter la prise
          de commande au café. Les informations présentées (carte, prix) sont fournies à titre
          indicatif et peuvent être mises à jour sans préavis.
        </p>
        <p>
          Hébergement : Vercel Inc. — les données de commande sont traitées sur l&apos;infrastructure
          cloud du prestataire.
        </p>
      </div>
      <SiteFooter compact />
    </main>
  );
}
