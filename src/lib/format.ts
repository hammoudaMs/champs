export function formatPrice(value: number): string {
  const formatted = value.toLocaleString("fr-TN", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  return `${formatted} DT`;
}

const TUNIS_TZ = "Africa/Tunis";

export function formatClock(date: Date): string {
  return date.toLocaleTimeString("fr-FR", {
    timeZone: TUNIS_TZ,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTimeTunis(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: TUNIS_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${pick("day")}/${pick("month")}/${pick("year")} ${pick("hour")}:${pick("minute")}`;
}

export function createTicketId(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `CHP-${n}`;
}

export function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
