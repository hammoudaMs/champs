"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const BarcodeScanner = dynamic(
  () => import("@/components/barcode-scanner").then((mod) => mod.BarcodeScanner),
  { ssr: false },
);
import { formatDateTimeTunis } from "@/lib/format";
import { isLowStock } from "@/lib/stock-logic";
import type { StockProduct, StockUnit } from "@/lib/stock-types";
import { STOCK_UNITS } from "@/lib/stock-types";
import { useI18n } from "@/i18n/i18n-provider";

type ProductRow = StockProduct & { lowStock?: boolean };

export function StockPanel() {
  const { t } = useI18n();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addQty, setAddQty] = useState("1");
  const [addReason, setAddReason] = useState("");
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState<StockUnit>("pcs");
  const [newBarcode, setNewBarcode] = useState("");
  const [newLow, setNewLow] = useState("5");
  const [recipeMenuId, setRecipeMenuId] = useState("");
  const [recipeProductId, setRecipeProductId] = useState("");
  const [recipeQty, setRecipeQty] = useState("1");
  const [menuItems, setMenuItems] = useState<{ id: string; name: string }[]>([]);
  const [recipes, setRecipes] = useState<
    { menuItemId: string; stockProductId: string; qtyPerUnit: number }[]
  >([]);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/stock/products", { cache: "no-store" });
      if (!response.ok) throw new Error("load");
      const data = await response.json();
      setProducts(data.products ?? []);
      setError("");
    } catch {
      setError(t("stock.loadError"));
    }
  }, [t]);

  const loadRecipes = useCallback(async () => {
    const response = await fetch("/api/stock/recipes", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    setRecipes(data.recipes ?? []);
    setMenuItems(data.menuItems ?? []);
  }, []);

  useEffect(() => {
    const start = window.setTimeout(() => {
      void load();
      void loadRecipes();
    }, 0);
    return () => window.clearTimeout(start);
  }, [load, loadRecipes]);

  const selected = products.find((p) => p.id === selectedId) ?? null;

  async function resolveBarcode(code: string) {
    const trimmed = code.trim();
    if (!trimmed) return;
    setBarcodeInput(trimmed);
    const response = await fetch(`/api/stock/lookup?barcode=${encodeURIComponent(trimmed)}`, {
      cache: "no-store",
    });
    if (!response.ok) return;
    const data = await response.json();
    if (data.product) {
      setSelectedId(data.product.id);
      setCreateOpen(false);
      return;
    }
    setNewBarcode(trimmed);
    setCreateOpen(true);
    setNewName("");
  }

  async function createProduct() {
    const response = await fetch("/api/stock/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        barcode: newBarcode || null,
        unit: newUnit,
        quantity: 0,
        lowThreshold: Number(newLow) || 0,
      }),
    });
    if (!response.ok) {
      setError(t("stock.saveError"));
      return;
    }
    const data = await response.json();
    setCreateOpen(false);
    setSelectedId(data.product.id);
    await load();
  }

  async function addStock() {
    if (!selected) return;
    const quantity = Number(addQty);
    if (!Number.isFinite(quantity) || quantity <= 0) return;
    const response = await fetch("/api/stock/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "in",
        productId: selected.id,
        quantity,
        reason: addReason || t("stock.defaultInReason"),
      }),
    });
    if (!response.ok) {
      setError(t("stock.moveError"));
      return;
    }
    setAddQty("1");
    setAddReason("");
    await load();
  }

  async function adjustStock() {
    if (!selected) return;
    const newQuantity = Number(adjustQty);
    if (!Number.isFinite(newQuantity) || newQuantity < 0) return;
    if (!adjustReason.trim()) {
      setError(t("stock.reasonRequired"));
      return;
    }
    const response = await fetch("/api/stock/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "adjust",
        productId: selected.id,
        newQuantity,
        reason: adjustReason,
      }),
    });
    if (!response.ok) {
      setError(t("stock.moveError"));
      return;
    }
    setAdjustReason("");
    await load();
  }

  async function saveRecipe() {
    const next = [
      ...recipes.filter((r) => r.menuItemId !== recipeMenuId || r.stockProductId !== recipeProductId),
      {
        menuItemId: recipeMenuId,
        stockProductId: recipeProductId,
        qtyPerUnit: Number(recipeQty) || 1,
      },
    ];
    const response = await fetch("/api/stock/recipes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines: next }),
    });
    if (response.ok) {
      setRecipes(next);
    }
  }

  return (
    <div className="mx-auto mt-6 max-w-6xl space-y-6">
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <section className="rounded-[1.4rem] border border-[var(--line)] p-4">
        <h2 className="font-display text-2xl text-gold">{t("stock.receiveTitle")}</h2>
        <p className="mt-1 text-sm text-muted">{t("stock.receiveCopy")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setScanning((v) => !v)}
            className="min-h-11 rounded-full bg-accent px-4 text-sm font-semibold text-white"
          >
            {scanning ? t("stock.stopScan") : t("stock.scan")}
          </button>
        </div>
        {scanning ? (
          <div className="mt-4">
            <BarcodeScanner
              active={scanning}
              onDetected={(code) => void resolveBarcode(code)}
            />
          </div>
        ) : null}
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void resolveBarcode(barcodeInput);
          }}
        >
          <input
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            placeholder={t("stock.barcodePh")}
            className="min-h-11 flex-1 rounded-xl border border-[var(--line)] bg-ink-soft px-3 text-cream"
          />
          <button
            type="submit"
            className="min-h-11 rounded-xl border border-[var(--line)] px-4 text-sm text-cream"
          >
            {t("stock.lookup")}
          </button>
        </form>
      </section>

      {createOpen ? (
        <section className="rounded-[1.4rem] border border-gold/40 bg-ink-soft p-4">
          <h3 className="font-display text-xl text-gold">{t("stock.createProduct")}</h3>
          <p className="text-sm text-muted">{t("stock.unknownBarcode", { code: newBarcode })}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("stock.namePh")}
              className="min-h-11 rounded-xl border border-[var(--line)] px-3 text-cream"
            />
            <select
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value as StockUnit)}
              className="min-h-11 rounded-xl border border-[var(--line)] px-3 text-cream"
            >
              {STOCK_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <input
              value={newLow}
              onChange={(e) => setNewLow(e.target.value)}
              inputMode="decimal"
              placeholder={t("stock.lowPh")}
              className="min-h-11 rounded-xl border border-[var(--line)] px-3 text-cream"
            />
          </div>
          <button
            type="button"
            onClick={() => void createProduct()}
            className="mt-3 min-h-11 rounded-full bg-accent px-4 text-sm font-semibold text-white"
          >
            {t("stock.create")}
          </button>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.4rem] border border-[var(--line)] p-4">
          <h2 className="font-display text-2xl text-gold">{t("stock.inventory")}</h2>
          <ul className="mt-3 max-h-[24rem] space-y-2 overflow-y-auto">
            {products.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(product.id);
                    setAdjustQty(String(product.quantity));
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-3 text-left ${
                    selectedId === product.id ? "bg-accent/20" : "bg-ink-soft"
                  }`}
                >
                  <span className="text-cream">
                    {product.name}
                    {product.barcode ? (
                      <span className="ml-2 text-xs text-muted">({product.barcode})</span>
                    ) : null}
                  </span>
                  <span className="text-sm text-gold">
                    {product.quantity} {product.unit}
                    {isLowStock(product.quantity, product.lowThreshold) ? (
                      <span className="ml-2 rounded-full bg-[var(--danger)]/20 px-2 py-0.5 text-[10px] uppercase text-[var(--danger)]">
                        {t("stock.low")}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.4rem] border border-[var(--line)] p-4">
          <h2 className="font-display text-2xl text-gold">{t("stock.actions")}</h2>
          {!selected ? (
            <p className="mt-4 text-sm text-muted">{t("stock.pickProduct")}</p>
          ) : (
            <div className="mt-3 space-y-4">
              <p className="text-cream">
                <span className="font-display text-xl">{selected.name}</span>
                <span className="ml-2 text-sm text-muted">
                  {formatDateTimeTunis(selected.updatedAt)}
                </span>
              </p>
              <div className="rounded-xl bg-ink-soft p-3">
                <p className="text-sm font-semibold text-gold">{t("stock.addIn")}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <input
                    value={addQty}
                    onChange={(e) => setAddQty(e.target.value)}
                    inputMode="decimal"
                    className="min-h-10 w-24 rounded-lg border border-[var(--line)] px-2 text-cream"
                  />
                  <input
                    value={addReason}
                    onChange={(e) => setAddReason(e.target.value)}
                    placeholder={t("stock.reasonPh")}
                    className="min-h-10 flex-1 rounded-lg border border-[var(--line)] px-2 text-cream"
                  />
                  <button
                    type="button"
                    onClick={() => void addStock()}
                    className="min-h-10 rounded-full bg-accent px-4 text-sm font-semibold text-white"
                  >
                    {t("stock.add")}
                  </button>
                </div>
              </div>
              <div className="rounded-xl bg-ink-soft p-3">
                <p className="text-sm font-semibold text-gold">{t("stock.adjust")}</p>
                <p className="mt-1 text-xs text-muted">{t("stock.adjustCopy")}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <input
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                    inputMode="decimal"
                    className="min-h-10 w-24 rounded-lg border border-[var(--line)] px-2 text-cream"
                  />
                  <input
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder={t("stock.adjustReasonPh")}
                    className="min-h-10 flex-1 rounded-lg border border-[var(--line)] px-2 text-cream"
                  />
                  <button
                    type="button"
                    onClick={() => void adjustStock()}
                    className="min-h-10 rounded-full border border-[var(--line)] px-4 text-sm text-cream"
                  >
                    {t("stock.saveAdjust")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[1.4rem] border border-[var(--line)] p-4">
        <h2 className="font-display text-2xl text-gold">{t("stock.recipes")}</h2>
        <p className="mt-1 text-sm text-muted">{t("stock.recipesCopy")}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <select
            value={recipeMenuId}
            onChange={(e) => setRecipeMenuId(e.target.value)}
            className="min-h-10 rounded-lg border border-[var(--line)] px-2 text-cream"
          >
            <option value="">{t("stock.menuItem")}</option>
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <select
            value={recipeProductId}
            onChange={(e) => setRecipeProductId(e.target.value)}
            className="min-h-10 rounded-lg border border-[var(--line)] px-2 text-cream"
          >
            <option value="">{t("stock.stockItem")}</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            value={recipeQty}
            onChange={(e) => setRecipeQty(e.target.value)}
            inputMode="decimal"
            className="min-h-10 w-24 rounded-lg border border-[var(--line)] px-2 text-cream"
          />
          <button
            type="button"
            onClick={() => void saveRecipe()}
            className="min-h-10 rounded-full bg-accent px-4 text-sm font-semibold text-white"
          >
            {t("stock.linkRecipe")}
          </button>
        </div>
        <ul className="mt-4 space-y-1 text-sm text-muted">
          {recipes.map((line) => {
            const menu = menuItems.find((m) => m.id === line.menuItemId);
            const prod = products.find((p) => p.id === line.stockProductId);
            return (
              <li key={`${line.menuItemId}-${line.stockProductId}`}>
                {menu?.name ?? line.menuItemId} → {prod?.name ?? line.stockProductId} × {line.qtyPerUnit}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
