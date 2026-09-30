import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 py-2 px-3 bg-slate-100/90 rounded-lg text-xs text-slate-600 border border-slate-200">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <p className="truncate">
          Educational estimates only · Not professional financial, tax, or legal advice.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-3">
      <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-slate-700">Educational Disclaimer:</span> FinWise AI
        provides estimates and educational financial insights. It does not provide professional
        financial, investment, tax, or legal advice, and its recommendations do not guarantee
        financial outcomes. Always consult a licensed financial professional before making major
        financial commitments.
      </div>
    </div>
  );
};
