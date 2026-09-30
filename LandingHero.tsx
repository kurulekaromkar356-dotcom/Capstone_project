import React from 'react';
import { Sparkles, PieChart, TrendingUp, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DisclaimerBanner } from './DisclaimerBanner';

interface LandingHeroProps {
  onCreatePlan: () => void;
  onTryDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onCreatePlan, onTryDemo }) => {
  return (
    <div className="space-y-16 py-6 md:py-12">
      {/* Hero Header Section */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-700 bg-blue-50/90 border border-blue-100 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Intelligent Wealth & Budget Planning</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
          Your AI-Powered Personal Finance Advisor
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
          Understand your spending, build a smarter budget, and reach your financial goals with
          personalized guidance powered by Gemini.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onCreatePlan}
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Create My Financial Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onTryDemo}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Try Demo</span>
            <span className="text-xs text-slate-400 font-normal">(Instant ₹50,000 profile)</span>
          </button>
        </div>

        {/* Trust markers */}
        <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>50/30/20 Rule Based</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Private & Confidential</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero Sign-up Required</span>
          </div>
        </div>
      </section>

      {/* Hero Visual Showcase */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 group">
          <img
            src="/src/assets/images/hero_finance_dashboard_1790762920442.jpg"
            alt="FinWise AI Financial Planning Workspace"
            referrerPolicy="no-referrer"
            className="w-full h-64 sm:h-96 object-cover object-center opacity-90 transition-transform duration-500 group-hover:scale-101"
            onError={(e) => {
              // Graceful fallback if image asset fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <div className="max-w-xl space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
                Live Interactive Architecture
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">
                From Raw Expenses to a Clear, Executable Financial Roadmap
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Visualize needs vs. wants, track emergency fund timelines, simulate what-if scenarios,
                and consult your personalized AI advisor on demand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Mandatory Feature Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Designed for Financial Clarity</h2>
          <p className="text-sm text-slate-500 mt-1">
            Transform complex spending habits into high-conviction daily decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Budget Planning */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Budget Planning</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automatically categorizes your monthly outflows into Needs (50%), Wants (30%), and
                Savings (20%). Identifies overspending bottlenecks and establishes safe monthly spending
                thresholds.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center text-xs font-semibold text-blue-600">
              <span>Dynamic cash-flow charts & progress meters</span>
            </div>
          </div>

          {/* Card 2: Smart Saving Suggestions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Smart Saving Suggestions</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gemini analyzes discretionary expenses (dining, entertainment, subscriptions) and calculates
                achievable monthly reductions without asking you to sacrifice your essential quality of life.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center text-xs font-semibold text-emerald-600">
              <span>Estimated monthly impact & priority tiers</span>
            </div>
          </div>

          {/* Card 3: Monthly Financial Insights */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Monthly Financial Insights</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive an objective health score, positive reinforcement for well-managed expenses, key
                areas for improvement, and a single high-priority action for next month.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center text-xs font-semibold text-indigo-600">
              <span>Overall health score & actionable advice</span>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Disclaimer */}
      <div className="max-w-4xl mx-auto px-4">
        <DisclaimerBanner />
      </div>
    </div>
  );
};
