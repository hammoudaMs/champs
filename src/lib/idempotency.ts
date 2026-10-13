import "server-only";
import type { StoredOrder } from "@/lib/order-types";
import { getIdempotentOrder, saveIdempotentOrder } from "@/lib/store";

export async function getIdempotentOrderAsync(key: string): Promise<StoredOrder | null> {
  return getIdempotentOrder(key);
}

export async function saveIdempotentOrderAsync(key: string, order: StoredOrder): Promise<void> {
  return saveIdempotentOrder(key, order);
}
