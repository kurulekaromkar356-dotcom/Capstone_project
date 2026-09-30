import React from 'react';
import { CurrencyCode, BudgetPlan, FinancialInput } from '../types/finance';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Target, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

interface BudgetPlanViewProps {
  plan: BudgetPlan;
  input: FinancialInput;
}

const COLORS = {
  needs: '#1E293B',    // Slate 800
  wants: '#6366F1',    // Indigo 500
  savings: '#10B981',  // Emerald 500
};

export const BudgetPlanView: React.FC<BudgetPlanViewProps> = ({ plan, input }) => {
  const chartData = [
    { name: 'Needs', value: plan.needs_total, percent: plan.needs_percentage, color: COLORS.needs },
    { name: 'Wants', value: plan.wants_total, percent: plan.wants_percentage, color: COLORS.wants },
    { name: 'Savings & Surplus', value: plan.savings_total, percent: plan.savings_percentage, color: COLORS.savings },
  ];

  const targetAmount = input.targetAmount || 1;
  const currentSavings = input.currentSavings || 0;
  const progressPercent = Math.min(100, Math.round((currentSavings / targetAmount) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner: 50/30/20 Rule Comparison */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Budget Plan</h2>
            <p className="text-xs text-slate-500 mt-1">
              Structured according to the proven 50/30/20 balanced cash-flow architecture.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
            <span className="text-slate-500">
              Total Inflow: <strong className="text-slate-900">{formatCurrency(plan.total_income, input.currency)}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">
              Total Outflow: <strong className="text-slate-900">{formatCurrency(plan.total_expenses, input.currency)}</strong>
            </span>
          </div>
        </div>

        {/* 3 Pillars Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Needs */}
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Needs (Target ~50%)
              </span>
              <span className="text-xs font-bold font-mono tabular-nums text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {formatPercent(plan.needs_percentage)}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {formatCurrency(plan.needs_total, input.currency)}
            </div>
            <p className="text-[11px] text-slate-500">
              Housing, food groceries, transportation, utilities, healthcare, education.
            </p>
          </div>

          {/* Wants */}
          <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Wants (Target ~30%)
              </span>
              <span className="text-xs font-bold font-mono tabular-nums text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                {formatPercent(plan.wants_percentage)}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-indigo-900">
              {formatCurrency(plan.wants_total, input.currency)}
            </div>
            <p className="text-[11px] text-indigo-700/80">
              Entertainment, dining out, lifestyle shopping, hobbies, miscellaneous.
            </p>
          </div>

          {/* Savings */}
          <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Savings (Target ~20%)
              </span>
              <span className="text-xs font-bold font-mono tabular-nums text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                {formatPercent(plan.savings_percentage)}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-900">
              {formatCurrency(plan.recommended_monthly_savings, input.currency)}
            </div>
            <p className="text-[11px] text-emerald-700/80">
              Target goal buffer, liquid emergency safety net, long-term wealth assets.
            </p>
          </div>
        </div>
      </div>

      {/* Donut Chart & Savings Goal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Needs vs Wants vs Savings</h3>
              <p className="text-xs text-slate-500">Visual share of monthly capital distribution</p>
            </div>
          </div>

          <div className="h-64 relative flex items-center justify-center py-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [
                    formatCurrency(Number(val) || 0, input.currency),
                    'Monthly Amount',
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
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-medium text-slate-400">Total Inflow</span>
              <span className="text-sm font-bold font-mono tabular-nums text-slate-800">
                {formatCurrency(plan.total_income, input.currency)}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-slate-800 shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">Needs</div>
                <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                  {formatPercent(plan.needs_percentage)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-indigo-500 shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">Wants</div>
                <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                  {formatPercent(plan.wants_percentage)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-emerald-500 shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">Savings</div>
                <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                  {formatPercent(plan.savings_percentage)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Goal Progress Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{input.financialGoal}</h3>
                  <p className="text-xs text-slate-500">Target Goal Progress Tracker</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700 font-mono tabular-nums border border-blue-100">
                {progressPercent}% Complete
              </span>
            </div>

            {/* Target Numbers */}
            <div className="grid grid-cols-2 gap-4 py-5">
              <div>
                <span className="text-[11px] text-slate-500">Current Accumulated</span>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                  {formatCurrency(currentSavings, input.currency)}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-500">Target Required</span>
                <div className="text-xl font-bold font-mono tabular-nums text-blue-700 mt-0.5">
                  {formatCurrency(input.targetAmount, input.currency)}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono tabular-nums">
                <span>0%</span>
                <span>Remaining: {formatCurrency(Math.max(0, input.targetAmount - currentSavings), input.currency)}</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Timeline estimate box */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>
                Estimated Timeline:{' '}
                <strong className="text-emerald-700 font-mono tabular-nums">
                  ~{plan.estimated_months_to_goal} months
                </strong>{' '}
                to completion
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Based on consistently depositing your recommended{' '}
              <strong className="font-mono tabular-nums text-slate-800">
                {formatCurrency(plan.recommended_monthly_savings, input.currency)}
              </strong>{' '}
              each month.
            </p>
          </div>
        </div>
      </div>

      {/* Itemized Categories Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Itemized Categorization</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold">Classification</th>
                <th className="py-2.5 px-3 font-semibold text-right">Monthly Cost</th>
                <th className="py-2.5 px-3 font-semibold text-right">% of Income</th>
                <th className="py-2.5 px-3 font-semibold">Status / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {input.expenses.map((e) => {
                const isNeed = ['housing', 'food', 'transportation', 'utilities', 'healthcare', 'education'].includes(
                  e.category.toLowerCase()
                );
                const pct = plan.total_income > 0 ? (e.amount / plan.total_income) * 100 : 0;
                return (
                  <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {e.category}
                      {e.label && <span className="text-[10px] text-slate-400 block">{e.label}</span>}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isNeed
                            ? 'bg-slate-100 text-slate-800 border border-slate-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}
                      >
                        {isNeed ? 'Essential Need' : 'Discretionary Want'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-900 font-semibold">
                      {formatCurrency(e.amount, input.currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600">
                      {formatPercent(pct)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {isNeed ? (
                        <span className="flex items-center gap-1 text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Protected baseline</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-indigo-600">
                          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Flexible for savings</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
