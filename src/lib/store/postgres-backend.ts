import { sql } from "@vercel/postgres";
import type { StoredOrder } from "@/lib/order-types";
import type {
  Expense,
  LedgerIncome,
  RecipeLine,
  StockMovement,
  StockProduct,
} from "@/lib/stock-types";
import type { DatabaseSnapshot, IdempotencyRecord, OrderFulfillment } from "@/lib/store/types";

let schemaReady: Promise<void> | null = null;

export function ensurePostgresSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          ticket_id TEXT NOT NULL,
          table_id TEXT NOT NULL,
          table_label TEXT NOT NULL,
          guest_name TEXT NOT NULL DEFAULT '',
          notes TEXT NOT NULL DEFAULT '',
          lines JSONB NOT NULL,
          total DOUBLE PRECISION NOT NULL,
          created_at TIMESTAMPTZ NOT NULL,
          status TEXT NOT NULL
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS idempotency (
          key TEXT PRIMARY KEY,
          order_id TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS order_fulfillment (
          order_id TEXT PRIMARY KEY,
          idempotency_key TEXT,
          fulfilled_at TIMESTAMPTZ NOT NULL
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS stock_products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          barcode TEXT UNIQUE,
          unit TEXT NOT NULL,
          quantity DOUBLE PRECISION NOT NULL DEFAULT 0,
          low_threshold DOUBLE PRECISION NOT NULL DEFAULT 0,
          cost_price DOUBLE PRECISION,
          updated_at TIMESTAMPTZ NOT NULL
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS stock_movements (
          id TEXT PRIMARY KEY,
          product_id TEXT NOT NULL,
          kind TEXT NOT NULL,
          quantity DOUBLE PRECISION NOT NULL,
          reason TEXT NOT NULL DEFAULT '',
          order_id TEXT,
          created_at TIMESTAMPTZ NOT NULL
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS recipe_lines (
          menu_item_id TEXT NOT NULL,
          stock_product_id TEXT NOT NULL,
          qty_per_unit DOUBLE PRECISION NOT NULL,
          PRIMARY KEY (menu_item_id, stock_product_id)
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS expenses (
          id TEXT PRIMARY KEY,
          amount DOUBLE PRECISION NOT NULL,
          category TEXT NOT NULL,
          note TEXT NOT NULL DEFAULT '',
          expense_date DATE NOT NULL,
          created_at TIMESTAMPTZ NOT NULL
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS ledger_income (
          order_id TEXT PRIMARY KEY,
          amount DOUBLE PRECISION NOT NULL,
          created_at TIMESTAMPTZ NOT NULL
        );
      `;
    })();
  }
  return schemaReady;
}

function rowToOrder(row: {
  id: string;
  ticket_id: string;
  table_id: string;
  table_label: string;
  guest_name: string;
  notes: string;
  lines: unknown;
  total: number;
  created_at: Date | string;
  status: string;
}): StoredOrder {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    table: { id: row.table_id, label: row.table_label },
    guestName: row.guest_name,
    notes: row.notes,
    lines: row.lines as StoredOrder["lines"],
    total: row.total,
    createdAt: new Date(row.created_at).toISOString(),
    status: row.status as StoredOrder["status"],
  };
}

export async function pgListOrders(): Promise<StoredOrder[]> {
  await ensurePostgresSchema();
  const { rows } = await sql`
    SELECT * FROM orders ORDER BY created_at DESC
  `;
  return rows.map((row) => rowToOrder(row as Parameters<typeof rowToOrder>[0]));
}

export async function pgGetOrder(id: string): Promise<StoredOrder | null> {
  await ensurePostgresSchema();
  const { rows } = await sql`SELECT * FROM orders WHERE id = ${id}`;
  if (!rows[0]) return null;
  return rowToOrder(rows[0] as Parameters<typeof rowToOrder>[0]);
}

export async function pgAddOrder(order: StoredOrder): Promise<void> {
  await ensurePostgresSchema();
  await sql`
    INSERT INTO orders (id, ticket_id, table_id, table_label, guest_name, notes, lines, total, created_at, status)
    VALUES (
      ${order.id},
      ${order.ticketId},
      ${order.table.id},
      ${order.table.label},
      ${order.guestName},
      ${order.notes},
      ${JSON.stringify(order.lines)},
      ${order.total},
      ${order.createdAt},
      ${order.status}
    )
  `;
}

export async function pgUpdateOrderStatus(id: string, status: StoredOrder["status"]): Promise<StoredOrder | null> {
  await ensurePostgresSchema();
  const { rows } = await sql`
    UPDATE orders SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  if (!rows[0]) return null;
  return rowToOrder(rows[0] as Parameters<typeof rowToOrder>[0]);
}

export async function pgGetIdempotentOrder(key: string): Promise<StoredOrder | null> {
  await ensurePostgresSchema();
  const { rows } = await sql`
    SELECT o.* FROM idempotency i
    JOIN orders o ON o.id = i.order_id
    WHERE i.key = ${key} AND i.expires_at > NOW()
  `;
  if (!rows[0]) return null;
  return rowToOrder(rows[0] as Parameters<typeof rowToOrder>[0]);
}

export async function pgSaveIdempotency(key: string, orderId: string, expiresAt: string): Promise<void> {
  await ensurePostgresSchema();
  await sql`
    INSERT INTO idempotency (key, order_id, expires_at)
    VALUES (${key}, ${orderId}, ${expiresAt})
    ON CONFLICT (key) DO UPDATE SET order_id = EXCLUDED.order_id, expires_at = EXCLUDED.expires_at
  `;
}

export async function pgIsOrderFulfilled(orderId: string): Promise<boolean> {
  await ensurePostgresSchema();
  const { rows } = await sql`SELECT 1 FROM order_fulfillment WHERE order_id = ${orderId}`;
  return Boolean(rows[0]);
}

export async function pgMarkOrderFulfilled(orderId: string, idempotencyKey: string | null): Promise<void> {
  await ensurePostgresSchema();
  await sql`
    INSERT INTO order_fulfillment (order_id, idempotency_key, fulfilled_at)
    VALUES (${orderId}, ${idempotencyKey}, ${new Date().toISOString()})
    ON CONFLICT (order_id) DO NOTHING
  `;
}

export async function pgRecordOrderIncome(orderId: string, amount: number, createdAt: string): Promise<void> {
  await ensurePostgresSchema();
  await sql`
    INSERT INTO ledger_income (order_id, amount, created_at)
    VALUES (${orderId}, ${amount}, ${createdAt})
    ON CONFLICT (order_id) DO NOTHING
  `;
}

export async function pgListStockProducts(): Promise<StockProduct[]> {
  await ensurePostgresSchema();
  const { rows } = await sql`SELECT * FROM stock_products ORDER BY name ASC`;
  return rows.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    barcode: (row.barcode as string | null) ?? null,
    unit: row.unit as StockProduct["unit"],
    quantity: row.quantity as number,
    lowThreshold: row.low_threshold as number,
    costPrice: (row.cost_price as number | null) ?? null,
    updatedAt: new Date(row.updated_at as string).toISOString(),
  }));
}

export async function pgUpsertStockProduct(product: StockProduct): Promise<void> {
  await ensurePostgresSchema();
  await sql`
    INSERT INTO stock_products (id, name, barcode, unit, quantity, low_threshold, cost_price, updated_at)
    VALUES (
      ${product.id},
      ${product.name},
      ${product.barcode},
      ${product.unit},
      ${product.quantity},
      ${product.lowThreshold},
      ${product.costPrice},
      ${product.updatedAt}
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      barcode = EXCLUDED.barcode,
      unit = EXCLUDED.unit,
      quantity = EXCLUDED.quantity,
      low_threshold = EXCLUDED.low_threshold,
      cost_price = EXCLUDED.cost_price,
      updated_at = EXCLUDED.updated_at
  `;
}

export async function pgFindProductByBarcode(barcode: string): Promise<StockProduct | null> {
  await ensurePostgresSchema();
  const { rows } = await sql`SELECT * FROM stock_products WHERE barcode = ${barcode}`;
  if (!rows[0]) return null;
  const row = rows[0];
  return {
    id: row.id as string,
    name: row.name as string,
    barcode: (row.barcode as string | null) ?? null,
    unit: row.unit as StockProduct["unit"],
    quantity: row.quantity as number,
    lowThreshold: row.low_threshold as number,
    costPrice: (row.cost_price as number | null) ?? null,
    updatedAt: new Date(row.updated_at as string).toISOString(),
  };
}

export async function pgAddStockMovement(movement: StockMovement): Promise<void> {
  await ensurePostgresSchema();
  await sql`
    INSERT INTO stock_movements (id, product_id, kind, quantity, reason, order_id, created_at)
    VALUES (
      ${movement.id},
      ${movement.productId},
      ${movement.kind},
      ${movement.quantity},
      ${movement.reason},
      ${movement.orderId},
      ${movement.createdAt}
    )
  `;
}

export async function pgListStockMovements(limit = 200): Promise<StockMovement[]> {
  await ensurePostgresSchema();
  const { rows } = await sql`
    SELECT * FROM stock_movements ORDER BY created_at DESC LIMIT ${limit}
  `;
  return rows.map((row) => ({
    id: row.id as string,
    productId: row.product_id as string,
    kind: row.kind as StockMovement["kind"],
    quantity: row.quantity as number,
    reason: row.reason as string,
    orderId: (row.order_id as string | null) ?? null,
    createdAt: new Date(row.created_at as string).toISOString(),
  }));
}

export async function pgGetRecipeLines(): Promise<RecipeLine[]> {
  await ensurePostgresSchema();
  const { rows } = await sql`SELECT * FROM recipe_lines`;
  return rows.map((row) => ({
    menuItemId: row.menu_item_id as string,
    stockProductId: row.stock_product_id as string,
    qtyPerUnit: row.qty_per_unit as number,
  }));
}

export async function pgSetRecipeLines(lines: RecipeLine[]): Promise<void> {
  await ensurePostgresSchema();
  await sql`DELETE FROM recipe_lines`;
  for (const line of lines) {
    await sql`
      INSERT INTO recipe_lines (menu_item_id, stock_product_id, qty_per_unit)
      VALUES (${line.menuItemId}, ${line.stockProductId}, ${line.qtyPerUnit})
    `;
  }
}

export async function pgListExpenses(): Promise<Expense[]> {
  await ensurePostgresSchema();
  const { rows } = await sql`SELECT * FROM expenses ORDER BY expense_date DESC, created_at DESC`;
  return rows.map((row) => ({
    id: row.id as string,
    amount: row.amount as number,
    category: row.category as Expense["category"],
    note: row.note as string,
    expenseDate: String(row.expense_date).slice(0, 10),
    createdAt: new Date(row.created_at as string).toISOString(),
  }));
}

export async function pgAddExpense(expense: Expense): Promise<void> {
  await ensurePostgresSchema();
  await sql`
    INSERT INTO expenses (id, amount, category, note, expense_date, created_at)
    VALUES (
      ${expense.id},
      ${expense.amount},
      ${expense.category},
      ${expense.note},
      ${expense.expenseDate},
      ${expense.createdAt}
    )
  `;
}

export async function pgListLedgerIncome(): Promise<LedgerIncome[]> {
  await ensurePostgresSchema();
  const { rows } = await sql`SELECT * FROM ledger_income ORDER BY created_at DESC`;
  return rows.map((row) => ({
    orderId: row.order_id as string,
    amount: row.amount as number,
    createdAt: new Date(row.created_at as string).toISOString(),
  }));
}

export async function loadSnapshotFromPostgres(): Promise<DatabaseSnapshot> {
  await ensurePostgresSchema();
  const orders = await pgListOrders();
  const stockProducts = await pgListStockProducts();
  const stockMovements = await pgListStockMovements(500);
  const recipes = await pgGetRecipeLines();
  const expenses = await pgListExpenses();
  const ledgerIncome = await pgListLedgerIncome();
  const { rows: fulfillmentRows } = await sql`SELECT * FROM order_fulfillment`;
  const fulfillment: OrderFulfillment[] = fulfillmentRows.map((row) => ({
    orderId: row.order_id as string,
    idempotencyKey: (row.idempotency_key as string | null) ?? null,
    fulfilledAt: new Date(row.fulfilled_at as string).toISOString(),
  }));
  const { rows: idemRows } = await sql`SELECT * FROM idempotency`;
  const idempotency: IdempotencyRecord[] = idemRows.map((row) => ({
    key: row.key as string,
    orderId: row.order_id as string,
    expiresAt: new Date(row.expires_at as string).toISOString(),
  }));
  return {
    orders,
    idempotency,
    fulfillment,
    stockProducts,
    stockMovements,
    recipes,
    expenses,
    ledgerIncome,
  };
}
