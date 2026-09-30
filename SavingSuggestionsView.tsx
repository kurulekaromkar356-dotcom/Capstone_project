import React, { useState } from 'react';
import { CurrencyCode, SavingSuggestion } from '../types/finance';
import { formatCurrency } from '../utils/formatters';
import { Sparkles, TrendingUp, Check, ArrowUpRight, Filter } from 'lucide-react';

interface SavingSuggestionsViewProps {
  suggestions: SavingSuggestion[];
  currency: CurrencyCode;
  onApplySavingsToSimulator?: (totalAdditionalSavings: number) => void;
}

export const SavingSuggestionsView: React.FC<SavingSuggestionsViewProps> = ({
  suggestions,
  currency,
  onApplySavingsToSimulator,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterPriority, setFilterPriority] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredSuggestions = suggestions.filter((s) => {
    if (filterPriority === 'All') return true;
    return s.priority === filterPriority;
  });

  const selectedTotalSavings = suggestions
    .filter((s) => selectedIds.has(s.id))
    .reduce((acc, curr) => acc + curr.estimated_monthly_saving, 0);

  const grandTotalPotential = suggestions.reduce(
    (acc, curr) => acc + curr.estimated_monthly_saving,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header with Cumulative Potential Impact */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini AI Actionable Recommendations</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Saving Suggestions</h2>
          <p className="text-xs text-slate-500">
            Targeted adjustments on flexible spending categories. Estimates are for planning purposes.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-right flex items-center md:flex-col md:items-end justify-between md:justify-center gap-2">
          <span className="text-[11px] text-slate-500 font-medium">Total Achievable Potential</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
            +{formatCurrency(grandTotalPotential, currency)}
            <span className="text-xs font-normal text-slate-500">/mo</span>
          </div>
        </div>
      </div>

      {/* Filter / Segmented priority buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['All', 'High', 'Medium', 'Low'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterPriority(tier)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterPriority === tier
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tier} Priority
            </button>
          ))}
        </div>

        {selectedTotalSavings > 0 && onApplySavingsToSimulator && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600">
              Selected:{' '}
              <strong className="text-emerald-700 font-mono tabular-nums">
                +{formatCurrency(selectedTotalSavings, currency)}/mo
              </strong>
            </span>
            <button
              onClick={() => onApplySavingsToSimulator(selectedTotalSavings)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>Test in What-If Simulator</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuggestions.map((suggestion) => {
          const isSelected = selectedIds.has(suggestion.id);
          const priorityBadgeColor =
            suggestion.priority === 'High'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : suggestion.priority === 'Medium'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-slate-100 text-slate-700 border-slate-200';

          return (
            <div
              key={suggestion.id}
              onClick={() => toggleSelect(suggestion.id)}
              className={`bg-white border rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${priorityBadgeColor}`}
                    >
                      {suggestion.priority} Priority
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {suggestion.title}
                    </h3>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {suggestion.explanation}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Estimated Monthly Impact:</span>
                <span className="text-sm font-bold font-mono tabular-nums text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  ~+{formatCurrency(suggestion.estimated_monthly_saving, currency)}/mo
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
        💡 Click on any suggestion to select and simulate its combined impact in the What-If tab.
      </div>
    </div>
  );
};
