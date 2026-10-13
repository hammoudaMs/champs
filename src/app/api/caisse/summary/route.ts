import { NextResponse } from "next/server";
import { requireComptoir } from "@/lib/api-guard";
import { buildCaisseSummary } from "@/lib/caisse-logic";
import { listExpenses, listLedgerIncome } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const denied = await requireComptoir();
  if (denied) return denied;
  const [income, expenses] = await Promise.all([listLedgerIncome(), listExpenses()]);
  const summary = buildCaisseSummary(income, expenses);
  return NextResponse.json({ summary, currency: "TND" });
}
