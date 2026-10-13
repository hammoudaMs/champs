import type { Metadata } from "next";
import { ComptoirGate } from "./comptoir-gate";

export const metadata: Metadata = {
  title: "Comptoir",
  description: "Commandes self-service en direct pour le bar.",
  robots: { index: false, follow: false },
};

export default function ComptoirPage() {
  return <ComptoirGate />;
}
