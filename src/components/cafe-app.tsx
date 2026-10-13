"use client";

import { useState, useSyncExternalStore } from "react";
import { CartProvider, useCart, type PlacedOrder } from "@/context/cart-context";
import { WelcomeGate } from "@/components/welcome-gate";
import { MenuView } from "@/components/menu-view";
import { OrderTicket } from "@/components/order-ticket";
import type { TableRef } from "@/lib/table";
import {
  clearActiveOrder,
  readActiveOrder,
  subscribeActiveOrder,
  writeActiveOrder,
} from "@/lib/active-order";

function CafeExperience({ table }: { table: TableRef }) {
  const { clear } = useCart();
  const order = useSyncExternalStore(subscribeActiveOrder, readActiveOrder, () => null);
  const [browsing, setBrowsing] = useState(false);

  if (order && !browsing) {
    return (
      <OrderTicket
        order={order}
        onStatus={writeActiveOrder}
        onNewOrder={() => {
          clearActiveOrder();
          clear();
          setBrowsing(true);
        }}
      />
    );
  }

  if (!browsing) {
    return <WelcomeGate table={table} onEnter={() => setBrowsing(true)} />;
  }

  return (
    <MenuView
      onPlaced={(next: PlacedOrder) => {
        writeActiveOrder(next);
        clear();
        setBrowsing(false);
      }}
    />
  );
}

export function CafeApp({ table }: { table: TableRef }) {
  return (
    <main className="app-frame">
      <CartProvider table={table}>
        <CafeExperience table={table} />
      </CartProvider>
    </main>
  );
}
