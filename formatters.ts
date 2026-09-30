import { CurrencyCode, ExpenseItem } from '../types/finance';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'AU$',
};

export function formatCurrency(amount: number, currency: CurrencyCode = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  const rounded = Math.round(amount);

  if (currency === 'INR') {
    // Standard Indian number format (e.g. 1,50,000)
    try {
      const formatted = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0,
      }).format(rounded);
      return `${symbol}${formatted}`;
    } catch {
      return `${symbol}${rounded.toLocaleString()}`;
    }
  }

  return `${symbol}${rounded.toLocaleString()}`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${Number(value).toFixed(decimals)}%`;
}

// 50/30/20 standard categorization:
// Needs: Housing, Food, Transportation, Utilities, Healthcare, Education
// Wants: Entertainment, Shopping, Other
export const NEED_CATEGORIES = new Set([
  'housing',
  'food',
  'transportation',
  'utilities',
  'healthcare',
  'education',
  'rent',
  'groceries',
  'bills',
  'insurance',
]);

export function isNeedCategory(category: string): boolean {
  return NEED_CATEGORIES.has(category.toLowerCase().trim());
}

export function calculateFinancialTotals(
  income: number,
  otherIncome: number,
  expenses: ExpenseItem[]
) {
  const totalIncome = Math.max(0, income + (otherIncome || 0));
  const totalExpenses = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const availableBalance = Math.max(0, totalIncome - totalExpenses);

  let needsTotal = 0;
  let wantsTotal = 0;

  expenses.forEach((item) => {
    const amt = Number(item.amount) || 0;
    if (isNeedCategory(item.category)) {
      needsTotal += amt;
    } else {
      wantsTotal += amt;
    }
  });

  const needsPercentage = totalIncome > 0 ? (needsTotal / totalIncome) * 100 : 0;
  const wantsPercentage = totalIncome > 0 ? (wantsTotal / totalIncome) * 100 : 0;
  const savingsTotal = availableBalance;
  const savingsPercentage = totalIncome > 0 ? (savingsTotal / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    availableBalance,
    needsTotal,
    needsPercentage,
    wantsTotal,
    wantsPercentage,
    savingsTotal,
    savingsPercentage,
  };
}
