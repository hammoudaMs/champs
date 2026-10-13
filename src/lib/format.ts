export function formatPrice(value: number): string {
  const formatted = value.toLocaleString("fr-TN", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  return `${formatted} DT`;
}

export function formatClock(date: Date): string {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
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
