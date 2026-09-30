import React from 'react';
import { Sparkles, PieChart, ShieldCheck } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'FinWise AI is analyzing your finances...',
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-200">
        {/* Animated icon circle */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{message}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Running 50/30/20 categorization, calculating spending ratios, and formulating personalized
            savings recommendations...
          </p>
        </div>

        {/* Multi-step progress pulse */}
        <div className="space-y-2 pt-2 border-t border-slate-100 text-left text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Auditing income and living expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Formulating Gemini AI budget allocations</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span>Generating goal timeline and saving suggestions</span>
          </div>
        </div>
      </div>
    </div>
  );
};
