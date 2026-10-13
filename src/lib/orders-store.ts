import type { StoredOrder } from "@/lib/order-types";
import {
  addOrder as storeAddOrder,
  getOrderById as storeGetOrderById,
  listOrders as storeListOrders,
  updateOrderStatus as storeUpdateOrderStatus,
} from "@/lib/store";

export function listOrders(): Promise<StoredOrder[]> {
  return storeListOrders();
}

export function getOrderById(id: string): Promise<StoredOrder | null> {
  return storeGetOrderById(id);
}

export function addOrder(order: StoredOrder): Promise<StoredOrder> {
  return storeAddOrder(order);
}

export function updateOrderStatus(
  id: string,
  status: StoredOrder["status"],
): Promise<StoredOrder | null> {
  return storeUpdateOrderStatus(id, status);
}
