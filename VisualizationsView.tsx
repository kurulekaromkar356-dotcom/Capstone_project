import React from 'react';
import { FinancialInput, BudgetPlan } from '../types/finance';
import { formatCurrency, formatPercent } from '../utils/formatters';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { Target, TrendingUp, BarChart3, PieChart as PieIcon } from 'lucide-react';

interface VisualizationsViewProps {
  input: FinancialInput;
  plan: BudgetPlan;
}

const PALETTE = [
  '#2563EB', // Blue
  '#059669', // Emerald
  '#D97706', // Amber
  '#DC2626', // Red
  '#7C3AED', // Violet
  '#DB2777', // Pink
  '#0284C7', // Sky
  '#4B5563', // Gray
  '#0D9488', // Teal
  '#65A30D', // Lime
];

export const VisualizationsView: React.FC<VisualizationsViewProps> = ({ input, plan }) => {
  // 1. Expense Breakdown Data
  const expenseData = input.expenses
    .filter((e) => e.amount > 0)
    .map((e, idx) => ({
      name: e.category,
      amount: e.amount,
      color: PALETTE[idx % PALETTE.length],
    }));

  // 2. Income vs Expenses vs Surplus Comparison
  const comparisonData = [
    {
      name: 'Monthly Overview',
      Income: plan.total_income,
      Expenses: plan.total_expenses,
      Surplus: plan.available_balance,
    },
  ];

  // 3. 12-Month Cumulative Cash-Flow & Savings Projection
  const monthlySavingsRate = plan.recommended_monthly_savings;
  const initialSavings = input.currentSavings || 0;
  const projectionData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const accumulated = initialSavings + monthlySavingsRate * month;
    return {
      month: `M${month}`,
      Savings: accumulated,
      Goal: input.targetAmount,
    };
  });

  const progressPercent = Math.min(
    100,
    Math.round(((input.currentSavings || 0) / (input.targetAmount || 1)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Financial Visualizations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive graphical breakdown of expenses, comparative balance, and savings timeline.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-600 bg-slate-100 px-3 py-1 rounded-lg self-start sm:self-auto">
            Currency: {input.currency}
          </span>
        </div>
      </div>

      {/* Row 1: Donut Breakdown + Income vs Expense Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Expense Breakdown Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Expense Breakdown by Category</h3>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              Total: {formatCurrency(plan.total_expenses, input.currency)}
            </span>
          </div>

          <div className="h-64 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [
                    formatCurrency(Number(val) || 0, input.currency),
                    'Monthly Spend',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pill Legend */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 max-h-24 overflow-y-auto">
            {expenseData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate max-w-[100px]">{item.name}:</span>
                <span className="font-mono tabular-nums font-semibold text-slate-800">
                  {formatCurrency(item.amount, input.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Income vs Expenses Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Income vs Expenses vs Surplus</h3>
            </div>
            <span className="text-xs font-mono tabular-nums text-emerald-700 font-semibold">
              Net Surplus: {formatCurrency(plan.available_balance, input.currency)}
            </span>
          </div>

          <div className="h-64 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `${input.currency === 'INR' ? '₹' : ''}${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val) || 0, input.currency), 'Amount']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Income" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#DC2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Surplus" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Savings Margin: {formatPercent(plan.savings_rate)}</span>
            <span>Expense Ratio: {formatPercent((plan.total_expenses / plan.total_income) * 100)}</span>
          </div>
        </div>
      </div>

      {/* Row 2: 12-Month Projected Growth Timeline + Goal Progress Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 12-Month Cumulative Projection Area Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">12-Month Cumulative Savings Path</h3>
              <p className="text-xs text-slate-500">
                Projected trajectory with monthly savings of{' '}
                {formatCurrency(plan.recommended_monthly_savings, input.currency)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Compounding Projection</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `${input.currency === 'INR' ? '₹' : ''}${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val) || 0, input.currency), 'Accumulated']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Savings"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#savingsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings Goal Status Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Target className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Savings Goal Gauge</h3>
            </div>

            <div>
              <span className="text-xs text-slate-500">Selected Target Goal</span>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {input.financialGoal}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Target Amount</span>
                <span className="font-bold font-mono tabular-nums text-slate-900">
                  {formatCurrency(input.targetAmount, input.currency)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Current Saved</span>
                <span className="font-bold font-mono tabular-nums text-emerald-700">
                  {formatCurrency(input.currentSavings, input.currency)}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mt-2">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-right text-[11px] font-mono tabular-nums text-blue-700 font-semibold">
                {progressPercent}% Complete
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100">
            Estimated time to achieve goal: ~
            <strong className="text-slate-900 font-mono tabular-nums">
              {plan.estimated_months_to_goal} months
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
