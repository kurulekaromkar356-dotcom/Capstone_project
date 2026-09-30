import React from 'react';
import { MonthlySummary, CurrencyCode } from '../types/finance';
import {
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  Layers,
} from 'lucide-react';

interface MonthlySummaryViewProps {
  summary: MonthlySummary;
  currency: CurrencyCode;
}

export const MonthlySummaryView: React.FC<MonthlySummaryViewProps> = ({ summary }) => {
  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'Excellent':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          label: 'Optimal Health',
          icon: Award,
        };
      case 'Healthy':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          label: 'Healthy Standing',
          icon: CheckCircle,
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'Moderate Stability',
          icon: AlertTriangle,
        };
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          label: 'Action Required',
          icon: AlertTriangle,
        };
    }
  };

  const badge = getHealthBadge(summary.overall_health);
  const BadgeIcon = badge.icon;

  return (
    <div className="space-y-6">
      {/* Primary Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Header with Health Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border ${badge.bg}`}
              >
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{summary.overall_health}</span>
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                Score: <strong>{summary.health_score}</strong>/100
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Monthly Summary</h2>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-mono tabular-nums font-bold text-sm">
              {summary.health_score}
            </div>
            <div className="text-xs text-slate-500">
              <div className="font-semibold text-slate-800">Financial Vitality</div>
              <div>50/30/20 Alignment</div>
            </div>
          </div>
        </div>

        {/* Narrative Overview */}
        <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {summary.summary_text}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50/60 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Biggest Spending Outflow</span>
            </span>
            <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
              {summary.biggest_spending_category}
            </div>
          </div>

          <div className="p-4 bg-slate-50/60 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              <span>Savings Progress</span>
            </span>
            <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
              {summary.savings_progress}
            </div>
          </div>
        </div>

        {/* Observations and Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Positive Observation */}
          <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Positive Observation</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {summary.positive_observation}
            </p>
          </div>

          {/* Area to Improve */}
          <div className="p-4 bg-amber-50/40 border border-amber-100 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Primary Area to Improve</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {summary.area_to_improve}
            </p>
          </div>
        </div>

        {/* Next Month Suggested Focus Action */}
        <div className="p-5 bg-blue-600 text-white rounded-xl space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-white" />
            <span>Next Month's Suggested Focus</span>
          </div>
          <p className="text-sm font-semibold leading-relaxed text-blue-50">
            {summary.next_month_focus}
          </p>
        </div>
      </div>
    </div>
  );
};
