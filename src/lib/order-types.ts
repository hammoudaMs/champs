import type { TableRef } from "@/lib/table";

export type OrderStatus = "new" | "preparing" | "ready" | "served";

export type OrderLine = {
  key: string;
  itemId: string;
  name: string;
  flavor?: string;
  price: number;
  qty: number;
};

export type StoredOrder = {
  id: string;
  ticketId: string;
  table: TableRef;
  guestName: string;
  notes: string;
  lines: OrderLine[];
  total: number;
  createdAt: string;
  status: OrderStatus;
};

export const ORDER_STATUSES: OrderStatus[] = ["new", "preparing", "ready", "served"];

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}
