import { NextResponse } from "next/server";
import { requireComptoir } from "@/lib/api-guard";
import { isLowStock } from "@/lib/stock-logic";
import { isStockUnit, type StockProduct } from "@/lib/stock-types";
import {
  findProductByBarcode,
  listStockProducts,
  saveStockProduct,
} from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const denied = await requireComptoir();
  if (denied) return denied;
  const products = await listStockProducts();
  return NextResponse.json({
    products: products.map((product) => ({
      ...product,
      lowStock: isLowStock(product.quantity, product.lowThreshold),
    })),
  });
}

export async function POST(request: Request) {
  const denied = await requireComptoir();
  if (denied) return denied;

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const record = body as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "name_required" }, { status: 400 });
  }
  const unit = typeof record.unit === "string" ? record.unit : "pcs";
  if (!isStockUnit(unit)) {
    return NextResponse.json({ error: "invalid_unit" }, { status: 400 });
  }
  const barcode =
    typeof record.barcode === "string" && record.barcode.trim()
      ? record.barcode.trim()
      : null;
  if (barcode) {
    const existing = await findProductByBarcode(barcode);
    if (existing) {
      return NextResponse.json({ error: "barcode_exists", product: existing }, { status: 409 });
    }
  }
  const quantity =
    typeof record.quantity === "number" && Number.isFinite(record.quantity)
      ? Math.max(0, record.quantity)
      : 0;
  const lowThreshold =
    typeof record.lowThreshold === "number" && Number.isFinite(record.lowThreshold)
      ? Math.max(0, record.lowThreshold)
      : 0;
  const costPrice =
    typeof record.costPrice === "number" && Number.isFinite(record.costPrice)
      ? record.costPrice
      : null;

  const product: StockProduct = {
    id: crypto.randomUUID(),
    name: name.slice(0, 120),
    barcode,
    unit,
    quantity,
    lowThreshold,
    costPrice,
    updatedAt: new Date().toISOString(),
  };
  await saveStockProduct(product);
  return NextResponse.json({ product }, { status: 201 });
}
