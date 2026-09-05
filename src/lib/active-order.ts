import type { PlacedOrder } from "@/context/cart-context";

export const ACTIVE_ORDER_KEY = "champs-active-order";

const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeActiveOrder(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function readActiveOrder(): PlacedOrder | null {
  const raw = window.sessionStorage.getItem(ACTIVE_ORDER_KEY);
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw) as PlacedOrder;
    return saved?.id ? saved : null;
  } catch {
    window.sessionStorage.removeItem(ACTIVE_ORDER_KEY);
    return null;
  }
}

export function writeActiveOrder(order: PlacedOrder): void {
  window.sessionStorage.setItem(ACTIVE_ORDER_KEY, JSON.stringify(order));
  emit();
}

export function clearActiveOrder(): void {
  window.sessionStorage.removeItem(ACTIVE_ORDER_KEY);
  emit();
}
