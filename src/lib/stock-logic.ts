import type { OrderLine } from "@/lib/order-types";
import type { RecipeLine } from "@/lib/stock-types";

export type DeductionLine = {
  stockProductId: string;
  quantity: number;
};

export function computeOrderStockDeductions(
  lines: OrderLine[],
  recipes: RecipeLine[],
): DeductionLine[] {
  const byMenu = new Map<string, RecipeLine[]>();
  for (const recipe of recipes) {
    const list = byMenu.get(recipe.menuItemId) ?? [];
    list.push(recipe);
    byMenu.set(recipe.menuItemId, list);
  }

  const totals = new Map<string, number>();

  for (const line of lines) {
    const recipeLines = byMenu.get(line.itemId);
    if (!recipeLines?.length) continue;
    for (const recipe of recipeLines) {
      const add = recipe.qtyPerUnit * line.qty;
      totals.set(recipe.stockProductId, (totals.get(recipe.stockProductId) ?? 0) + add);
    }
  }

  return [...totals.entries()].map(([stockProductId, quantity]) => ({
    stockProductId,
    quantity: roundQty(quantity),
  }));
}

export function roundQty(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function isLowStock(quantity: number, lowThreshold: number): boolean {
  return lowThreshold > 0 && quantity <= lowThreshold;
}
