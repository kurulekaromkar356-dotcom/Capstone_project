import React from 'react';
import { CurrencyCode, BudgetPlan } from '../types/finance';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { Wallet, CreditCard, PiggyBank, Sparkles } from 'lucide-react';

interface TopSummaryCardsProps {
  plan: BudgetPlan;
  currency: CurrencyCode;
}

export const TopSummaryCards: React.FC<TopSummaryCardsProps> = ({ plan, currency }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Monthly Income */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Monthly Income</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
            {formatCurrency(plan.total_income, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Core cash inflow</span>
            <span aria-hidden="true">·</span>
            <span>100% base</span>
          </div>
        </div>
      </div>

      {/* 2. Total Expenses */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Total Expenses</span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
            {formatCurrency(plan.total_expenses, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-rose-600 font-mono tabular-nums">
              {formatPercent(
                plan.total_income > 0 ? (plan.total_expenses / plan.total_income) * 100 : 0
              )}
            </span>
            <span>of monthly income</span>
          </div>
        </div>
      </div>

      {/* 3. Available Balance */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Available Balance</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 tracking-tight">
            {formatCurrency(plan.available_balance, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-emerald-600 font-mono tabular-nums">
              {formatPercent(plan.savings_rate)}
            </span>
            <span>monthly net surplus</span>
          </div>
        </div>
      </div>

      {/* 4. Suggested Savings */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Suggested Savings</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-700 tracking-tight">
            {formatCurrency(plan.recommended_monthly_savings, currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Goal completion in</span>
            <span className="font-semibold text-slate-800 font-mono tabular-nums">
              ~{plan.estimated_months_to_goal} mos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
