import type { StoredOrder } from "@/lib/order-types";
import type {
  Expense,
  RecipeLine,
  StockMovement,
  StockProduct,
  StockMovementKind,
} from "@/lib/stock-types";
import { readFileStore, withFileStore } from "@/lib/store/file-backend";
import { readMemoryStore, withMemoryStore } from "@/lib/store/memory-backend";
import * as pg from "@/lib/store/postgres-backend";

const IDEM_TTL_MS = 15 * 60 * 1000;

function hasPostgresUrl(): boolean {
  return Boolean(process.env.POSTGRES_URL?.trim());
}

function usesFileBackend(): boolean {
  return !hasPostgresUrl() && !process.env.VERCEL;
}

async function withStore<T>(work: (snapshot: import("@/lib/store/types").DatabaseSnapshot) => T): Promise<T> {
  if (hasPostgresUrl()) {
    throw new Error("withStore should not be used with postgres");
  }
  if (usesFileBackend()) return withFileStore(work);
  return withMemoryStore(work);
}

async function readStore<T>(work: (snapshot: import("@/lib/store/types").DatabaseSnapshot) => T): Promise<T> {
  if (hasPostgresUrl()) {
    throw new Error("readStore should not be used with postgres");
  }
  if (usesFileBackend()) return readFileStore(work);
  return readMemoryStore(work);
}

export async function listOrders(): Promise<StoredOrder[]> {
  if (hasPostgresUrl()) return pg.pgListOrders();
  return readStore((s) => [...s.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function getOrderById(id: string): Promise<StoredOrder | null> {
  if (hasPostgresUrl()) return pg.pgGetOrder(id);
  return readStore((s) => s.orders.find((o) => o.id === id) ?? null);
}

export async function addOrder(order: StoredOrder): Promise<StoredOrder> {
  if (hasPostgresUrl()) {
    await pg.pgAddOrder(order);
    return order;
  }
  return withStore((s) => {
    s.orders.push(order);
    return order;
  });
}

export async function updateOrderStatus(
  id: string,
  status: StoredOrder["status"],
): Promise<StoredOrder | null> {
  if (hasPostgresUrl()) return pg.pgUpdateOrderStatus(id, status);
  return withStore((s) => {
    const index = s.orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    const next = { ...s.orders[index], status };
    s.orders[index] = next;
    return next;
  });
}

export async function getIdempotentOrder(key: string): Promise<StoredOrder | null> {
  if (hasPostgresUrl()) return pg.pgGetIdempotentOrder(key);
  return readStore((s) => {
    const entry = s.idempotency.find((row) => row.key === key);
    if (!entry) return null;
    if (new Date(entry.expiresAt).getTime() < Date.now()) return null;
    return s.orders.find((o) => o.id === entry.orderId) ?? null;
  });
}

export async function saveIdempotentOrder(key: string, order: StoredOrder): Promise<void> {
  const expiresAt = new Date(Date.now() + IDEM_TTL_MS).toISOString();
  if (hasPostgresUrl()) {
    await pg.pgSaveIdempotency(key, order.id, expiresAt);
    return;
  }
  await withStore((s) => {
    const filtered = s.idempotency.filter((row) => row.key !== key);
    filtered.push({ key, orderId: order.id, expiresAt });
    s.idempotency = filtered;
  });
}

export async function isOrderFulfilled(orderId: string): Promise<boolean> {
  if (hasPostgresUrl()) return pg.pgIsOrderFulfilled(orderId);
  return readStore((s) => s.fulfillment.some((row) => row.orderId === orderId));
}

export async function markOrderFulfilled(
  orderId: string,
  idempotencyKey: string | null,
): Promise<void> {
  if (hasPostgresUrl()) {
    await pg.pgMarkOrderFulfilled(orderId, idempotencyKey);
    return;
  }
  await withStore((s) => {
    if (s.fulfillment.some((row) => row.orderId === orderId)) return;
    s.fulfillment.push({
      orderId,
      idempotencyKey,
      fulfilledAt: new Date().toISOString(),
    });
  });
}

export async function recordOrderIncome(
  orderId: string,
  amount: number,
  createdAt: string,
): Promise<void> {
  if (hasPostgresUrl()) {
    await pg.pgRecordOrderIncome(orderId, amount, createdAt);
    return;
  }
  await withStore((s) => {
    if (s.ledgerIncome.some((row) => row.orderId === orderId)) return;
    s.ledgerIncome.push({ orderId, amount, createdAt });
  });
}

export async function listStockProducts(): Promise<StockProduct[]> {
  if (hasPostgresUrl()) return pg.pgListStockProducts();
  return readStore((s) =>
    [...s.stockProducts].sort((a, b) => a.name.localeCompare(b.name)),
  );
}

export async function getStockProduct(id: string): Promise<StockProduct | null> {
  const all = await listStockProducts();
  return all.find((p) => p.id === id) ?? null;
}

export async function findProductByBarcode(barcode: string): Promise<StockProduct | null> {
  const trimmed = barcode.trim();
  if (!trimmed) return null;
  if (hasPostgresUrl()) return pg.pgFindProductByBarcode(trimmed);
  return readStore((s) => s.stockProducts.find((p) => p.barcode === trimmed) ?? null);
}

export async function saveStockProduct(product: StockProduct): Promise<StockProduct> {
  if (hasPostgresUrl()) {
    await pg.pgUpsertStockProduct(product);
    return product;
  }
  return withStore((s) => {
    const index = s.stockProducts.findIndex((p) => p.id === product.id);
    if (index === -1) s.stockProducts.push(product);
    else s.stockProducts[index] = product;
    return product;
  });
}

export async function adjustProductQuantity(productId: string, quantity: number): Promise<void> {
  const now = new Date().toISOString();
  if (hasPostgresUrl()) {
    const product = await getStockProduct(productId);
    if (!product) return;
    await pg.pgUpsertStockProduct({ ...product, quantity, updatedAt: now });
    return;
  }
  await withStore((s) => {
    const product = s.stockProducts.find((p) => p.id === productId);
    if (!product) return;
    product.quantity = quantity;
    product.updatedAt = now;
  });
}

export async function addStockMovement(input: {
  productId: string;
  kind: StockMovementKind;
  quantity: number;
  reason: string;
  orderId?: string | null;
}): Promise<StockMovement> {
  const movement: StockMovement = {
    id: crypto.randomUUID(),
    productId: input.productId,
    kind: input.kind,
    quantity: input.quantity,
    reason: input.reason,
    orderId: input.orderId ?? null,
    createdAt: new Date().toISOString(),
  };
  if (hasPostgresUrl()) {
    await pg.pgAddStockMovement(movement);
    return movement;
  }
  await withStore((s) => {
    s.stockMovements.unshift(movement);
    if (s.stockMovements.length > 500) s.stockMovements.length = 500;
  });
  return movement;
}

export async function listStockMovements(limit = 200): Promise<StockMovement[]> {
  if (hasPostgresUrl()) return pg.pgListStockMovements(limit);
  return readStore((s) => s.stockMovements.slice(0, limit));
}

export async function getRecipeLines(): Promise<RecipeLine[]> {
  if (hasPostgresUrl()) return pg.pgGetRecipeLines();
  return readStore((s) => [...s.recipes]);
}

export async function setRecipeLines(lines: RecipeLine[]): Promise<void> {
  if (hasPostgresUrl()) {
    await pg.pgSetRecipeLines(lines);
    return;
  }
  await withStore((s) => {
    s.recipes = lines;
  });
}

export async function listExpenses(): Promise<Expense[]> {
  if (hasPostgresUrl()) return pg.pgListExpenses();
  return readStore((s) =>
    [...s.expenses].sort((a, b) => b.expenseDate.localeCompare(a.expenseDate)),
  );
}

export async function addExpense(expense: Expense): Promise<Expense> {
  if (hasPostgresUrl()) {
    await pg.pgAddExpense(expense);
    return expense;
  }
  return withStore((s) => {
    s.expenses.push(expense);
    return expense;
  });
}

export async function listLedgerIncome() {
  if (hasPostgresUrl()) return pg.pgListLedgerIncome();
  return readStore((s) => [...s.ledgerIncome].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export function storageMode(): "postgres" | "file" | "memory" {
  if (hasPostgresUrl()) return "postgres";
  if (usesFileBackend()) return "file";
  return "memory";
}
