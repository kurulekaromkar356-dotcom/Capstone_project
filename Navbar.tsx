import React, { useState } from 'react';
import { Sparkles, Menu, X, Settings as SettingsIcon, Sliders, DollarSign, Bot, PieChart, Shield } from 'lucide-react';

export type NavTab = 'dashboard' | 'budget' | 'savings' | 'simulator' | 'advisor' | 'input';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSettings: () => void;
  onTryDemo: () => void;
  hasPlan: boolean;
  onNewPlan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSettings,
  onTryDemo,
  hasPlan,
  onNewPlan,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: PieChart, requiresPlan: true },
    { id: 'budget' as NavTab, label: 'Budget Plan', icon: DollarSign, requiresPlan: true },
    { id: 'savings' as NavTab, label: 'Suggestions', icon: Sparkles, requiresPlan: true },
    { id: 'simulator' as NavTab, label: 'What-If?', icon: Sliders, requiresPlan: true },
    { id: 'advisor' as NavTab, label: 'AI Advisor', icon: Bot, requiresPlan: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab(hasPlan ? 'dashboard' : 'input')}
              className="text-left flex items-center gap-2 group cursor-pointer focus-visible:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-blue-700 transition-colors">
                FW
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                FinWise AI
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isDisabled = item.requiresPlan && !hasPlan;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  disabled={isDisabled}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : isDisabled
                      ? 'text-slate-400 cursor-not-allowed opacity-60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            {!hasPlan ? (
              <>
                <button
                  onClick={onTryDemo}
                  className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Try Demo
                </button>
                <button
                  onClick={() => onSelectTab('input')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  Create Plan
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onNewPlan}
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Edit Input
                </button>
                <button
                  onClick={onTryDemo}
                  className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Reload Demo
                </button>
              </>
            )}

            <button
              onClick={onOpenSettings}
              aria-label="Settings"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-1">
          {navItems.map((item) => {
            const isDisabled = item.requiresPlan && !hasPlan;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                disabled={isDisabled}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isDisabled
                    ? 'text-slate-400 cursor-not-allowed opacity-50'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
