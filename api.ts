import { FinancialInput, FinancialAdviceResponse, ChatMessage } from '../types/finance';
import { generateRealisticAdvice } from '../data/demoData';

export async function fetchFinancialAdvice(input: FinancialInput): Promise<{
  data: FinancialAdviceResponse;
  source: 'gemini' | 'fallback';
  modelUsed?: string;
}> {
  try {
    const res = await fetch('/api/financial-advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.warn('Backend returned non-200, using reliable fallback advice:', errBody);
      return {
        data: generateRealisticAdvice(input),
        source: 'fallback',
      };
    }

    const json = await res.json();
    return {
      data: json.advice || json,
      source: json.source || 'gemini',
      modelUsed: json.modelUsed || 'gemini-3.8-flash',
    };
  } catch (err) {
    console.warn('Network call failed, utilizing client fallback advice:', err);
    return {
      data: generateRealisticAdvice(input),
      source: 'fallback',
    };
  }
}

export async function sendChatMessage(
  message: string,
  financialData: FinancialInput,
  history: ChatMessage[]
): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        financialData,
        history,
      }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.warn('Chat API error, using smart fallback reply:', err);
    return generateFallbackChatReply(message, financialData);
  }
}

function generateFallbackChatReply(query: string, data: FinancialInput): string {
  const q = query.toLowerCase();
  const totalIncome = data.income + (data.otherIncome || 0);
  const totalExpenses = data.expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const surplus = Math.max(0, totalIncome - totalExpenses);
  const curr = data.currency;

  if (q.includes('save') && (q.includes('more') || q.includes('5000') || q.includes('how'))) {
    return `To save ₹5,000 more each month:
1. **Trim dining & food delivery**: Cutting takeaway orders by 2 meals a week typically saves ~₹2,000–₹2,500/month.
2. **Review Shopping**: Adopting a 48-hour pause before non-essential purchases will save ~₹1,500–₹2,000/month.
3. **Audit Subscriptions**: Cancel unused entertainment/app memberships to instantly save ₹500–₹1,000/month.
Combined, these slight behavioral adjustments easily unlock ₹5,000 without sacrificing your essential lifestyle!`;
  }

  if (q.includes('too much') || q.includes('spend') || q.includes('where')) {
    const highest = [...data.expenses].sort((a, b) => b.amount - a.amount)[0];
    return `Looking at your expenses, your largest expenditure category is **${highest?.category}** at ${curr === 'INR' ? '₹' : curr}${highest?.amount.toLocaleString()} (${Math.round((highest?.amount / totalIncome) * 100)}% of your income). 

Your discretionary spending (Shopping & Entertainment) totals ${curr === 'INR' ? '₹' : curr}${(data.expenses.filter(e => ['Shopping', 'Entertainment'].includes(e.category)).reduce((a, b) => a + b.amount, 0)).toLocaleString()}. This is the prime area where small adjustments produce immediate cash flow.`;
  }

  if (q.includes('afford') || q.includes('current expenses') || q.includes('safe')) {
    const ratio = Math.round((totalExpenses / totalIncome) * 100);
    return `Your total expenses are ${curr === 'INR' ? '₹' : curr}${totalExpenses.toLocaleString()}, which is **${ratio}%** of your total monthly income (${curr === 'INR' ? '₹' : curr}${totalIncome.toLocaleString()}).

Because this leaves an available surplus of ${curr === 'INR' ? '₹' : curr}${surplus.toLocaleString()} (${100 - ratio}%), your current expense structure is **financially sustainable**. However, staying vigilant on non-essential categories will protect this surplus as inflation shifts.`;
  }

  if (q.includes('how long') || q.includes('reach') || q.includes('goal') || q.includes('timeline')) {
    const remaining = Math.max(0, data.targetAmount - data.currentSavings);
    const months = surplus > 0 ? Math.ceil(remaining / surplus) : 99;
    return `To reach your goal of "${data.financialGoal}" (${curr === 'INR' ? '₹' : curr}${data.targetAmount.toLocaleString()}):
• You currently have ${curr === 'INR' ? '₹' : curr}${data.currentSavings.toLocaleString()} saved.
• Remaining to save: ${curr === 'INR' ? '₹' : curr}${remaining.toLocaleString()}.
• At your current surplus rate of ${curr === 'INR' ? '₹' : curr}${surplus.toLocaleString()}/month, you will reach your goal in approximately **${months} months**.
• If you increase savings by just ₹2,500/month, you would reach it ~${Math.max(1, Math.round(months * 0.2))} months sooner!`;
  }

  return `Based on your monthly income of ${curr === 'INR' ? '₹' : curr}${totalIncome.toLocaleString()} and expenses of ${curr === 'INR' ? '₹' : curr}${totalExpenses.toLocaleString()}, you have an available surplus of ${curr === 'INR' ? '₹' : curr}${surplus.toLocaleString()} per month. You are making steady progress toward "${data.financialGoal}". Feel free to ask about budget adjustments, debt management, or cutting discretionary costs!`;
}
