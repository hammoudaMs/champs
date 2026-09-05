export function formatPrice(value: number): string {
  const formatted = value.toLocaleString("fr-FR", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1,
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
