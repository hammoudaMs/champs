"use client";

import { useCallback, useEffect, useState } from "react";
import type { CaisseSummary } from "@/lib/caisse-logic";
import { formatDateTimeTunis, formatPrice } from "@/lib/format";
import type { ExpenseCategory } from "@/lib/stock-types";
import { EXPENSE_CATEGORIES } from "@/lib/stock-types";
import { useI18n } from "@/i18n/i18n-provider";
import type { MsgKey } from "@/i18n/fr";

const CATEGORY_LABEL: Record<ExpenseCategory, MsgKey> = {
  supplier: "caisse.catSupplier",
  rent: "caisse.catRent",
  salary: "caisse.catSalary",
  other: "caisse.catOther",
};

export function CaissePanel() {
  const { t } = useI18n();
  const [summary, setSummary] = useState<CaisseSummary | null>(null);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("supplier");
  const [note, setNote] = useState("");
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().slice(0, 10));

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/caisse/summary", { cache: "no-store" });
      if (!response.ok) throw new Error("load");
      const data = await response.json();
      setSummary(data.summary);
      setError("");
    } catch {
      setError(t("caisse.loadError"));
    }
  }, [t]);

  useEffect(() => {
    const start = window.setTimeout(() => void load(), 0);
    const timer = window.setInterval(() => void load(), 8000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [load]);

  async function addExpense() {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    const response = await fetch("/api/caisse/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: value, category, note, expenseDate }),
    });
    if (!response.ok) {
      setError(t("caisse.saveError"));
      return;
    }
    setAmount("");
    setNote("");
    await load();
  }

  function periodCard(title: string, totals: CaisseSummary["today"]) {
    return (
      <div className="rounded-2xl bg-ink-soft px-4 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{title}</p>
        <p className="mt-2 text-sm text-cream">
          {t("caisse.income")}: <span className="text-gold">{formatPrice(totals.income)}</span>
        </p>
        <p className="text-sm text-cream">
          {t("caisse.expenses")}: <span className="text-gold">{formatPrice(totals.expenses)}</span>
        </p>
        <p className="mt-1 font-display text-2xl text-cream">
          {t("caisse.profit")}: {formatPrice(totals.profit)}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 max-w-6xl space-y-6">
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      {summary ? (
        <div className="grid gap-3 md:grid-cols-3">
          {periodCard(t("caisse.today"), summary.today)}
          {periodCard(t("caisse.week"), summary.week)}
          {periodCard(t("caisse.month"), summary.month)}
        </div>
      ) : null}

      <section className="rounded-[1.4rem] border border-[var(--line)] p-4">
        <h2 className="font-display text-2xl text-gold">{t("caisse.expenseTitle")}</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder={t("caisse.amountPh")}
            className="min-h-11 rounded-xl border border-[var(--line)] bg-ink-soft px-3 text-cream"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="min-h-11 rounded-xl border border-[var(--line)] bg-ink-soft px-3 text-cream"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{t(CATEGORY_LABEL[cat])}</option>
            ))}
          </select>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="min-h-11 rounded-xl border border-[var(--line)] bg-ink-soft px-3 text-cream"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("caisse.notePh")}
            className="min-h-11 rounded-xl border border-[var(--line)] bg-ink-soft px-3 text-cream"
          />
        </div>
        <button
          type="button"
          onClick={() => void addExpense()}
          className="mt-3 min-h-11 rounded-full bg-accent px-4 text-sm font-semibold text-white"
        >
          {t("caisse.addExpense")}
        </button>
      </section>

      <section className="rounded-[1.4rem] border border-[var(--line)] p-4">
        <h2 className="font-display text-2xl text-gold">{t("caisse.history")}</h2>
        <ul className="mt-3 max-h-[28rem] space-y-2 overflow-y-auto">
          {summary?.transactions.map((tx) => (
            <li
              key={tx.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-ink-soft px-3 py-3 text-sm"
            >
              <div>
                <p className="text-cream">
                  {tx.kind === "income" ? t("caisse.incomeOrder") : t(CATEGORY_LABEL[tx.category as ExpenseCategory] ?? "caisse.catOther")}
                </p>
                <p className="text-xs text-muted">{formatDateTimeTunis(tx.at)}</p>
                {tx.note ? <p className="text-xs italic text-muted">{tx.note}</p> : null}
              </div>
              <span className={tx.kind === "income" ? "text-gold" : "text-[var(--danger)]"}>
                {tx.kind === "income" ? "+" : "−"}
                {formatPrice(tx.amount)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
