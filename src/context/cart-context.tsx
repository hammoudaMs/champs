"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { MenuItem } from "@/data/menu";
import type { OrderStatus } from "@/lib/order-types";
import type { TableRef } from "@/lib/table";

export type CartLine = {
  key: string;
  itemId: string;
  name: string;
  flavor?: string;
  price: number;
  qty: number;
};

export type PlacedOrder = {
  id: string;
  ticketId: string;
  table: TableRef;
  guestName: string;
  notes: string;
  lines: CartLine[];
  total: number;
  createdAt: string;
  status: OrderStatus;
};

type CartState = {
  lines: CartLine[];
};

type Action =
  | { type: "add"; item: MenuItem; flavor?: string }
  | { type: "inc"; key: string }
  | { type: "dec"; key: string }
  | { type: "clear" };

function lineKey(itemId: string, flavor?: string): string {
  return flavor ? `${itemId}::${flavor}` : itemId;
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "add": {
      const key = lineKey(action.item.id, action.flavor);
      const existing = state.lines.find((line) => line.key === key);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((line) =>
            line.key === key ? { ...line, qty: line.qty + 1 } : line,
          ),
        };
      }
      return {
        ...state,
        lines: [
          ...state.lines,
          {
            key,
            itemId: action.item.id,
            name: action.item.name,
            flavor: action.flavor,
            price: action.item.price,
            qty: 1,
          },
        ],
      };
    }
    case "inc":
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.key === action.key ? { ...line, qty: line.qty + 1 } : line,
        ),
      };
    case "dec":
      return {
        ...state,
        lines: state.lines
          .map((line) =>
            line.key === action.key ? { ...line, qty: line.qty - 1 } : line,
          )
          .filter((line) => line.qty > 0),
      };
    case "clear":
      return { ...state, lines: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  lines: CartLine[];
  table: TableRef;
  count: number;
  total: number;
  addItem: (item: MenuItem, flavor?: string) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  qtyForItem: (itemId: string) => number;
  removeOneFromItem: (itemId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  table,
}: {
  children: ReactNode;
  table: TableRef;
}) {
  const [state, dispatch] = useReducer(reducer, {
    lines: [],
  });

  const addItem = useCallback((item: MenuItem, flavor?: string) => {
    dispatch({ type: "add", item, flavor });
  }, []);

  const inc = useCallback((key: string) => {
    dispatch({ type: "inc", key });
  }, []);

  const dec = useCallback((key: string) => {
    dispatch({ type: "dec", key });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((sum, line) => sum + line.qty, 0);
    const total = state.lines.reduce((sum, line) => sum + line.price * line.qty, 0);
    return {
      lines: state.lines,
      table,
      count,
      total,
      addItem,
      inc,
      dec,
      qtyForItem: (itemId: string) =>
        state.lines
          .filter((line) => line.itemId === itemId)
          .reduce((sum, line) => sum + line.qty, 0),
      removeOneFromItem: (itemId: string) => {
        const line = [...state.lines].reverse().find((entry) => entry.itemId === itemId);
        if (line) dispatch({ type: "dec", key: line.key });
      },
      clear,
    };
  }, [state.lines, table, addItem, inc, dec, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
