import { NextResponse } from "next/server";
import { requireComptoir } from "@/lib/api-guard";
import { roundMoney } from "@/lib/caisse-logic";
import { isExpenseCategory, type Expense } from "@/lib/stock-types";
import { addExpense, listExpenses } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const denied = await requireComptoir();
  if (denied) return denied;
  const expenses = await listExpenses();
  return NextResponse.json({ expenses });
}

export async function POST(request: Request) {
  const denied = await requireComptoir();
  if (denied) return denied;
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const record = body as Record<string, unknown>;
  const amount =
    typeof record.amount === "number" && Number.isFinite(record.amount) ? record.amount : Number.NaN;
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
  }
  const category = typeof record.category === "string" ? record.category : "";
  if (!isExpenseCategory(category)) {
    return NextResponse.json({ error: "invalid_category" }, { status: 400 });
  }
  const note = typeof record.note === "string" ? record.note.trim().slice(0, 280) : "";
  const expenseDate =
    typeof record.expenseDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(record.expenseDate)
      ? record.expenseDate
      : new Date().toISOString().slice(0, 10);

  const expense: Expense = {
    id: crypto.randomUUID(),
    amount: roundMoney(amount),
    category,
    note,
    expenseDate,
    createdAt: new Date().toISOString(),
  };
  await addExpense(expense);
  return NextResponse.json({ expense }, { status: 201 });
}
