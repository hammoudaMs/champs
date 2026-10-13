import { NextResponse } from "next/server";
import { MENU } from "@/data/menu";
import { requireComptoir } from "@/lib/api-guard";
import type { RecipeLine } from "@/lib/stock-types";
import { getRecipeLines, listStockProducts, setRecipeLines } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const denied = await requireComptoir();
  if (denied) return denied;
  const recipes = await getRecipeLines();
  const products = await listStockProducts();
  return NextResponse.json({
    recipes,
    menuItems: MENU.map((item) => ({ id: item.id, name: item.name })),
    products: products.map((p) => ({ id: p.id, name: p.name, unit: p.unit })),
  });
}

export async function PUT(request: Request) {
  const denied = await requireComptoir();
  if (denied) return denied;
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !Array.isArray((body as { lines?: unknown }).lines)) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const menuIds = new Set(MENU.map((item) => item.id));
  const products = await listStockProducts();
  const productIds = new Set(products.map((p) => p.id));
  const lines: RecipeLine[] = [];
  for (const entry of (body as { lines: unknown[] }).lines) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const menuItemId = typeof row.menuItemId === "string" ? row.menuItemId : "";
    const stockProductId = typeof row.stockProductId === "string" ? row.stockProductId : "";
    const qtyPerUnit =
      typeof row.qtyPerUnit === "number" && Number.isFinite(row.qtyPerUnit)
        ? row.qtyPerUnit
        : Number.NaN;
    if (!menuIds.has(menuItemId) || !productIds.has(stockProductId)) continue;
    if (!Number.isFinite(qtyPerUnit) || qtyPerUnit <= 0) continue;
    lines.push({ menuItemId, stockProductId, qtyPerUnit });
  }
  await setRecipeLines(lines);
  return NextResponse.json({ recipes: lines });
}
