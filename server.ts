import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(aiClient),
    model: 'gemini-3.8-flash',
  });
});

// Financial Advice generation endpoint
app.post('/api/financial-advice', async (req: Request, res: Response) => {
  try {
    const {
      income = 0,
      otherIncome = 0,
      currency = 'INR',
      expenses = [],
      financialGoal = 'Financial Security',
      targetAmount = 0,
      targetDate = '',
      currentSavings = 0,
      riskPreference = 'Balanced',
      notes = '',
    } = req.body;

    // Validate numbers
    const numIncome = Number(income) || 0;
    const numOtherIncome = Number(otherIncome) || 0;
    const numTarget = Number(targetAmount) || 0;
    const numSavings = Number(currentSavings) || 0;

    const totalIncome = numIncome + numOtherIncome;
    const totalExpenses = (expenses as any[]).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const availableBalance = Math.max(0, totalIncome - totalExpenses);

    // If Gemini client is available, try generating AI financial plan
    if (aiClient) {
      try {
        const prompt = `You are FinWise AI, a certified, rigorous, and empathetic personal finance advisor.
Analyze the following personal financial situation:

Total Monthly Regular Income: ${currency} ${numIncome}
Additional Monthly Income: ${currency} ${numOtherIncome}
Total Combined Income: ${currency} ${totalIncome}

Monthly Expenses Breakdown:
${(expenses as any[]).map((e) => `- ${e.category}${e.label ? ` (${e.label})` : ''}: ${currency} ${e.amount}`).join('\n')}
Total Expenses: ${currency} ${totalExpenses}
Net Available Surplus/Balance: ${currency} ${availableBalance}

Financial Goal: "${financialGoal}"
Target Goal Amount: ${currency} ${numTarget}
Target Goal Date: ${targetDate || 'Not specified'}
Current Savings/Accumulated Capital: ${currency} ${numSavings}
Risk Tolerance / Preference: ${riskPreference}
User Notes: ${notes || 'None provided'}

Guidelines:
1. Adhere to the classic 50/30/20 budget framework (Needs ~50%, Wants ~30%, Savings/Debt payoff ~20%).
2. Categorize Housing, Food, Transportation, Utilities, Healthcare, and Education as Needs.
3. Categorize Entertainment, Shopping, and miscellaneous discretionary items as Wants.
4. Calculate realistic recommended monthly savings (never higher than available balance).
5. Generate 3 to 5 highly concrete, actionable, personalized saving suggestions with realistic estimated monthly savings amounts in ${currency} (do NOT promise guaranteed returns; frame as achievable estimates).
6. Provide an honest monthly summary assessing overall health ("Excellent", "Healthy", "Moderate", "Needs Attention") with a numeric health score (1-100), positive observation, area to improve, and next month's immediate focus.
7. Return strictly valid JSON matching this exact structure:
{
  "budget_plan": {
    "total_income": number,
    "total_expenses": number,
    "available_balance": number,
    "recommended_monthly_savings": number,
    "savings_rate": number,
    "needs_total": number,
    "needs_percentage": number,
    "wants_total": number,
    "wants_percentage": number,
    "savings_total": number,
    "savings_percentage": number,
    "needs_breakdown": [
      { "category": string, "amount": number, "percentageOfIncome": number, "percentageOfExpenses": number, "note": string }
    ],
    "wants_breakdown": [
      { "category": string, "amount": number, "percentageOfIncome": number, "percentageOfExpenses": number, "note": string }
    ],
    "goal_progress_percent": number,
    "estimated_months_to_goal": number
  },
  "saving_suggestions": [
    {
      "id": string,
      "title": string,
      "category": string,
      "explanation": string,
      "estimated_monthly_saving": number,
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "monthly_summary": {
    "overall_health": "Excellent" | "Healthy" | "Moderate" | "Needs Attention",
    "health_score": number,
    "summary_text": string,
    "biggest_spending_category": string,
    "savings_progress": string,
    "positive_observation": string,
    "area_to_improve": string,
    "next_month_focus": string
  },
  "insights": [ string, string, string ]
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const rawText = response.text || '';
        const parsed = JSON.parse(rawText);

        return res.json({
          source: 'gemini',
          modelUsed: 'gemini-3.8-flash',
          advice: parsed,
        });
      } catch (geminiError) {
        console.error('Gemini generation error, falling back to deterministic advice:', geminiError);
      }
    }

    // Fallback calculation response (used when no API key is provided, offline, or upon API error)
    const fallbackAdvice = generateFallbackPlan(req.body);
    return res.json({
      source: 'fallback',
      advice: fallbackAdvice,
    });
  } catch (error) {
    console.error('Error handling /api/financial-advice:', error);
    res.status(500).json({ error: 'Internal server error processing financial advice' });
  }
});

// Chat endpoint for "Ask FinWise AI"
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, financialData, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (aiClient) {
      try {
        const totalIncome = (Number(financialData?.income) || 0) + (Number(financialData?.otherIncome) || 0);
        const totalExpenses = (financialData?.expenses || []).reduce((s: number, e: any) => s + (Number(e.amount) || 0), 0);
        const surplus = totalIncome - totalExpenses;
        const currency = financialData?.currency || 'INR';

        const conversationContext = (history as any[])
          .slice(-6)
          .map((m) => `${m.role === 'user' ? 'User' : 'FinWise AI'}: ${m.content}`)
          .join('\n');

        const systemPrompt = `You are FinWise AI, an educational personal finance advisor.
User Financial Profile:
- Monthly Income: ${currency} ${totalIncome}
- Monthly Expenses: ${currency} ${totalExpenses}
- Net Monthly Balance: ${currency} ${surplus}
- Goal: "${financialData?.financialGoal || 'Emergency Fund'}"
- Target Amount: ${currency} ${financialData?.targetAmount || 0}
- Current Savings: ${currency} ${financialData?.currentSavings || 0}
- Risk Preference: ${financialData?.riskPreference || 'Balanced'}
- Itemized Expenses: ${(financialData?.expenses || []).map((e: any) => `${e.category}: ${currency} ${e.amount}`).join(', ')}

Guidelines:
- Give concise, highly practical, mathematical, and empathetic responses.
- Format with clear bullet points where helpful.
- Reference their actual numbers and goal.
- Always include an estimate disclaimer if making projections.
- Answer the user's specific question directly.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${systemPrompt}\n\nRecent Conversation:\n${conversationContext}\n\nUser: ${message}\nFinWise AI:`,
          config: {
            temperature: 0.4,
          },
        });

        return res.json({
          reply: response.text || 'I analyzed your query based on your financial plan.',
        });
      } catch (geminiError) {
        console.error('Gemini chat error:', geminiError);
      }
    }

    // Fallback chat reply
    return res.json({
      reply: getSmartFallbackReply(message, financialData),
    });
  } catch (error) {
    console.error('Error handling /api/chat:', error);
    res.status(500).json({ error: 'Internal server error processing chat message' });
  }
});

function generateFallbackPlan(input: any) {
  const numIncome = Number(input.income) || 0;
  const numOtherIncome = Number(input.otherIncome) || 0;
  const totalIncome = numIncome + numOtherIncome;
  const expenses = input.expenses || [];
  const totalExpenses = expenses.reduce((s: number, e: any) => s + (Number(e.amount) || 0), 0);
  const availableBalance = Math.max(0, totalIncome - totalExpenses);
  const currency = input.currency || 'INR';

  const needCategories = ['housing', 'food', 'transportation', 'utilities', 'healthcare', 'education', 'rent'];

  let needsTotal = 0;
  let wantsTotal = 0;

  expenses.forEach((e: any) => {
    const amt = Number(e.amount) || 0;
    if (needCategories.includes(String(e.category).toLowerCase())) {
      needsTotal += amt;
    } else {
      wantsTotal += amt;
    }
  });

  const needsPercentage = totalIncome > 0 ? (needsTotal / totalIncome) * 100 : 0;
  const wantsPercentage = totalIncome > 0 ? (wantsTotal / totalIncome) * 100 : 0;
  const savingsRate = totalIncome > 0 ? (availableBalance / totalIncome) * 100 : 0;

  const targetAmount = Number(input.targetAmount) || 0;
  const currentSavings = Number(input.currentSavings) || 0;
  const remaining = Math.max(0, targetAmount - currentSavings);

  const recommendedSavings = Math.min(
    availableBalance,
    Math.max(Math.round(totalIncome * 0.2), Math.round(availableBalance * 0.85))
  );

  const estimatedMonths = recommendedSavings > 0 ? Math.ceil(remaining / recommendedSavings) : 99;
  const progressPercent = targetAmount > 0 ? Math.min(100, Math.round((currentSavings / targetAmount) * 1000) / 10) : 0;

  return {
    budget_plan: {
      total_income: totalIncome,
      total_expenses: totalExpenses,
      available_balance: availableBalance,
      recommended_monthly_savings: recommendedSavings,
      savings_rate: Math.round(savingsRate * 10) / 10,
      needs_total: needsTotal,
      needs_percentage: Math.round(needsPercentage * 10) / 10,
      wants_total: wantsTotal,
      wants_percentage: Math.round(wantsPercentage * 10) / 10,
      savings_total: availableBalance,
      savings_percentage: Math.round(savingsRate * 10) / 10,
      needs_breakdown: expenses
        .filter((e: any) => needCategories.includes(String(e.category).toLowerCase()))
        .map((e: any) => ({
          category: e.category,
          amount: Number(e.amount) || 0,
          percentageOfIncome: totalIncome > 0 ? Math.round(((Number(e.amount) || 0) / totalIncome) * 1000) / 10 : 0,
          percentageOfExpenses: totalExpenses > 0 ? Math.round(((Number(e.amount) || 0) / totalExpenses) * 1000) / 10 : 0,
          note: 'Essential living requirement',
        })),
      wants_breakdown: expenses
        .filter((e: any) => !needCategories.includes(String(e.category).toLowerCase()))
        .map((e: any) => ({
          category: e.category,
          amount: Number(e.amount) || 0,
          percentageOfIncome: totalIncome > 0 ? Math.round(((Number(e.amount) || 0) / totalIncome) * 1000) / 10 : 0,
          percentageOfExpenses: totalExpenses > 0 ? Math.round(((Number(e.amount) || 0) / totalExpenses) * 1000) / 10 : 0,
          note: 'Discretionary lifestyle spending',
        })),
      goal_progress_percent: progressPercent,
      estimated_months_to_goal: estimatedMonths,
    },
    saving_suggestions: [
      {
        id: '1',
        title: 'Optimize Food & Dining Expenses',
        category: 'Food',
        explanation: `Your food expenditure is a key flexible category. Preparing meal plans for weekdays and moderating food delivery can comfortably free up ~15-20% each month.`,
        estimated_monthly_saving: Math.round(Math.max(1000, totalIncome * 0.04)),
        priority: 'High',
      },
      {
        id: '2',
        title: 'Adopt the 48-Hour Rule for Shopping',
        category: 'Shopping',
        explanation: `Introduce a deliberate 48-hour cooling period for any non-essential purchase over ${currency} 1,000 to eliminate impulse decisions.`,
        estimated_monthly_saving: Math.round(Math.max(1200, totalIncome * 0.05)),
        priority: 'Medium',
      },
      {
        id: '3',
        title: 'Audit Recurring Subscriptions & Memberships',
        category: 'Entertainment',
        explanation: `Review active streaming services, app subscriptions, and digital entertainment packages for unused overlaps.`,
        estimated_monthly_saving: Math.round(Math.max(500, totalIncome * 0.02)),
        priority: 'Low',
      },
      {
        id: '4',
        title: 'Automate Salary-Day Savings Transfers',
        category: 'Savings',
        explanation: `Schedule an automatic standing instruction of ${currency} ${recommendedSavings.toLocaleString()} to your goal repository on salary day to pay yourself first.`,
        estimated_monthly_saving: recommendedSavings,
        priority: 'High',
      },
    ],
    monthly_summary: {
      overall_health: savingsRate >= 20 ? 'Healthy' : savingsRate >= 10 ? 'Moderate' : 'Needs Attention',
      health_score: savingsRate >= 20 ? 82 : savingsRate >= 10 ? 65 : 48,
      summary_text: `You have an available surplus of ${currency} ${availableBalance.toLocaleString()} each month (${Math.round(savingsRate)}% of total earnings). Your core living expenses are sustainable.`,
      biggest_spending_category: expenses.length > 0 ? `${[...expenses].sort((a: any, b: any) => b.amount - a.amount)[0]?.category} (${currency} ${[...expenses].sort((a: any, b: any) => b.amount - a.amount)[0]?.amount?.toLocaleString()})` : 'N/A',
      savings_progress: `${currency} ${currentSavings.toLocaleString()} saved towards "${input.financialGoal || 'Goal'}" (${progressPercent}% achieved).`,
      positive_observation: `Your overall needs represent ${Math.round(needsPercentage)}% of income, keeping you near the recommended 50% guideline.`,
      area_to_improve: `Trimming discretionary lifestyle categories could increase monthly savings by an estimated ${currency} ${Math.round(totalIncome * 0.06).toLocaleString()}.`,
      next_month_focus: `Set up an automated transfer of ${currency} ${recommendedSavings.toLocaleString()} into your emergency buffer account immediately on payday.`,
    },
    insights: [
      `Your 50/30/20 breakdown is currently ${Math.round(needsPercentage)}% Needs, ${Math.round(wantsPercentage)}% Wants, and ${Math.round(savingsRate)}% Savings.`,
      `At your current rate, you will reach your ${currency} ${targetAmount.toLocaleString()} target in approximately ${estimatedMonths} months.`,
      `Maintaining a positive monthly cash flow of ${currency} ${availableBalance.toLocaleString()} provides flexibility against unexpected expenses.`,
    ],
  };
}

function getSmartFallbackReply(query: string, data: any): string {
  const q = query.toLowerCase();
  const totalIncome = (Number(data?.income) || 0) + (Number(data?.otherIncome) || 0);
  const totalExpenses = (data?.expenses || []).reduce((s: number, e: any) => s + (Number(e.amount) || 0), 0);
  const surplus = Math.max(0, totalIncome - totalExpenses);
  const symbol = data?.currency === 'USD' ? '$' : data?.currency === 'EUR' ? '€' : '₹';

  if (q.includes('5000') || q.includes('save more') || q.includes('how to save')) {
    return `Here is a practical roadmap to save an extra ${symbol}5,000 monthly:
1. **Reduce food delivery & dining out**: Cutting 2 delivery orders per week frees up ~${symbol}2,000–${symbol}2,500.
2. **Implement a 48-Hour Shopping Rule**: Pausing before non-essential purchases trims impulse buys by ~${symbol}1,500–${symbol}2,000.
3. **Audit entertainment subscriptions**: Consolidating OTT apps saves ~${symbol}500–${symbol}1,000.
By applying these adjustments, you can channel an additional ${symbol}5,000 directly into your goal.`;
  }

  if (q.includes('too much') || q.includes('where am i spending')) {
    const highest = [...(data?.expenses || [])].sort((a: any, b: any) => b.amount - a.amount)[0];
    return `Your largest single expenditure is **${highest?.category || 'Housing'}** at ${symbol}${(highest?.amount || 0).toLocaleString()}, which represents ${totalIncome > 0 ? Math.round(((highest?.amount || 0) / totalIncome) * 100) : 0}% of your total income.

To identify quick wins, look at your discretionary spending (Shopping and Entertainment), which can usually be adjusted without impacting everyday necessities.`;
  }

  if (q.includes('afford') || q.includes('current expenses')) {
    const ratio = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;
    return `Your total expenses (${symbol}${totalExpenses.toLocaleString()}) account for **${ratio}%** of your monthly income (${symbol}${totalIncome.toLocaleString()}).

Because you maintain a healthy surplus of **${symbol}${surplus.toLocaleString()}** (${100 - ratio}%), your current expense structure is sustainable.`;
  }

  if (q.includes('how long') || q.includes('reach') || q.includes('goal')) {
    const target = Number(data?.targetAmount) || 150000;
    const current = Number(data?.currentSavings) || 40000;
    const remaining = Math.max(0, target - current);
    const months = surplus > 0 ? Math.ceil(remaining / surplus) : 99;
    return `To reach your goal of "${data?.financialGoal || 'Emergency Fund'}" (${symbol}${target.toLocaleString()}):
• Remaining: ${symbol}${remaining.toLocaleString()}
• With your current monthly surplus of ${symbol}${surplus.toLocaleString()}, it will take approximately **${months} months**.
• If you increase monthly savings by ${symbol}3,000, you will reach it ~${Math.max(1, Math.round(months * 0.25))} months faster!`;
  }

  return `Based on your monthly income of ${symbol}${totalIncome.toLocaleString()} and expenses of ${symbol}${totalExpenses.toLocaleString()}, you have an available monthly surplus of ${symbol}${surplus.toLocaleString()}. Let me know how I can help optimize your budget or accelerate your savings!`;
}

// Development or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`FinWise AI server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
