import "server-only";
import type { StoredOrder } from "@/lib/order-types";

type Entry = {
  order: StoredOrder;
  expiresAt: number;
};

const store = new Map<string, Entry>();
const TTL_MS = 15 * 60 * 1000;

export function getIdempotentOrder(key: string): StoredOrder | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    store.delete(key);
    return null;
  }
  return entry.order;
}

export function saveIdempotentOrder(key: string, order: StoredOrder): void {
  store.set(key, { order, expiresAt: Date.now() + TTL_MS });
}
