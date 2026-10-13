export type StockUnit = "pcs" | "kg" | "L" | "pack";

export type StockMovementKind = "in" | "out" | "adjust" | "order";

export type StockProduct = {
  id: string;
  name: string;
  barcode: string | null;
  unit: StockUnit;
  quantity: number;
  lowThreshold: number;
  costPrice: number | null;
  updatedAt: string;
};

export type StockMovement = {
  id: string;
  productId: string;
  kind: StockMovementKind;
  quantity: number;
  reason: string;
  orderId: string | null;
  createdAt: string;
};

export type RecipeLine = {
  menuItemId: string;
  stockProductId: string;
  qtyPerUnit: number;
};

export type ExpenseCategory = "supplier" | "rent" | "salary" | "other";

export type Expense = {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note: string;
  expenseDate: string;
  createdAt: string;
};

export type LedgerIncome = {
  orderId: string;
  amount: number;
  createdAt: string;
};

export const STOCK_UNITS: StockUnit[] = ["pcs", "kg", "L", "pack"];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "supplier",
  "rent",
  "salary",
  "other",
];

export function isExpenseCategory(value: string): value is ExpenseCategory {
  return EXPENSE_CATEGORIES.includes(value as ExpenseCategory);
}

export function isStockUnit(value: string): value is StockUnit {
  return STOCK_UNITS.includes(value as StockUnit);
}
