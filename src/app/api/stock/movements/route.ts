import { NextResponse } from "next/server";
import { requireComptoir } from "@/lib/api-guard";
import { roundQty } from "@/lib/stock-logic";
import type { StockMovementKind } from "@/lib/stock-types";
import {
  addStockMovement,
  adjustProductQuantity,
  getStockProduct,
  listStockMovements,
} from "@/lib/store";

export const runtime = "nodejs";

const ALLOWED: StockMovementKind[] = ["in", "adjust"];

export async function GET() {
  const denied = await requireComptoir();
  if (denied) return denied;
  const movements = await listStockMovements();
  return NextResponse.json({ movements });
}

export async function POST(request: Request) {
  const denied = await requireComptoir();
  if (denied) return denied;

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const record = body as Record<string, unknown>;
  const kind = typeof record.kind === "string" ? record.kind : "";
  if (!ALLOWED.includes(kind as StockMovementKind)) {
    return NextResponse.json({ error: "invalid_kind" }, { status: 400 });
  }
  const productId = typeof record.productId === "string" ? record.productId : "";
  const product = await getStockProduct(productId);
  if (!product) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const reason = typeof record.reason === "string" ? record.reason.trim().slice(0, 280) : "";
  if (!reason) {
    return NextResponse.json({ error: "reason_required" }, { status: 400 });
  }

  let quantity =
    typeof record.quantity === "number" && Number.isFinite(record.quantity)
      ? record.quantity
      : Number.NaN;
  let nextQty = product.quantity;

  if (kind === "in") {
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "invalid_quantity" }, { status: 400 });
    }
    quantity = roundQty(quantity);
    nextQty = roundQty(product.quantity + quantity);
  } else {
    const target =
      typeof record.newQuantity === "number" && Number.isFinite(record.newQuantity)
        ? record.newQuantity
        : Number.NaN;
    if (!Number.isFinite(target) || target < 0) {
      return NextResponse.json({ error: "invalid_quantity" }, { status: 400 });
    }
    nextQty = roundQty(target);
    quantity = roundQty(Math.abs(nextQty - product.quantity));
  }

  await adjustProductQuantity(product.id, nextQty);
  const movement = await addStockMovement({
    productId: product.id,
    kind: kind as StockMovementKind,
    quantity,
    reason,
  });
  const updated = await getStockProduct(product.id);
  return NextResponse.json({ movement, product: updated }, { status: 201 });
}
