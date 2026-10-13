import type { StoredOrder } from "@/lib/order-types";
import { computeOrderStockDeductions } from "@/lib/stock-logic";
import {
  addStockMovement,
  adjustProductQuantity,
  getRecipeLines,
  isOrderFulfilled,
  listStockProducts,
  markOrderFulfilled,
  recordOrderIncome,
} from "@/lib/store";

export async function fulfillAcceptedOrder(
  order: StoredOrder,
  idempotencyKey: string | null,
): Promise<void> {
  if (await isOrderFulfilled(order.id)) return;

  await recordOrderIncome(order.id, order.total, order.createdAt);

  const recipes = await getRecipeLines();
  const deductions = computeOrderStockDeductions(order.lines, recipes);
  if (deductions.length === 0) {
    await markOrderFulfilled(order.id, idempotencyKey);
    return;
  }

  const products = await listStockProducts();
  const byId = new Map(products.map((p) => [p.id, p]));

  for (const line of deductions) {
    const product = byId.get(line.stockProductId);
    if (!product) continue;
    const nextQty = Math.max(0, product.quantity - line.quantity);
    await adjustProductQuantity(product.id, nextQty);
    await addStockMovement({
      productId: product.id,
      kind: "order",
      quantity: line.quantity,
      reason: `Commande ${order.ticketId}`,
      orderId: order.id,
    });
    product.quantity = nextQty;
  }

  await markOrderFulfilled(order.id, idempotencyKey);
}
