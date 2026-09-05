export type TableRef = {
  id: string;
  label: string;
};

export const MOCK_TABLE: TableRef = {
  id: "chp-t04",
  label: "4",
};

export function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

export function resolveTableFromQr(raw: string | null | undefined): TableRef {
  const id = raw?.trim();
  if (!id) return MOCK_TABLE;

  const numbered = id.match(/^(?:chp[-_])?t?0*(\d+)$/i);
  if (numbered?.[1]) {
    return { id, label: numbered[1] };
  }

  return { id, label: id };
}

export function tableIdFromNumber(n: number): string {
  return `chp-t${String(n).padStart(2, "0")}`;
}

export function guestMenuUrl(origin: string, tableId: string): string {
  const base = origin.replace(/\/$/, "");
  return `${base}/?table=${encodeURIComponent(tableId)}`;
}
