import { FinancialInput, FinancialAdviceResponse } from '../types/finance';
import { calculateFinancialTotals, formatCurrency } from '../utils/formatters';

export const DEMO_FINANCIAL_INPUT: FinancialInput = {
  income: 50000,
  otherIncome: 5000,
  currency: 'INR',
  expenses: [
    { id: 'exp-1', category: 'Housing', amount: 15000, label: 'Rent & Maintenance' },
    { id: 'exp-2', category: 'Food', amount: 7000, label: 'Groceries & Dining' },
    { id: 'exp-3', category: 'Transportation', amount: 4000, label: 'Fuel & Metro' },
    { id: 'exp-4', category: 'Utilities', amount: 3000, label: 'Electricity & Internet' },
    { id: 'exp-5', category: 'Entertainment', amount: 3000, label: 'Streaming & Outings' },
    { id: 'exp-6', category: 'Shopping', amount: 4000, label: 'Apparel & Personal' },
    { id: 'exp-7', category: 'Healthcare', amount: 2000, label: 'Medicine & Checkups' },
    { id: 'exp-8', category: 'Other', amount: 2000, label: 'Miscellaneous' },
  ],
  financialGoal: 'Build an emergency fund',
  targetAmount: 150000,
  targetDate: '2027-04-30',
  currentSavings: 40000,
  riskPreference: 'Balanced',
  notes: 'Planning to build a solid 6-month buffer before making any aggressive investments.',
};

export function generateRealisticAdvice(input: FinancialInput): FinancialAdviceResponse {
  const {
    totalIncome,
    totalExpenses,
    availableBalance,
    needsTotal,
    needsPercentage,
    wantsTotal,
    wantsPercentage,
  } = calculateFinancialTotals(input.income, input.otherIncome, input.expenses);

  const remainingToGoal = Math.max(0, input.targetAmount - input.currentSavings);
  
  // Suggested monthly savings allocation based on risk
  let targetSavingsRate = 0.20;
  if (input.riskPreference === 'Conservative') targetSavingsRate = 0.25;
  if (input.riskPreference === 'Aggressive') targetSavingsRate = 0.30;
  
  // Recommended savings cannot exceed available balance
  const recommendedSavings = Math.min(
    availableBalance,
    Math.max(Math.round(totalIncome * targetSavingsRate), Math.round(availableBalance * 0.8))
  );

  const estimatedMonths = recommendedSavings > 0
    ? Math.ceil(remainingToGoal / recommendedSavings)
    : 99;

  const goalProgress = input.targetAmount > 0
    ? Math.min(100, Math.round((input.currentSavings / input.targetAmount) * 1000) / 10)
    : 0;

  // Breakdown of needs
  const needsBreakdown = input.expenses
    .filter((e) => ['housing', 'food', 'transportation', 'utilities', 'healthcare', 'education'].includes(e.category.toLowerCase()))
    .map((e) => ({
      category: e.category,
      amount: e.amount,
      percentageOfIncome: totalIncome > 0 ? Math.round((e.amount / totalIncome) * 1000) / 10 : 0,
      percentageOfExpenses: totalExpenses > 0 ? Math.round((e.amount / totalExpenses) * 1000) / 10 : 0,
      note: e.category === 'Housing'
        ? (e.amount / totalIncome <= 0.3 ? 'Optimal (<30% income)' : 'High housing burden (>30%)')
        : 'Essential monthly living expense',
    }));

  // Breakdown of wants
  const wantsBreakdown = input.expenses
    .filter((e) => !['housing', 'food', 'transportation', 'utilities', 'healthcare', 'education'].includes(e.category.toLowerCase()))
    .map((e) => ({
      category: e.category,
      amount: e.amount,
      percentageOfIncome: totalIncome > 0 ? Math.round((e.amount / totalIncome) * 1000) / 10 : 0,
      percentageOfExpenses: totalExpenses > 0 ? Math.round((e.amount / totalExpenses) * 1000) / 10 : 0,
      note: 'Discretionary flexible spending',
    }));

  // Health assessment
  let health: 'Excellent' | 'Healthy' | 'Moderate' | 'Needs Attention' = 'Healthy';
  let healthScore = 75;

  const savingsRate = totalIncome > 0 ? (availableBalance / totalIncome) * 100 : 0;
  if (savingsRate >= 25 && needsPercentage <= 50) {
    health = 'Excellent';
    healthScore = 88;
  } else if (savingsRate >= 18) {
    health = 'Healthy';
    healthScore = 78;
  } else if (savingsRate >= 10) {
    health = 'Moderate';
    healthScore = 62;
  } else {
    health = 'Needs Attention';
    healthScore = 46;
  }

  // Find highest expense
  const sortedExpenses = [...input.expenses].sort((a, b) => b.amount - a.amount);
  const highestExp = sortedExpenses[0] || { category: 'None', amount: 0 };
  const highestExpPercent = totalIncome > 0 ? Math.round((highestExp.amount / totalIncome) * 100) : 0;

  // Personalized saving suggestions
  const suggestions = [];

  const foodExp = input.expenses.find((e) => e.category.toLowerCase() === 'food');
  if (foodExp && foodExp.amount > 0) {
    const potentialSaving = Math.round(foodExp.amount * 0.2);
    suggestions.push({
      id: 'sug-1',
      title: 'Optimize Food & Dining Expenses',
      category: 'Food',
      explanation: `Your food expenses (${formatCurrency(foodExp.amount, input.currency)}) represent ${Math.round((foodExp.amount / totalIncome) * 100)}% of your income. Preparing meal batches and capping weekend food deliveries can yield notable savings.`,
      estimated_monthly_saving: potentialSaving,
      priority: 'High' as const,
    });
  }

  const shoppingExp = input.expenses.find((e) => e.category.toLowerCase() === 'shopping');
  if (shoppingExp && shoppingExp.amount > 0) {
    const potentialSaving = Math.round(shoppingExp.amount * 0.35);
    suggestions.push({
      id: 'sug-2',
      title: 'Adopt the 48-Hour Cooling Rule for Shopping',
      category: 'Shopping',
      explanation: `Shopping is currently ${formatCurrency(shoppingExp.amount, input.currency)}/month. Applying a 48-hour pause before non-essential purchases curbs impulse buying effectively.`,
      estimated_monthly_saving: potentialSaving,
      priority: 'Medium' as const,
    });
  }

  const entExp = input.expenses.find((e) => e.category.toLowerCase() === 'entertainment');
  if (entExp && entExp.amount > 0) {
    const potentialSaving = Math.round(entExp.amount * 0.25);
    suggestions.push({
      id: 'sug-3',
      title: 'Audit Subscriptions & Streaming Outings',
      category: 'Entertainment',
      explanation: `Review digital services and recurring platform fees. Consolidating overlapping streaming services can free up recurring cash flow immediately.`,
      estimated_monthly_saving: potentialSaving,
      priority: 'Low' as const,
    });
  }

  const utilExp = input.expenses.find((e) => e.category.toLowerCase() === 'utilities');
  if (utilExp && utilExp.amount > 0) {
    const potentialSaving = Math.round(utilExp.amount * 0.15);
    suggestions.push({
      id: 'sug-4',
      title: 'Re-negotiate Broadband & Utility Tariffs',
      category: 'Utilities',
      explanation: `Comparing annual ISP plans and conserving standby appliance power can trim utilities by around 15% without reducing everyday convenience.`,
      estimated_monthly_saving: potentialSaving,
      priority: 'Medium' as const,
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      id: 'sug-default',
      title: 'Automate Payday Savings Transfers',
      category: 'Savings',
      explanation: `Set up an automated direct debit of ${formatCurrency(recommendedSavings, input.currency)} into a dedicated savings repository the moment your salary lands.`,
      estimated_monthly_saving: recommendedSavings,
      priority: 'High' as const,
    });
  }

  return {
    budget_plan: {
      total_income: totalIncome,
      total_expenses: totalExpenses,
      available_balance: availableBalance,
      recommended_monthly_savings: recommendedSavings,
      savings_rate: Math.round(savingsRate * 10) / 10,
      needs_total: needsTotal,
      needs_percentage: Math.round(needsPercentage * 10) / 10,
      wants_total: wantsTotal,
      wants_percentage: Math.round(wantsPercentage * 10) / 10,
      savings_total: availableBalance,
      savings_percentage: Math.round(savingsRate * 10) / 10,
      needs_breakdown: needsBreakdown,
      wants_breakdown: wantsBreakdown,
      goal_progress_percent: goalProgress,
      estimated_months_to_goal: estimatedMonths,
    },
    saving_suggestions: suggestions,
    monthly_summary: {
      overall_health: health,
      health_score: healthScore,
      summary_text: `You are in a ${health.toLowerCase()} financial position with an available surplus of ${formatCurrency(availableBalance, input.currency)} each month (${Math.round(savingsRate)}% of net income). Your 50/30/20 balance is well managed.`,
      biggest_spending_category: `${highestExp.category} (${formatCurrency(highestExp.amount, input.currency)} / ${highestExpPercent}% of income)`,
      savings_progress: `${formatCurrency(input.currentSavings, input.currency)} saved toward ${input.financialGoal} (${formatCurrency(input.targetAmount, input.currency)} target, ${goalProgress}% complete). Estimated ${estimatedMonths} months to goal.`,
      positive_observation: `Your essential living costs are comfortably supported by your regular earnings, leaving a robust positive cash-flow buffer.`,
      area_to_improve: `Discretionary shopping and dining represent an opportunity to channel an additional ${formatCurrency(Math.round((foodExp?.amount || 0) * 0.15 + (shoppingExp?.amount || 0) * 0.2), input.currency)}/month toward your goal.`,
      next_month_focus: `Automate an initial ${formatCurrency(recommendedSavings, input.currency)} transfer into your ${input.financialGoal} bucket within 24 hours of receiving monthly income.`,
    },
    insights: [
      `Your current budget allocates ${Math.round(needsPercentage)}% to Needs, ${Math.round(wantsPercentage)}% to Wants, and ${Math.round(savingsRate)}% to Savings/Surplus.`,
      `By saving ${formatCurrency(recommendedSavings, input.currency)} monthly, you will achieve your target of ${formatCurrency(input.targetAmount, input.currency)} in approximately ${estimatedMonths} months.`,
      `Your risk preference is set to ${input.riskPreference}, suggesting a structured, disciplined cash buffer before considering speculative instruments.`,
    ],
  };
}
