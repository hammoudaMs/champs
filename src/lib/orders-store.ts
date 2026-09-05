import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StoredOrder } from "@/lib/order-types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "orders.json");
const useMemory = Boolean(process.env.VERCEL);

type MemoryBag = {
  orders: StoredOrder[];
};

function memoryBag(): MemoryBag {
  const globalRef = globalThis as typeof globalThis & { __champsOrders?: MemoryBag };
  if (!globalRef.__champsOrders) {
    globalRef.__champsOrders = { orders: [] };
  }
  return globalRef.__champsOrders;
}

let writeQueue: Promise<void> = Promise.resolve();

async function readOrders(): Promise<StoredOrder[]> {
  if (useMemory) {
    return memoryBag().orders;
  }
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredOrder[];
  } catch {
    return [];
  }
}

async function writeOrders(orders: StoredOrder[]): Promise<void> {
  if (useMemory) {
    memoryBag().orders = orders;
    return;
  }
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(orders, null, 2), "utf8");
}

function enqueue<T>(work: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(work, work);
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function listOrders(): Promise<StoredOrder[]> {
  return enqueue(async () => {
    const orders = await readOrders();
    return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });
}

export function getOrderById(id: string): Promise<StoredOrder | null> {
  return enqueue(async () => {
    const orders = await readOrders();
    return orders.find((order) => order.id === id) ?? null;
  });
}

export function addOrder(order: StoredOrder): Promise<StoredOrder> {
  return enqueue(async () => {
    const orders = await readOrders();
    orders.push(order);
    await writeOrders(orders);
    return order;
  });
}

export function updateOrderStatus(
  id: string,
  status: StoredOrder["status"],
): Promise<StoredOrder | null> {
  return enqueue(async () => {
    const orders = await readOrders();
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) return null;
    const next = { ...orders[index], status };
    orders[index] = next;
    await writeOrders(orders);
    return next;
  });
}
