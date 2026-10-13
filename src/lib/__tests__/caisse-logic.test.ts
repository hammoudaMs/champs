import { describe, expect, it } from "vitest";
import { buildCaisseSummary } from "@/lib/caisse-logic";

describe("buildCaisseSummary", () => {
  it("sums income and expenses for today", () => {
    const now = new Date("2026-10-13T12:00:00.000Z");
    const summary = buildCaisseSummary(
      [
        { orderId: "o1", amount: 20, createdAt: "2026-10-13T10:00:00.000Z" },
        { orderId: "o2", amount: 15, createdAt: "2026-10-12T10:00:00.000Z" },
      ],
      [
        {
          id: "e1",
          amount: 5,
          category: "supplier",
          note: "",
          expenseDate: "2026-10-13",
          createdAt: "2026-10-13T09:00:00.000Z",
        },
      ],
      now,
    );
    expect(summary.today.income).toBe(20);
    expect(summary.today.expenses).toBe(5);
    expect(summary.today.profit).toBe(15);
    expect(summary.month.income).toBeGreaterThanOrEqual(20);
  });
});
