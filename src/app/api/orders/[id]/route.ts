import { NextResponse } from "next/server";
import { isOrderStatus } from "@/lib/order-types";
import { getOrderById, updateOrderStatus } from "@/lib/orders-store";
import { requireComptoir } from "@/lib/api-guard";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireComptoir();
  if (denied) return denied;

  const { id } = await context.params;
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const status = (body as Record<string, unknown>).status;
  if (typeof status !== "string" || !isOrderStatus(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const order = await updateOrderStatus(id, status);
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  }

  return NextResponse.json({ order });
}
