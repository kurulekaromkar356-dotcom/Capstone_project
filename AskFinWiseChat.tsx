import React, { useState, useRef, useEffect } from 'react';
import { FinancialInput, ChatMessage } from '../types/finance';
import { sendChatMessage } from '../services/api';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';

interface AskFinWiseChatProps {
  financialData: FinancialInput;
}

const QUICK_PROMPTS = [
  'How can I save ₹5,000 more every month?',
  'Where am I spending too much?',
  'Can I afford my current expenses?',
  'How long will it take me to reach my savings goal?',
];

export const AskFinWiseChat: React.FC<AskFinWiseChatProps> = ({ financialData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm FinWise AI. I have analyzed your monthly income and expenses. What questions do you have about optimizing your budget or reaching your goal of "${financialData.financialGoal}"?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsSending(true);

    try {
      const reply = await sendChatMessage(query, financialData, messages);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an issue analyzing that request. Please try again or rephrase your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center shrink-0">
            <img
              src="/src/assets/images/avatar_advisor_bot_1790762931366.jpg"
              alt="FinWise AI Avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-slate-900">Ask FinWise AI</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500">
              Personalized AI advisor grounded in your live cash-flow profile
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono tabular-nums hidden sm:block">
          Income: {financialData.currency === 'INR' ? '₹' : financialData.currency}
          {(financialData.income + (financialData.otherIncome || 0)).toLocaleString()}
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="px-4 py-2.5 bg-slate-100/60 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-600" />
          <span>Quick:</span>
        </span>
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            disabled={isSending}
            className="text-xs bg-white hover:bg-slate-50 text-slate-700 font-medium px-3 py-1 rounded-lg border border-slate-200 hover:border-slate-300 shadow-2xs whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-white'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-1 shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs'
                  : 'bg-slate-100 text-slate-800 rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-line font-normal">{msg.content}</div>
              <div
                className={`text-[10px] text-right font-mono tabular-nums ${
                  msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 text-slate-700 rounded-2xl rounded-tl-xs p-3.5 text-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
              <span className="text-[11px] text-slate-500 font-medium ml-1">
                FinWise AI is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about spending cuts, budgeting rules, or timeline acceleration..."
            disabled={isSending}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isSending}
            aria-label="Send message"
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-[10px] text-slate-400 text-center mt-2">
          Responses are educational estimates generated using Gemini API.
        </div>
      </div>
    </div>
  );
};
