export type TableRef = {
  id: string;
  label: string;
};

const TABLE_TOKEN = /^chp-t(0[1-9]|[1-9]\d)$/i;

export function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

export function isValidTableToken(raw: string | null | undefined): boolean {
  if (!raw) return false;
  return TABLE_TOKEN.test(raw.trim());
}

export function resolveTableFromQr(raw: string | null | undefined): TableRef | null {
  const id = raw?.trim();
  if (!id || !isValidTableToken(id)) return null;

  const match = id.match(/^chp-t0*(\d+)$/i);
  if (!match?.[1]) return null;

  return { id: id.toLowerCase(), label: String(Number(match[1])) };
}

export function tableIdFromNumber(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 99) {
    throw new Error("Invalid table number");
  }
  return `chp-t${String(n).padStart(2, "0")}`;
}

export function guestMenuUrl(origin: string, tableId: string): string {
  const base = origin.replace(/\/$/, "");
  return `${base}/?table=${encodeURIComponent(tableId)}`;
}

export function assertValidTable(table: unknown): TableRef | null {
  if (!table || typeof table !== "object") return null;
  const record = table as Record<string, unknown>;
  const id = typeof record.id === "string" ? record.id.trim() : "";
  if (!isValidTableToken(id)) return null;
  return resolveTableFromQr(id);
}
