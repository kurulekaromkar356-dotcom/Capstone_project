export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  format: (amount: number) => string;
}

export type StandardExpenseCategory =
  | 'Housing'
  | 'Food'
  | 'Transportation'
  | 'Utilities'
  | 'Entertainment'
  | 'Shopping'
  | 'Education'
  | 'Healthcare'
  | 'Other';

export interface ExpenseItem {
  id: string;
  category: StandardExpenseCategory | string;
  amount: number;
  label?: string;
  isCustom?: boolean;
}

export type RiskPreference = 'Conservative' | 'Balanced' | 'Aggressive';

export type GoalType =
  | 'Emergency fund'
  | 'Buy a laptop'
  | 'Higher education'
  | 'Vacation'
  | 'Buy a vehicle'
  | 'House down payment'
  | 'General savings'
  | 'Custom';

export interface FinancialInput {
  income: number;
  otherIncome: number;
  currency: CurrencyCode;
  expenses: ExpenseItem[];
  financialGoal: string;
  targetAmount: number;
  targetDate: string;
  currentSavings: number;
  riskPreference: RiskPreference;
  notes?: string;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentageOfIncome: number;
  percentageOfExpenses: number;
  note?: string;
}

export interface BudgetPlan {
  total_income: number;
  total_expenses: number;
  available_balance: number;
  recommended_monthly_savings: number;
  savings_rate: number;
  needs_total: number;
  needs_percentage: number;
  wants_total: number;
  wants_percentage: number;
  savings_total: number;
  savings_percentage: number;
  needs_breakdown: CategoryBreakdown[];
  wants_breakdown: CategoryBreakdown[];
  goal_progress_percent: number;
  estimated_months_to_goal: number;
}

export interface SavingSuggestion {
  id: string;
  title: string;
  category: string;
  explanation: string;
  estimated_monthly_saving: number;
  priority: 'High' | 'Medium' | 'Low';
  applied?: boolean;
}

export interface MonthlySummary {
  overall_health: 'Excellent' | 'Healthy' | 'Moderate' | 'Needs Attention';
  health_score: number;
  summary_text: string;
  biggest_spending_category: string;
  savings_progress: string;
  positive_observation: string;
  area_to_improve: string;
  next_month_focus: string;
}

export interface FinancialAdviceResponse {
  budget_plan: BudgetPlan;
  saving_suggestions: SavingSuggestion[];
  monthly_summary: MonthlySummary;
  insights: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
