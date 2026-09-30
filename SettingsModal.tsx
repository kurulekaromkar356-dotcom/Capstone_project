import React from 'react';
import { CurrencyCode } from '../types/finance';
import { X, RefreshCw, Trash2, Shield, Cpu, HelpCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onChangeCurrency: (c: CurrencyCode) => void;
  onResetToDemo: () => void;
  onClearPlan: () => void;
  modelUsed?: string;
  source?: 'gemini' | 'fallback';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currency,
  onChangeCurrency,
  onResetToDemo,
  onClearPlan,
  modelUsed = 'gemini-3.8-flash',
  source = 'gemini',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Application Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Preferred Currency Display
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'] as CurrencyCode[]).map((c) => (
              <button
                key={c}
                onClick={() => onChangeCurrency(c)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                  currency === c
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {c === 'INR' ? '₹ INR' : c === 'USD' ? '$ USD' : c === 'EUR' ? '€ EUR' : c}
              </button>
            ))}
          </div>
        </div>

        {/* AI Engine Status */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>AI Advisory Engine</span>
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                source === 'gemini'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {source === 'gemini' ? 'Gemini 3.8 Flash Online' : 'Deterministic Mode Active'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Powered by Google's latest Gemini 3.8 Flash model. Automatically falls back to
            deterministic rule-based modeling when offline or if an API key is unconfigured.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700">Profile Actions</div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                onResetToDemo();
                onClose();
              }}
              className="flex-1 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Full Demo Data</span>
            </button>
            <button
              onClick={() => {
                onClearPlan();
                onClose();
              }}
              className="flex-1 py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Current Plan</span>
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
          <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            FinWise AI provides estimates and educational financial insights. It does not provide
            professional financial, investment, tax, or legal advice.
          </span>
        </div>
      </div>
    </div>
  );
};
