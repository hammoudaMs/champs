import { NextResponse } from "next/server";
import { addOrder, listOrders } from "@/lib/orders-store";
import type { OrderLine, StoredOrder } from "@/lib/order-types";
import { createTicketId } from "@/lib/format";
import { requireComptoir } from "@/lib/api-guard";

export const runtime = "nodejs";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseTable(value: unknown): StoredOrder["table"] | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const id = asString(record.id);
  const label = asString(record.label);
  if (!id || !label) return null;
  return { id, label };
}

function parseLines(value: unknown): OrderLine[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const lines: OrderLine[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const record = item as Record<string, unknown>;
    const name = asString(record.name);
    const itemId = asString(record.itemId);
    const key = asString(record.key);
    const price = typeof record.price === "number" ? record.price : Number.NaN;
    const qty = typeof record.qty === "number" ? record.qty : Number.NaN;
    if (!name || !itemId || !key || !Number.isFinite(price) || !Number.isFinite(qty) || qty < 1) {
      return null;
    }
    const flavor = asString(record.flavor);
    lines.push({
      key,
      itemId,
      name,
      price,
      qty,
      ...(flavor ? { flavor } : {}),
    });
  }
  return lines;
}

export async function GET() {
  const denied = await requireComptoir();
  if (denied) return denied;
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Commande invalide." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const table = parseTable(record.table);
  const lines = parseLines(record.lines);
  const total = typeof record.total === "number" ? record.total : Number.NaN;

  if (!table || !lines || !Number.isFinite(total)) {
    return NextResponse.json({ error: "Commande invalide." }, { status: 400 });
  }

  const order: StoredOrder = {
    id: crypto.randomUUID(),
    ticketId: asString(record.ticketId) || createTicketId(),
    table,
    guestName: asString(record.guestName),
    notes: asString(record.notes),
    lines,
    total,
    createdAt: new Date().toISOString(),
    status: "new",
  };

  await addOrder(order);
  return NextResponse.json({ order }, { status: 201 });
}
