import { beforeEach, describe, expect, it } from "vitest";
import type { StoredOrder } from "@/lib/order-types";
import { fulfillAcceptedOrder } from "@/lib/order-fulfillment";
import { emptySnapshot } from "@/lib/store/types";
import {
  listLedgerIncome,
  listStockProducts,
  saveStockProduct,
  setRecipeLines,
} from "@/lib/store";

function resetStore(): void {
  const globalRef = globalThis as typeof globalThis & {
    __champsDb?: { snapshot: ReturnType<typeof emptySnapshot> };
  };
  globalRef.__champsDb = { snapshot: emptySnapshot() };
}

const sampleOrder: StoredOrder = {
  id: "order-1",
  ticketId: "CHP-1001",
  table: { id: "t-1", label: "1" },
  guestName: "",
  notes: "",
  lines: [
    {
      key: "matcha-latte",
      itemId: "matcha-latte",
      name: "Matcha latte",
      price: 9,
      qty: 2,
    },
  ],
  total: 18,
  createdAt: "2026-10-13T10:00:00.000Z",
  status: "new",
};

describe("fulfillAcceptedOrder", () => {
  beforeEach(() => {
    resetStore();
    process.env.VERCEL = "1";
    delete process.env.POSTGRES_URL;
  });

  it("deducts stock and records income once", async () => {
    await saveStockProduct({
      id: "milk",
      name: "Milk",
      barcode: null,
      unit: "L",
      quantity: 10,
      lowThreshold: 1,
      costPrice: null,
      updatedAt: new Date().toISOString(),
    });
    await setRecipeLines([
      { menuItemId: "matcha-latte", stockProductId: "milk", qtyPerUnit: 0.25 },
    ]);

    await fulfillAcceptedOrder(sampleOrder, "idem-1");
    await fulfillAcceptedOrder(sampleOrder, "idem-1");

    const products = await listStockProducts();
    expect(products[0]?.quantity).toBe(9.5);
    const income = await listLedgerIncome();
    expect(income).toHaveLength(1);
    expect(income[0]?.amount).toBe(18);
  });
});
