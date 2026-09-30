import os
import json
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class GeminiFinanceService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Error initializing Google GenAI Client: {e}")

    def generate_financial_advice(self, data: Dict[str, Any]) -> Dict[str, Any]:
        income = float(data.get("income", 0))
        other_income = float(data.get("otherIncome", 0))
        currency = data.get("currency", "INR")
        expenses = data.get("expenses", [])
        goal = data.get("financialGoal", "Emergency Fund")
        target_amount = float(data.get("targetAmount", 0))
        target_date = data.get("targetDate", "")
        current_savings = float(data.get("currentSavings", 0))
        risk_pref = data.get("riskPreference", "Balanced")
        notes = data.get("notes", "")

        total_income = income + other_income
        total_expenses = sum(float(e.get("amount", 0)) for e in expenses)
        available_balance = max(0.0, total_income - total_expenses)

        if self.client:
            try:
                prompt = f"""You are FinWise AI, a certified, analytical, and empathetic personal finance advisor.
Analyze the following user's monthly financial picture:

Currency: {currency}
Monthly Income: {income}
Other Monthly Income: {other_income}
Total Monthly Income: {total_income}
Monthly Expenses Breakdown:
{json.dumps(expenses, indent=2)}
Total Monthly Expenses: {total_expenses}
Net Available Surplus: {available_balance}

Financial Goal: "{goal}"
Target Goal Amount: {target_amount}
Target Date: "{target_date}"
Current Savings: {current_savings}
Risk Preference: {risk_pref}
Notes: "{notes}"

Analyze according to the 50/30/20 budget framework (Needs ~50%, Wants ~30%, Savings ~20%).
Return strictly valid JSON with this schema:
{{
  "budget_plan": {{
    "total_income": {total_income},
    "total_expenses": {total_expenses},
    "available_balance": {available_balance},
    "recommended_monthly_savings": number,
    "savings_rate": number,
    "needs_total": number,
    "needs_percentage": number,
    "wants_total": number,
    "wants_percentage": number,
    "savings_total": number,
    "savings_percentage": number,
    "needs_breakdown": [
      {{ "category": string, "amount": number, "percentageOfIncome": number, "percentageOfExpenses": number, "note": string }}
    ],
    "wants_breakdown": [
      {{ "category": string, "amount": number, "percentageOfIncome": number, "percentageOfExpenses": number, "note": string }}
    ],
    "goal_progress_percent": number,
    "estimated_months_to_goal": number
  }},
  "saving_suggestions": [
    {{
      "id": string,
      "title": string,
      "category": string,
      "explanation": string,
      "estimated_monthly_saving": number,
      "priority": "High" | "Medium" | "Low"
    }}
  ],
  "monthly_summary": {{
    "overall_health": "Excellent" | "Healthy" | "Moderate" | "Needs Attention",
    "health_score": number,
    "summary_text": string,
    "biggest_spending_category": string,
    "savings_progress": string,
    "positive_observation": string,
    "area_to_improve": string,
    "next_month_focus": string
  }},
  "insights": [ string, string, string ]
}}"""

                response = self.client.models.generate_content(
                    model="gemini-3.8-flash",
                    contents=prompt,
                    config={"response_mime_type": "application/json"}
                )
                parsed = json.loads(response.text)
                return {"source": "gemini", "modelUsed": "gemini-3.8-flash", "advice": parsed}
            except Exception as e:
                logger.warning(f"Gemini API execution failed, using fallback: {e}")

        return {"source": "fallback", "advice": self.fallback_advice(data, total_income, total_expenses, available_balance)}

    def generate_chat_reply(self, message: str, data: Dict[str, Any], history: list) -> str:
        if self.client:
            try:
                system_prompt = f"""You are FinWise AI, an educational personal finance advisor.
User Profile:
- Monthly Income: {data.get('currency', 'INR')} {float(data.get('income', 0)) + float(data.get('otherIncome', 0))}
- Total Expenses: {data.get('currency', 'INR')} {sum(float(e.get('amount', 0)) for e in data.get('expenses', []))}
- Goal: {data.get('financialGoal')} (Target: {data.get('targetAmount')})
Provide clear, actionable, and encouraging personal finance advice."""

                chat_prompt = f"{system_prompt}\nUser Question: {message}\nFinWise AI:"
                response = self.client.models.generate_content(
                    model="gemini-3.8-flash",
                    contents=chat_prompt
                )
                return response.text
            except Exception as e:
                logger.error(f"Chat generation error: {e}")

        return "FinWise AI is actively tracking your budget and goal metrics. Review your discretionary spending and maintain automated savings transfers for peak financial efficiency."

    def fallback_advice(self, data: Dict[str, Any], total_income: float, total_expenses: float, available_balance: float) -> Dict[str, Any]:
        needs_cats = {"housing", "food", "transportation", "utilities", "healthcare", "education"}
        expenses = data.get("expenses", [])
        currency = data.get("currency", "INR")
        target_amount = float(data.get("targetAmount", 150000))
        current_savings = float(data.get("currentSavings", 40000))

        needs_total = sum(float(e.get("amount", 0)) for e in expenses if str(e.get("category", "")).lower() in needs_cats)
        wants_total = sum(float(e.get("amount", 0)) for e in expenses if str(e.get("category", "")).lower() not in needs_cats)

        needs_pct = (needs_total / total_income * 100) if total_income > 0 else 0
        wants_pct = (wants_total / total_income * 100) if total_income > 0 else 0
        savings_rate = (available_balance / total_income * 100) if total_income > 0 else 0

        recommended_savings = min(available_balance, max(round(total_income * 0.2), round(available_balance * 0.85)))
        remaining = max(0.0, target_amount - current_savings)
        months = max(1, round(remaining / recommended_savings)) if recommended_savings > 0 else 99
        progress = round((current_savings / target_amount * 100), 1) if target_amount > 0 else 0

        return {
            "budget_plan": {
                "total_income": total_income,
                "total_expenses": total_expenses,
                "available_balance": available_balance,
                "recommended_monthly_savings": recommended_savings,
                "savings_rate": round(savings_rate, 1),
                "needs_total": needs_total,
                "needs_percentage": round(needs_pct, 1),
                "wants_total": wants_total,
                "wants_percentage": round(wants_pct, 1),
                "savings_total": available_balance,
                "savings_percentage": round(savings_rate, 1),
                "needs_breakdown": [
                    {
                        "category": e.get("category"),
                        "amount": float(e.get("amount", 0)),
                        "percentageOfIncome": round(float(e.get("amount", 0)) / total_income * 100, 1) if total_income > 0 else 0,
                        "percentageOfExpenses": round(float(e.get("amount", 0)) / total_expenses * 100, 1) if total_expenses > 0 else 0,
                        "note": "Essential core expense"
                    } for e in expenses if str(e.get("category", "")).lower() in needs_cats
                ],
                "wants_breakdown": [
                    {
                        "category": e.get("category"),
                        "amount": float(e.get("amount", 0)),
                        "percentageOfIncome": round(float(e.get("amount", 0)) / total_income * 100, 1) if total_income > 0 else 0,
                        "percentageOfExpenses": round(float(e.get("amount", 0)) / total_expenses * 100, 1) if total_expenses > 0 else 0,
                        "note": "Discretionary lifestyle expense"
                    } for e in expenses if str(e.get("category", "")).lower() not in needs_cats
                ],
                "goal_progress_percent": progress,
                "estimated_months_to_goal": months
            },
            "saving_suggestions": [
                {
                    "id": "1",
                    "title": "Optimize Food & Dining Expenses",
                    "category": "Food",
                    "explanation": f"Reducing dining out and batch cooking can comfortably free up ~15% of your food budget without sacrificing variety.",
                    "estimated_monthly_saving": round(total_income * 0.035),
                    "priority": "High"
                },
                {
                    "id": "2",
                    "title": "Implement a 48-Hour Shopping Rule",
                    "category": "Shopping",
                    "explanation": "Waiting 48 hours before discretionary non-essential purchases eliminates impulse buying effectively.",
                    "estimated_monthly_saving": round(total_income * 0.04),
                    "priority": "Medium"
                },
                {
                    "id": "3",
                    "title": "Audit Recurring Subscriptions",
                    "category": "Entertainment",
                    "explanation": "Consolidating digital entertainment subscriptions reduces recurring monthly outflows.",
                    "estimated_monthly_saving": round(total_income * 0.015),
                    "priority": "Low"
                }
            ],
            "monthly_summary": {
                "overall_health": "Healthy" if savings_rate >= 18 else "Moderate",
                "health_score": 80 if savings_rate >= 18 else 65,
                "summary_text": f"You maintain a monthly available surplus of {currency} {available_balance:,.0f} ({savings_rate:.1f}% savings rate).",
                "biggest_spending_category": "Housing & Food",
                "savings_progress": f"{currency} {current_savings:,.0f} saved toward goal ({progress}% complete). Estimated {months} months remaining.",
                "positive_observation": "Essential needs are well-covered with consistent monthly surplus.",
                "area_to_improve": "Discretionary categories can be trimmed to reach your target earlier.",
                "next_month_focus": f"Automate an initial savings transfer of {currency} {recommended_savings:,.0f} immediately upon receipt of income."
            },
            "insights": [
                f"Your budget breakdown is {needs_pct:.0f}% Needs, {wants_pct:.0f}% Wants, and {savings_rate:.0f}% Savings.",
                f"Saving {currency} {recommended_savings:,.0f} monthly will hit your {currency} {target_amount:,.0f} goal in approx {months} months."
            ]
        }
