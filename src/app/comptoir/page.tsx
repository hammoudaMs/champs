import type { Metadata } from "next";
import { ComptoirGate } from "./comptoir-gate";

export const metadata: Metadata = {
  title: "Comptoir — Café Champ's",
  description: "Commandes self-service en direct pour le bar.",
};

export default function ComptoirPage() {
  return <ComptoirGate />;
}
