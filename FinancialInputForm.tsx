import React, { useState } from 'react';
import {
  CurrencyCode,
  FinancialInput,
  ExpenseItem,
  RiskPreference,
  StandardExpenseCategory,
} from '../types/finance';
import { CURRENCY_SYMBOLS, formatCurrency } from '../utils/formatters';
import { DEMO_FINANCIAL_INPUT } from '../data/demoData';
import { Plus, Trash2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { DisclaimerBanner } from './DisclaimerBanner';

interface FinancialInputFormProps {
  initialData?: FinancialInput;
  onSubmit: (data: FinancialInput) => void;
  isLoading: boolean;
}

const STANDARD_CATEGORIES: StandardExpenseCategory[] = [
  'Housing',
  'Food',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Education',
  'Healthcare',
  'Other',
];

const GOAL_PRESETS = [
  'Build an emergency fund',
  'Buy a laptop',
  'Higher education',
  'Vacation',
  'Buy a vehicle',
  'House down payment',
  'General savings',
];

export const FinancialInputForm: React.FC<FinancialInputFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<FinancialInput>(() => {
    if (initialData) return initialData;
    // Default starter state
    return {
      income: 50000,
      otherIncome: 5000,
      currency: 'INR',
      expenses: [
        { id: '1', category: 'Housing', amount: 15000, label: 'Rent / Mortgage' },
        { id: '2', category: 'Food', amount: 7000, label: 'Groceries & Dining' },
        { id: '3', category: 'Transportation', amount: 4000, label: 'Fuel / Transit' },
        { id: '4', category: 'Utilities', amount: 3000, label: 'Power, Water, Net' },
        { id: '5', category: 'Entertainment', amount: 3000, label: 'Subscriptions / Outings' },
        { id: '6', category: 'Shopping', amount: 4000, label: 'Clothes / Personal' },
        { id: '7', category: 'Education', amount: 0, label: 'Courses / Books' },
        { id: '8', category: 'Healthcare', amount: 2000, label: 'Medicine & Health' },
        { id: '9', category: 'Other', amount: 2000, label: 'Miscellaneous' },
      ],
      financialGoal: 'Build an emergency fund',
      targetAmount: 150000,
      targetDate: '2027-03-31',
      currentSavings: 40000,
      riskPreference: 'Balanced',
      notes: '',
    };
  });

  const [customCategoryName, setCustomCategoryName] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const currencySymbol = CURRENCY_SYMBOLS[formData.currency] || '₹';

  const handleExpenseChange = (id: string, amount: number) => {
    setFormData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === id ? { ...e, amount: Math.max(0, amount) } : e)),
    }));
  };

  const handleAddCustomExpense = () => {
    if (!customCategoryName.trim()) return;
    const newItem: ExpenseItem = {
      id: `custom-${Date.now()}`,
      category: customCategoryName.trim(),
      amount: 0,
      label: 'Custom Category',
      isCustom: true,
    };
    setFormData((prev) => ({
      ...prev,
      expenses: [...prev.expenses, newItem],
    }));
    setCustomCategoryName('');
    setShowAddCustom(false);
  };

  const handleRemoveExpense = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  };

  const handleLoadDemo = () => {
    setFormData({ ...DEMO_FINANCIAL_INPUT });
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.income <= 0) {
      setFormError('Please enter a valid regular monthly income.');
      return;
    }
    if (formData.targetAmount <= 0) {
      setFormError('Please enter a target savings amount greater than 0.');
      return;
    }
    setFormError(null);
    onSubmit(formData);
  };

  const totalIncome = (Number(formData.income) || 0) + (Number(formData.otherIncome) || 0);
  const totalExpenses = formData.expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const netSurplus = totalIncome - totalExpenses;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header and Quick Demo Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Your Financial Plan</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Fill in your monthly cash flows. FinWise AI will generate a customized 50/30/20 budget.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLoadDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Fill Demo Profile</span>
        </button>
      </div>

      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{formError}</span>
        </div>
      )}

      {/* Section 1: Income */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Section 1: Income</h2>
            <p className="text-xs text-slate-500">Your total regular monthly earnings</p>
          </div>
          {/* Currency Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="currency-select" className="text-xs font-medium text-slate-600">
              Currency:
            </label>
            <select
              id="currency-select"
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value as CurrencyCode })
              }
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-blue-600"
            >
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
              <option value="CAD">CAD ($ - Canadian Dollar)</option>
              <option value="AUD">AUD ($ - Australian Dollar)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Primary Monthly Income <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="0"
                step="500"
                value={formData.income || ''}
                onChange={(e) => setFormData({ ...formData, income: Number(e.target.value) || 0 })}
                placeholder="50000"
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono tabular-nums focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Net post-tax monthly salary or wages</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Other Monthly Income
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="0"
                step="500"
                value={formData.otherIncome || ''}
                onChange={(e) =>
                  setFormData({ ...formData, otherIncome: Number(e.target.value) || 0 })
                }
                placeholder="5000"
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono tabular-nums focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Freelance, rental, dividends, side hustle</p>
          </div>
        </div>
      </div>

      {/* Section 2: Monthly Expenses */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Section 2: Monthly Expenses</h2>
            <p className="text-xs text-slate-500">Break down typical recurring expenditures</p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
            Subtotal: {formatCurrency(totalExpenses, formData.currency)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {formData.expenses.map((item) => (
            <div key={item.id} className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">{item.category}</span>
                {item.isCustom && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExpense(item.id)}
                    className="text-slate-400 hover:text-red-600 p-0.5"
                    title="Remove category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 text-xs">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={item.amount === 0 ? '' : item.amount}
                  onChange={(e) => handleExpenseChange(item.id, Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full pl-7 pr-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono tabular-nums focus:border-blue-600 focus:outline-none"
                />
              </div>
              {item.label && (
                <p className="text-[10px] text-slate-400 truncate">{item.label}</p>
              )}
            </div>
          ))}
        </div>

        {/* Add custom expense button */}
        <div className="pt-2">
          {!showAddCustom ? (
            <button
              type="button"
              onClick={() => setShowAddCustom(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Expense</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Category name (e.g. Pet Care)"
                value={customCategoryName}
                onChange={(e) => setCustomCategoryName(e.target.value)}
                className="text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-blue-600 w-full"
              />
              <button
                type="button"
                onClick={handleAddCustomExpense}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer shrink-0"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Financial Goals */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Section 3: Financial Goals</h2>
          <p className="text-xs text-slate-500">What target are you working towards?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Primary Financial Goal
            </label>
            <div className="space-y-2">
              <select
                value={
                  GOAL_PRESETS.includes(formData.financialGoal)
                    ? formData.financialGoal
                    : 'Custom'
                }
                onChange={(e) => {
                  if (e.target.value !== 'Custom') {
                    setFormData({ ...formData, financialGoal: e.target.value });
                  } else {
                    setFormData({ ...formData, financialGoal: 'Custom Goal' });
                  }
                }}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-blue-600"
              >
                {GOAL_PRESETS.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
                <option value="Custom">Custom...</option>
              </select>

              {!GOAL_PRESETS.includes(formData.financialGoal) && (
                <input
                  type="text"
                  value={formData.financialGoal}
                  onChange={(e) => setFormData({ ...formData, financialGoal: e.target.value })}
                  placeholder="Describe your custom goal"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-blue-600"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Target Goal Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.targetAmount || ''}
                onChange={(e) =>
                  setFormData({ ...formData, targetAmount: Number(e.target.value) || 0 })
                }
                placeholder="150000"
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono tabular-nums focus:bg-white focus:border-blue-600 focus:outline-none"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">E.g., 6 months of living expenses (₹1,50,000)</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Current Accumulated Savings
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.currentSavings || ''}
                onChange={(e) =>
                  setFormData({ ...formData, currentSavings: Number(e.target.value) || 0 })
                }
                placeholder="40000"
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono tabular-nums focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Total already saved toward this target</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Desired Target Date
            </label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">When you would ideally like to reach it</p>
          </div>
        </div>
      </div>

      {/* Section 4: Risk & Preferences */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Section 4: Risk Preference & Notes</h2>
          <p className="text-xs text-slate-500">Configure advisory stance and special conditions</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Risk Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['Conservative', 'Balanced', 'Aggressive'] as RiskPreference[]).map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setFormData({ ...formData, riskPreference: level })}
                  className={`p-3 text-left border rounded-xl transition-all cursor-pointer ${
                    formData.riskPreference === level
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{level}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {level === 'Conservative'
                      ? 'High safety buffer, 25%+ savings focus'
                      : level === 'Balanced'
                      ? 'Standard 50/30/20 balanced pacing'
                      : 'Accelerated savings & goal achievement'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Optional Context & Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="E.g., planning to shift rentals in 6 months, expecting an annual bonus..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Summary Callout before submit */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-xs text-slate-700 space-y-0.5">
          <div className="font-semibold text-slate-900">
            Monthly Summary: Income {formatCurrency(totalIncome, formData.currency)} · Expenses{' '}
            {formatCurrency(totalExpenses, formData.currency)}
          </div>
          <div className="text-slate-600">
            Available Monthly Surplus:{' '}
            <span
              className={`font-semibold font-mono tabular-nums ${
                netSurplus >= 0 ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              {formatCurrency(netSurplus, formData.currency)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Finances...</span>
            </>
          ) : (
            <>
              <span>Generate My Financial Plan</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <DisclaimerBanner compact />
    </form>
  );
};
