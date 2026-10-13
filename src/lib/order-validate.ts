import "server-only";
import { MENU } from "@/data/menu";
import type { OrderLine } from "@/lib/order-types";
import { assertValidTable, type TableRef } from "@/lib/table";

const MAX_QTY = 20;
const MAX_LINES = 30;
const MAX_NAME = 60;
const MAX_NOTES = 280;

const menuById = new Map(MENU.map((item) => [item.id, item]));

export type OrderValidationOk = {
  ok: true;
  table: TableRef;
  guestName: string;
  notes: string;
  lines: OrderLine[];
  total: number;
  ticketId: string;
  idempotencyKey: string | null;
};

export type OrderValidationErr = {
  ok: false;
  status: number;
  error: string;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateOrderPayload(
  body: unknown,
  idempotencyKey: string | null,
): OrderValidationOk | OrderValidationErr {
  if (!body || typeof body !== "object") {
    return { ok: false, status: 400, error: "invalid_body" };
  }

  const record = body as Record<string, unknown>;
  const table = assertValidTable(record.table);
  if (!table) {
    return { ok: false, status: 400, error: "invalid_table" };
  }

  if (!Array.isArray(record.lines) || record.lines.length === 0) {
    return { ok: false, status: 400, error: "empty_cart" };
  }

  if (record.lines.length > MAX_LINES) {
    return { ok: false, status: 400, error: "too_many_lines" };
  }

  const guestName = asString(record.guestName).slice(0, MAX_NAME);
  const notes = asString(record.notes).slice(0, MAX_NOTES);
  const ticketId = asString(record.ticketId).slice(0, 32);

  const lines: OrderLine[] = [];
  let total = 0;

  for (const entry of record.lines) {
    if (!entry || typeof entry !== "object") {
      return { ok: false, status: 400, error: "invalid_line" };
    }
    const line = entry as Record<string, unknown>;
    const itemId = asString(line.itemId);
    const menuItem = menuById.get(itemId);
    if (!menuItem) {
      return { ok: false, status: 400, error: "unknown_item" };
    }

    const qty = typeof line.qty === "number" ? line.qty : Number.NaN;
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      return { ok: false, status: 400, error: "invalid_qty" };
    }

    const flavor = asString(line.flavor) || undefined;
    if (flavor) {
      if (!menuItem.flavors?.includes(flavor)) {
        return { ok: false, status: 400, error: "invalid_flavor" };
      }
    } else if (menuItem.flavors?.length) {
      return { ok: false, status: 400, error: "flavor_required" };
    }

    const price = menuItem.price;
    const key = flavor ? `${itemId}::${flavor}` : itemId;
    lines.push({
      key,
      itemId,
      name: menuItem.name,
      flavor,
      price,
      qty,
    });
    total += price * qty;
  }

  total = Math.round(total * 100) / 100;

  return {
    ok: true,
    table,
    guestName,
    notes,
    lines,
    total,
    ticketId,
    idempotencyKey: idempotencyKey?.slice(0, 64) || null,
  };
}
