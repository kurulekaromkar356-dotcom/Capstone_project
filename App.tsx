import React, { useState, useEffect } from 'react';
import { FinancialInput, FinancialAdviceResponse, CurrencyCode } from './types/finance';
import { DEMO_FINANCIAL_INPUT, generateRealisticAdvice } from './data/demoData';
import { fetchFinancialAdvice } from './services/api';
import { Navbar, NavTab } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { FinancialInputForm } from './components/FinancialInputForm';
import { TopSummaryCards } from './components/TopSummaryCards';
import { BudgetPlanView } from './components/BudgetPlanView';
import { SavingSuggestionsView } from './components/SavingSuggestionsView';
import { MonthlySummaryView } from './components/MonthlySummaryView';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { VisualizationsView } from './components/VisualizationsView';
import { AskFinWiseChat } from './components/AskFinWiseChat';
import { LoadingOverlay } from './components/LoadingOverlay';
import { SettingsModal } from './components/SettingsModal';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import {
  PieChart,
  DollarSign,
  Sparkles,
  Sliders,
  Bot,
  FileText,
  BarChart3,
  RefreshCw,
  Edit3,
} from 'lucide-react';

export default function App() {
  const [financialInput, setFinancialInput] = useState<FinancialInput | null>(null);
  const [adviceData, setAdviceData] = useState<FinancialAdviceResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavTab>('input');
  const [dashboardSubTab, setDashboardSubTab] = useState<
    'charts' | 'budget' | 'savings' | 'summary' | 'simulator' | 'chat'
  >('charts');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [advisorSource, setAdvisorSource] = useState<'gemini' | 'fallback'>('gemini');
  const [modelUsed, setModelUsed] = useState<string>('gemini-3.8-flash');
  const [additionalSavingsFromSuggestions, setAdditionalSavingsFromSuggestions] = useState<number>(0);
  const [showLanding, setShowLanding] = useState<boolean>(true);

  // Quick Demo Mode trigger
  const handleTryDemo = async () => {
    setShowLanding(false);
    setFinancialInput(DEMO_FINANCIAL_INPUT);
    setIsLoading(true);

    try {
      const response = await fetchFinancialAdvice(DEMO_FINANCIAL_INPUT);
      setAdviceData(response.data);
      setAdvisorSource(response.source);
      if (response.modelUsed) setModelUsed(response.modelUsed);
      setActiveTab('dashboard');
      setDashboardSubTab('charts');
    } catch {
      const fallback = generateRealisticAdvice(DEMO_FINANCIAL_INPUT);
      setAdviceData(fallback);
      setAdvisorSource('fallback');
      setActiveTab('dashboard');
      setDashboardSubTab('charts');
    } finally {
      setIsLoading(false);
    }
  };

  // Form submission handler
  const handleFormSubmit = async (input: FinancialInput) => {
    setFinancialInput(input);
    setShowLanding(false);
    setIsLoading(true);

    try {
      const response = await fetchFinancialAdvice(input);
      setAdviceData(response.data);
      setAdvisorSource(response.source);
      if (response.modelUsed) setModelUsed(response.modelUsed);
      setActiveTab('dashboard');
      setDashboardSubTab('charts');
    } catch {
      const fallback = generateRealisticAdvice(input);
      setAdviceData(fallback);
      setAdvisorSource('fallback');
      setActiveTab('dashboard');
      setDashboardSubTab('charts');
    } finally {
      setIsLoading(false);
    }
  };

  // Currency switch
  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    if (!financialInput) return;
    const updatedInput: FinancialInput = {
      ...financialInput,
      currency: newCurrency,
    };
    setFinancialInput(updatedInput);
    if (adviceData) {
      setAdviceData(generateRealisticAdvice(updatedInput));
    }
  };

  // Clear plan
  const handleClearPlan = () => {
    setFinancialInput(null);
    setAdviceData(null);
    setShowLanding(true);
    setActiveTab('input');
  };

  // Apply savings to simulator
  const handleApplySavingsToSimulator = (savingsAmount: number) => {
    setAdditionalSavingsFromSuggestions(savingsAmount);
    setActiveTab('simulator');
    setDashboardSubTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'input') {
            setShowLanding(false);
          }
          setActiveTab(tab);
          if (tab === 'budget') setDashboardSubTab('budget');
          if (tab === 'savings') setDashboardSubTab('savings');
          if (tab === 'simulator') setDashboardSubTab('simulator');
          if (tab === 'advisor') setDashboardSubTab('chat');
          if (tab === 'dashboard') setDashboardSubTab('charts');
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onTryDemo={handleTryDemo}
        hasPlan={Boolean(adviceData && financialInput)}
        onNewPlan={() => {
          setShowLanding(false);
          setActiveTab('input');
        }}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* State 1: Landing Page */}
        {showLanding && !adviceData && (
          <LandingHero
            onCreatePlan={() => {
              setShowLanding(false);
              setActiveTab('input');
            }}
            onTryDemo={handleTryDemo}
          />
        )}

        {/* State 2: Financial Input Form */}
        {!showLanding && activeTab === 'input' && (
          <FinancialInputForm
            initialData={financialInput || undefined}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        )}

        {/* State 3: Financial Dashboard & Specialized Views */}
        {adviceData && financialInput && !showLanding && activeTab !== 'input' && (
          <div className="space-y-6">
            {/* Context Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    Financial Planning Dashboard
                  </h1>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      advisorSource === 'gemini'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {advisorSource === 'gemini' ? 'Gemini 3.8 Flash' : 'Deterministic Mode'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Plan Goal: <strong className="text-slate-800">{financialInput.financialGoal}</strong> ·
                  Risk Stance: <strong className="text-slate-800">{financialInput.riskPreference}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setActiveTab('input')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modify Inputs</span>
                </button>
                <button
                  onClick={handleTryDemo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
              </div>
            </div>

            {/* 4 Summary Cards */}
            <TopSummaryCards plan={adviceData.budget_plan} currency={financialInput.currency} />

            {/* Sub-navigation tabs inside dashboard */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl overflow-x-auto no-scrollbar">
              {[
                { id: 'charts', label: 'Overview & Charts', icon: BarChart3 },
                { id: 'budget', label: 'Budget Plan', icon: DollarSign },
                { id: 'savings', label: 'Saving Suggestions', icon: Sparkles },
                { id: 'summary', label: 'Monthly Summary', icon: FileText },
                { id: 'simulator', label: 'What-If? Simulator', icon: Sliders },
                { id: 'chat', label: 'Ask FinWise AI', icon: Bot },
              ].map((tab) => {
                const isActive = dashboardSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setDashboardSubTab(tab.id as any);
                      if (tab.id === 'charts') setActiveTab('dashboard');
                      if (tab.id === 'budget') setActiveTab('budget');
                      if (tab.id === 'savings') setActiveTab('savings');
                      if (tab.id === 'simulator') setActiveTab('simulator');
                      if (tab.id === 'chat') setActiveTab('advisor');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-tab view router */}
            <div className="pt-2">
              {dashboardSubTab === 'charts' && (
                <VisualizationsView input={financialInput} plan={adviceData.budget_plan} />
              )}

              {dashboardSubTab === 'budget' && (
                <BudgetPlanView plan={adviceData.budget_plan} input={financialInput} />
              )}

              {dashboardSubTab === 'savings' && (
                <SavingSuggestionsView
                  suggestions={adviceData.saving_suggestions}
                  currency={financialInput.currency}
                  onApplySavingsToSimulator={handleApplySavingsToSimulator}
                />
              )}

              {dashboardSubTab === 'summary' && (
                <MonthlySummaryView
                  summary={adviceData.monthly_summary}
                  currency={financialInput.currency}
                />
              )}

              {dashboardSubTab === 'simulator' && (
                <WhatIfSimulator
                  input={financialInput}
                  plan={adviceData.budget_plan}
                  additionalSavingsFromSuggestions={additionalSavingsFromSuggestions}
                />
              )}

              {dashboardSubTab === 'chat' && (
                <AskFinWiseChat financialData={financialInput} />
              )}
            </div>

            {/* Footer Disclaimer */}
            <div className="pt-8">
              <DisclaimerBanner />
            </div>
          </div>
        )}
      </main>

      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay message="FinWise AI is analyzing your finances..." />}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currency={financialInput?.currency || 'INR'}
        onChangeCurrency={handleCurrencyChange}
        onResetToDemo={handleTryDemo}
        onClearPlan={handleClearPlan}
        modelUsed={modelUsed}
        source={advisorSource}
      />

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">FinWise AI</span>
            <span>· Personal Finance Advisor</span>
          </div>
          <div>
            Built with Google Gemini 3.8 Flash · Educational and planning purpose only
          </div>
        </div>
      </footer>
    </div>
  );
}
