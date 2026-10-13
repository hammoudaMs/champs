import type { Expense, LedgerIncome } from "@/lib/stock-types";

export type MoneyTransaction = {
  id: string;
  kind: "income" | "expense";
  amount: number;
  category: string;
  note: string;
  at: string;
  orderId?: string;
};

export type PeriodTotals = {
  income: number;
  expenses: number;
  profit: number;
};

export type CaisseSummary = {
  today: PeriodTotals;
  week: PeriodTotals;
  month: PeriodTotals;
  transactions: MoneyTransaction[];
};

const TUNIS_TZ = "Africa/Tunis";

function tunisYmd(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: TUNIS_TZ });
}

function startOfWeekTunis(now: Date): Date {
  const ymd = tunisYmd(now);
  const [y, m, d] = ymd.split("-").map(Number);
  const utcGuess = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: TUNIS_TZ,
    weekday: "short",
  }).format(utcGuess);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const day = map[weekday] ?? 0;
  const mondayOffset = day === 0 ? -6 : 1 - day;
  utcGuess.setUTCDate(utcGuess.getUTCDate() + mondayOffset);
  return utcGuess;
}

function startOfMonthTunis(now: Date): string {
  const ymd = tunisYmd(now);
  return `${ymd.slice(0, 7)}-01`;
}

function inRangeTunis(iso: string, startYmd: string, endYmd: string): boolean {
  const at = new Date(iso);
  const ymd = tunisYmd(at);
  return ymd >= startYmd && ymd <= endYmd;
}

function sumPeriod(
  income: LedgerIncome[],
  expenses: Expense[],
  startYmd: string,
  endYmd: string,
): PeriodTotals {
  let inc = 0;
  for (const row of income) {
    if (inRangeTunis(row.createdAt, startYmd, endYmd)) inc += row.amount;
  }
  let exp = 0;
  for (const row of expenses) {
    if (row.expenseDate >= startYmd && row.expenseDate <= endYmd) exp += row.amount;
  }
  return { income: roundMoney(inc), expenses: roundMoney(exp), profit: roundMoney(inc - exp) };
}

export function roundMoney(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function buildCaisseSummary(
  income: LedgerIncome[],
  expenses: Expense[],
  now = new Date(),
): CaisseSummary {
  const todayYmd = tunisYmd(now);
  const weekStart = tunisYmd(startOfWeekTunis(now));
  const monthStart = startOfMonthTunis(now);

  const transactions: MoneyTransaction[] = [
    ...income.map((row) => ({
      id: `income:${row.orderId}`,
      kind: "income" as const,
      amount: row.amount,
      category: "order",
      note: "",
      at: row.createdAt,
      orderId: row.orderId,
    })),
    ...expenses.map((row) => ({
      id: `expense:${row.id}`,
      kind: "expense" as const,
      amount: row.amount,
      category: row.category,
      note: row.note,
      at: row.createdAt,
    })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  return {
    today: sumPeriod(income, expenses, todayYmd, todayYmd),
    week: sumPeriod(income, expenses, weekStart, todayYmd),
    month: sumPeriod(income, expenses, monthStart, todayYmd),
    transactions,
  };
}
