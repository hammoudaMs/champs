import { NextResponse } from "next/server";
import { requireComptoir } from "@/lib/api-guard";
import { isStockUnit } from "@/lib/stock-types";
import { findProductByBarcode, getStockProduct, saveStockProduct } from "@/lib/store";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireComptoir();
  if (denied) return denied;
  const { id } = await context.params;
  const product = await getStockProduct(id);
  if (!product) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const record = body as Record<string, unknown>;
  if (typeof record.name === "string" && record.name.trim()) {
    product.name = record.name.trim().slice(0, 120);
  }
  if (typeof record.unit === "string" && isStockUnit(record.unit)) {
    product.unit = record.unit;
  }
  if (typeof record.lowThreshold === "number" && Number.isFinite(record.lowThreshold)) {
    product.lowThreshold = Math.max(0, record.lowThreshold);
  }
  if (record.costPrice === null) {
    product.costPrice = null;
  } else if (typeof record.costPrice === "number" && Number.isFinite(record.costPrice)) {
    product.costPrice = record.costPrice;
  }
  if (typeof record.barcode === "string") {
    const trimmed = record.barcode.trim();
    if (trimmed) {
      const existing = await findProductByBarcode(trimmed);
      if (existing && existing.id !== product.id) {
        return NextResponse.json({ error: "barcode_exists" }, { status: 409 });
      }
      product.barcode = trimmed;
    } else {
      product.barcode = null;
    }
  }
  product.updatedAt = new Date().toISOString();
  await saveStockProduct(product);
  return NextResponse.json({ product });
}
