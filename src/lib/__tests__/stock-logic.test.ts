import { describe, expect, it } from "vitest";
import { computeOrderStockDeductions, isLowStock } from "@/lib/stock-logic";

describe("computeOrderStockDeductions", () => {
  it("aggregates recipe quantities per product", () => {
    const lines = [
      {
        key: "matcha-latte",
        itemId: "matcha-latte",
        name: "Matcha latte",
        price: 9,
        qty: 2,
      },
    ];
    const recipes = [
      { menuItemId: "matcha-latte", stockProductId: "milk", qtyPerUnit: 0.2 },
      { menuItemId: "matcha-latte", stockProductId: "matcha", qtyPerUnit: 0.05 },
    ];
    const result = computeOrderStockDeductions(lines, recipes);
    expect(result).toEqual([
      { stockProductId: "milk", quantity: 0.4 },
      { stockProductId: "matcha", quantity: 0.1 },
    ]);
  });
});

describe("isLowStock", () => {
  it("flags when quantity is at or below threshold", () => {
    expect(isLowStock(5, 5)).toBe(true);
    expect(isLowStock(6, 5)).toBe(false);
    expect(isLowStock(1, 0)).toBe(false);
  });
});
