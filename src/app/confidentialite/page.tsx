import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Confidentialité",
};

export default function ConfidentialitePage() {
  return (
    <main className="app-frame px-4 py-10">
      <Link href="/" className="text-sm text-accent underline-offset-2 hover:underline">
        ← Café Champ&apos;s
      </Link>
      <h1 className="mt-6 font-display text-4xl text-ink-text">Confidentialité</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Nous collectons uniquement les données nécessaires au service de commande :
          numéro de table (via QR), contenu de la commande, prénom optionnel, note au bar,
          et horodatage. Ces données servent à préparer et suivre votre commande au comptoir.
        </p>
        <p>
          Cookies / stockage local : langue choisie (`champs-lang`), commande active
          (`sessionStorage`), et cookie de session httpOnly pour le personnel du comptoir.
          Aucune publicité tierce n&apos;est liée à ces cookies.
        </p>
        <p>
          Analytics : mesures d&apos;audience anonymisées (Vercel Analytics / Speed Insights)
          pour améliorer la performance du site. Vous pouvez bloquer les scripts analytics
          via les réglages de votre navigateur.
        </p>
        <p>
          Pour toute demande relative à vos données : contactez-nous via les coordonnées
          indiquées dans les mentions légales.
        </p>
      </div>
      <SiteFooter compact />
    </main>
  );
}
