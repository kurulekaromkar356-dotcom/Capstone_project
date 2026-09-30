# FinWise AI – Personal Finance Advisor

FinWise AI is a modern, production-grade personal finance assistant that analyzes income, recurring expenses, and savings goals using Google's **Gemini API** (`gemini-3.8-flash`) to generate:

1. **Personalized 50/30/20 Budget Plan**
2. **AI Saving Suggestions** (with estimated monthly impact & priorities)
3. **Monthly Financial Summary & Health Score**
4. **Interactive "What-If?" Scenario Simulator**
5. **"Ask FinWise AI" Interactive Financial Advisor Chat**

---

## Architecture Overview

```
Frontend (React + TypeScript + Tailwind CSS + Recharts)
   │
   ├──> Node / Express Full-Stack Server (server.ts)  ──> Google Gemini API (gemini-3.8-flash)
   │     (Pre-configured port 3000 in AI Studio)
   │
   └──> Standalone Python Flask API (/backend/app.py) ──> Google Gemini API
         (Port 5000 for Python-centric deployments)
```

The application strictly protects your API credentials: **the Gemini API key is never exposed to client-side code**.

---

## 1. How to Install Dependencies

### Full-Stack Node / Express (Default AI Studio Environment)
```bash
npm install
```

### Standalone Python Flask Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## 2. How to Configure `GEMINI_API_KEY`

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. In the project root, create or edit `.env`:
   ```bash
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```
3. For the Python backend, copy `/backend/.env.example` to `/backend/.env`:
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and replace GEMINI_API_KEY with your key
   ```

> **Note on Zero-Configuration Demo Mode**: If `GEMINI_API_KEY` is not set or network quota is exceeded, FinWise AI automatically activates its deterministic financial planning engine. This ensures the app can always be demonstrated reliably.

---

## 3. How to Start the Python Flask Backend

```bash
cd backend
source venv/bin/activate    # On Windows: venv\Scripts\activate
python app.py
```
The Flask REST API will start on `http://127.0.0.1:5000` with the endpoints:
- `POST /api/financial-advice`
- `POST /api/chat`
- `GET /api/health`

---

## 4. How to Start the Frontend

In the root directory:
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

To build for production:
```bash
npm run build
npm start
```

---

## 5. How to Use Demo Mode

FinWise AI includes a single-click demo flow:

1. On the landing page, click the **"Try Demo"** button.
2. The application will instantly load the realistic profile:
   - **Monthly Income**: ₹50,000
   - **Other Income**: ₹5,000
   - **Expenses**: Housing (₹15,000), Food (₹7,000), Transportation (₹4,000), Utilities (₹3,000), Entertainment (₹3,000), Shopping (₹4,000), Healthcare (₹2,000), Other (₹2,000)
   - **Current Savings**: ₹40,000
   - **Goal**: "Build an emergency fund" (Target: ₹1,50,000)
3. FinWise AI immediately generates:
   - **Top Summary Cards**: Income, Expenses, Available Balance, Suggested Savings
   - **50/30/20 Budget Breakdown**: Interactive Donut Chart & Savings Goal Progress Meter
   - **AI Saving Suggestions**: 4 prioritized recommendations with monthly impact
   - **AI Monthly Summary**: Financial health score, observations, and next month's focus
   - **What-If? Simulator**: Dynamic sliders to test the impact of modifying income or savings
   - **Ask FinWise AI Chat**: Grounded Q&A for questions like *"How can I save ₹5,000 more every month?"*

---

## Educational Disclaimer

FinWise AI provides estimates and educational financial insights. It does not provide professional financial, investment, tax, or legal advice, and its recommendations do not guarantee financial outcomes.
