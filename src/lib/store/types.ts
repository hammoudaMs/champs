import type { StoredOrder } from "@/lib/order-types";
import type {
  Expense,
  LedgerIncome,
  RecipeLine,
  StockMovement,
  StockProduct,
} from "@/lib/stock-types";

export type IdempotencyRecord = {
  key: string;
  orderId: string;
  expiresAt: string;
};

export type OrderFulfillment = {
  orderId: string;
  idempotencyKey: string | null;
  fulfilledAt: string;
};

export type DatabaseSnapshot = {
  orders: StoredOrder[];
  idempotency: IdempotencyRecord[];
  fulfillment: OrderFulfillment[];
  stockProducts: StockProduct[];
  stockMovements: StockMovement[];
  recipes: RecipeLine[];
  expenses: Expense[];
  ledgerIncome: LedgerIncome[];
};

export function emptySnapshot(): DatabaseSnapshot {
  return {
    orders: [],
    idempotency: [],
    fulfillment: [],
    stockProducts: [],
    stockMovements: [],
    recipes: [],
    expenses: [],
    ledgerIncome: [],
  };
}
