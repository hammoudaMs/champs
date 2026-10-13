import { NextResponse } from "next/server";
import { addOrder } from "@/lib/orders-store";
import type { StoredOrder } from "@/lib/order-types";
import { createTicketId } from "@/lib/format";
import { requireComptoir } from "@/lib/api-guard";
import { validateOrderPayload } from "@/lib/order-validate";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getIdempotentOrderAsync, saveIdempotentOrderAsync } from "@/lib/idempotency";
import { listOrders } from "@/lib/orders-store";
import { fulfillAcceptedOrder } from "@/lib/order-fulfillment";

export const runtime = "nodejs";

export async function GET() {
  const denied = await requireComptoir();
  if (denied) return denied;
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const ipLimit = rateLimit(`order:ip:${ip}`, 20, 60_000);
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(ipLimit.retryAfterSec) },
      },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  const idempotencyKey = request.headers.get("idempotency-key");
  const validated = validateOrderPayload(body, idempotencyKey);

  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: validated.status });
  }

  const tableLimit = rateLimit(`order:table:${validated.table.id}`, 12, 60_000);
  if (!tableLimit.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(tableLimit.retryAfterSec) },
      },
    );
  }

  if (validated.idempotencyKey) {
    const existing = await getIdempotentOrderAsync(validated.idempotencyKey);
    if (existing) {
      return NextResponse.json({ order: existing }, { status: 200 });
    }
  }

  const order: StoredOrder = {
    id: crypto.randomUUID(),
    ticketId: validated.ticketId || createTicketId(),
    table: validated.table,
    guestName: validated.guestName,
    notes: validated.notes,
    lines: validated.lines,
    total: validated.total,
    createdAt: new Date().toISOString(),
    status: "new",
  };

  await addOrder(order);
  await fulfillAcceptedOrder(order, validated.idempotencyKey);

  if (validated.idempotencyKey) {
    await saveIdempotentOrderAsync(validated.idempotencyKey, order);
  }

  return NextResponse.json({ order }, { status: 201 });
}
