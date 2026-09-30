import React, { useState, useEffect } from 'react';
import { FinancialInput, BudgetPlan } from '../types/finance';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { Sliders, RotateCcw, Clock, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

interface WhatIfSimulatorProps {
  input: FinancialInput;
  plan: BudgetPlan;
  additionalSavingsFromSuggestions?: number;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  input,
  plan,
  additionalSavingsFromSuggestions = 0,
}) => {
  // Base original state
  const originalIncome = plan.total_income;
  const originalExpenses = plan.total_expenses;
  const originalSavings = plan.recommended_monthly_savings;
  const targetGoalAmount = input.targetAmount || 150000;
  const currentSavings = input.currentSavings || 0;
  const remainingTarget = Math.max(0, targetGoalAmount - currentSavings);

  // Simulated state
  const [simIncome, setSimIncome] = useState<number>(originalIncome);
  const [simExpenses, setSimExpenses] = useState<number>(originalExpenses);
  const [simSavings, setSimSavings] = useState<number>(
    originalSavings + additionalSavingsFromSuggestions
  );

  useEffect(() => {
    if (additionalSavingsFromSuggestions > 0) {
      setSimSavings(originalSavings + additionalSavingsFromSuggestions);
      setSimExpenses(Math.max(0, originalExpenses - additionalSavingsFromSuggestions));
    }
  }, [additionalSavingsFromSuggestions, originalSavings, originalExpenses]);

  // Reset to original plan
  const handleReset = () => {
    setSimIncome(originalIncome);
    setSimExpenses(originalExpenses);
    setSimSavings(originalSavings);
  };

  // Calculations
  const simAvailableBalance = Math.max(0, simIncome - simExpenses);
  const simSavingsRate = simIncome > 0 ? (simSavings / simIncome) * 100 : 0;

  // Months to goal calculation
  const originalMonths =
    originalSavings > 0 ? Math.ceil(remainingTarget / originalSavings) : 99;
  const simMonths =
    simSavings > 0 ? Math.ceil(remainingTarget / simSavings) : 99;

  const monthsDifference = originalMonths - simMonths;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100 mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Financial Forecasting</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              What-If? Scenario Simulator
            </h2>
            <p className="text-xs text-slate-500">
              Adjust your monthly levers to project time-to-goal acceleration in real-time.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Original</span>
          </button>
        </div>

        {/* Dynamic Impact Callout Banner */}
        {monthsDifference > 0 ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-950">
                You could reach your goal approximately{' '}
                <span className="font-extrabold text-emerald-700 underline decoration-2 font-mono tabular-nums">
                  {monthsDifference} {monthsDifference === 1 ? 'month' : 'months'} earlier!
                </span>
              </div>
              <p className="text-xs text-emerald-800/80 mt-0.5">
                By increasing your monthly savings from {formatCurrency(originalSavings, input.currency)}{' '}
                to {formatCurrency(simSavings, input.currency)}, your target timeline shrinks from ~
                {originalMonths} months to ~{simMonths} months.
              </p>
            </div>
          </div>
        ) : monthsDifference < 0 ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-950">
                Goal timeline extended by {Math.abs(monthsDifference)} months
              </div>
              <p className="text-xs text-amber-800/80 mt-0.5">
                Saving less per month will lengthen the journey to reach{' '}
                {formatCurrency(targetGoalAmount, input.currency)}.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
            <span>
              Adjust the sliders below to explore how changes in your income, expenses, or savings rate
              alter your path to <strong>{input.financialGoal}</strong>.
            </span>
          </div>
        )}

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Slider 1: Monthly Income */}
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Monthly Income</span>
              <span className="font-bold font-mono tabular-nums text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {formatCurrency(simIncome, input.currency)}
              </span>
            </div>
            <input
              type="range"
              min={Math.round(originalIncome * 0.5)}
              max={Math.round(originalIncome * 2)}
              step={1000}
              value={simIncome}
              onChange={(e) => setSimIncome(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono tabular-nums">
              <span>{formatCurrency(Math.round(originalIncome * 0.5), input.currency)}</span>
              <span className="text-slate-600">Base: {formatCurrency(originalIncome, input.currency)}</span>
              <span>{formatCurrency(Math.round(originalIncome * 2), input.currency)}</span>
            </div>
          </div>

          {/* Slider 2: Monthly Expenses */}
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Monthly Expenses</span>
              <span className="font-bold font-mono tabular-nums text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {formatCurrency(simExpenses, input.currency)}
              </span>
            </div>
            <input
              type="range"
              min={Math.round(originalExpenses * 0.5)}
              max={Math.round(originalExpenses * 1.5)}
              step={500}
              value={simExpenses}
              onChange={(e) => setSimExpenses(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono tabular-nums">
              <span>{formatCurrency(Math.round(originalExpenses * 0.5), input.currency)}</span>
              <span className="text-slate-600">Base: {formatCurrency(originalExpenses, input.currency)}</span>
              <span>{formatCurrency(Math.round(originalExpenses * 1.5), input.currency)}</span>
            </div>
          </div>

          {/* Slider 3: Monthly Savings */}
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Monthly Savings</span>
              <span className="font-bold font-mono tabular-nums text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                {formatCurrency(simSavings, input.currency)}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={Math.max(originalSavings * 2.5, simAvailableBalance + 5000)}
              step={500}
              value={simSavings}
              onChange={(e) => setSimSavings(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono tabular-nums">
              <span>{formatCurrency(1000, input.currency)}</span>
              <span className="text-slate-600">Base: {formatCurrency(originalSavings, input.currency)}</span>
              <span>{formatCurrency(Math.round(originalSavings * 2.5), input.currency)}</span>
            </div>
          </div>
        </div>

        {/* Live Calculated Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          {/* New Available Balance */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">New Available Balance</span>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
              {formatCurrency(simAvailableBalance, input.currency)}
            </div>
            <div className="text-[11px] text-slate-400">
              Original: {formatCurrency(plan.available_balance, input.currency)}
            </div>
          </div>

          {/* New Savings Rate */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">New Savings Rate</span>
            <div className="text-xl font-bold font-mono tabular-nums text-indigo-700">
              {formatPercent(simSavingsRate)}
            </div>
            <div className="text-[11px] text-slate-400">
              Original: {formatPercent(plan.savings_rate)}
            </div>
          </div>

          {/* Estimated Time to Goal */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Estimated Time to Goal</span>
            <div className="text-xl font-bold font-mono tabular-nums text-emerald-700 flex items-center gap-1.5">
              <span>~{simMonths} months</span>
              {monthsDifference > 0 && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  -{monthsDifference}m
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400">
              Original: ~{originalMonths} months
            </div>
          </div>
        </div>

        {/* Mandatory Estimate Disclaimer */}
        <div className="text-[11px] text-slate-400 text-center">
          * Simulations assume constant monthly inflows, fixed returns, and zero inflation drift.
          Educational estimate only.
        </div>
      </div>
    </div>
  );
};
