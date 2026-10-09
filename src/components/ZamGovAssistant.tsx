import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw,
  MessageSquare
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const ZamGovAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `Mwapoleni / Muli bwanji! Welcome to **ZamOS Citizen AI Navigator**. 

I am your official sovereign digital guide for all public systems across the Republic of Zambia. You can ask me anything about:
* **ZESCO:** Prepaid LUKU tokens, lifeline tariffs, load-shedding rationing schedules, Kariba dam storage.
* **ZRA:** 2026 PAYE salary brackets, TPIN issuance, 4% turnover tax for SMEs, customs border clearing.
* **CDF:** Applying for K30.6M Constituency Development Fund bursaries & youth/women cooperative grants.
* **PACRA:** Company name availability and digital incorporation steps under the Companies Act 2017.
* **RTSA & NRFA:** Driver's license renewal, road fitness, carbon tax, and electronic toll card passes.
* **Health & Home Affairs:** SmartCare records, NHIMA medical insurance, NRC replacements, and e-Passports.

How can I assist you today?`,
      timestamp: '14:55',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'How do I calculate 2026 PAYE on a K15,000 salary?',
    'How do I purchase a ZESCO LUKU token and what are the lifeline tariffs?',
    'What are the requirements to apply for a CDF youth grant?',
    'How do I incorporate a limited company at PACRA?',
    'How do I renew my RTSA driver’s license or pay road tax?',
    'How do I replace a lost Green National Registration Card (NRC)?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          conversationHistory: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Failed to query assistant API:', err);
      // Fallback
      const fallbackMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: `Thank you for your inquiry regarding "${text}". 
For urgent public services:
- **ZESCO Prepaid LUKU:** Purchase on the ZESCO tab or via Mobile Money (*115# Airtel, *303# MTN, *344# Zamtel).
- **ZRA Taxes:** Annual returns & PAYE filing via the ZRA tab or mytax.zra.org.zm.
- **CDF Support:** Applications are vetted through your local Ward Development Committee (WDC).
- **Emergency:** Dial 991 (Police), 992 (Fire), 993 (Ambulance), or 112 (DMMU).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Smart ZamGov Assistant</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono">Gemini 3.8 Flash Sovereign Co-Pilot</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display mt-1">
              Multilingual Zambian Citizen & Civic Advisory Intelligence
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Instant conversational guidance for citizen procedures, statutory laws, business registration, tax compliance, load shedding, and public grants across English, Bemba, Nyanja, Tonga, and Lozi.
            </p>
          </div>
        </div>

        {/* Quick prompt suggestions */}
        <div className="pt-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Frequently Asked Zambian Civic Queries
          </div>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-xs bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col h-[560px] overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  <div>{m.text}</div>
                  <div
                    className={`text-[10px] font-mono ${
                      isUser ? 'text-emerald-200' : 'text-slate-500'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Consulting ZamOS public systems and statutory regulations...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about ZESCO tokens, ZRA PAYE, CDF grants, PACRA, RTSA, or civil registry..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask ZamOS</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
