import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Sparkles, ArrowRight, Calendar, 
  RotateCcw, Bot, User, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  actionTrigger?: string | null;
  timestamp: string;
}

interface ChatbotProps {
  onOpenScheduler: (serviceTitle?: string, notes?: string) => void;
  onOpenNonprofitModal: () => void;
}

const STARTER_PROMPTS = [
  "What is included in the 4-week QuickStart?",
  "How do you support nonprofits on NPSP or NPC?",
  "What does a CRM Health & Process Audit cover?",
  "Can you connect Salesforce to QuickBooks or Stripe?",
];

export const Chatbot: React.FC<ChatbotProps> = ({ onOpenScheduler, onOpenNonprofitModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am your Corner Stone Solutions advisory assistant. Ask me anything about our Salesforce QuickStarts, CRM Health Audits, custom Flow automation, or how we help growing businesses eliminate spreadsheet chaos.\n\nOnly information relevant to your specific question will be shared.",
      suggestions: [
        "What's in the 4-week QuickStart?",
        "How do you audit an existing CRM?",
        "Schedule a discovery call with an architect"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput('');

    // If user clicked prompt to schedule a call directly
    if (
      query.toLowerCase().includes('schedule a discovery call') ||
      query.toLowerCase().includes('book a call') ||
      query.toLowerCase().includes('book discovery')
    ) {
      onOpenScheduler(undefined, 'Scheduled via Chatbot inquiry');
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I've opened our live 30-minute discovery scheduler for you. You can pick an upcoming business date and time slot that fits your schedule best.",
        suggestions: [
          "What questions will the architect ask on the call?",
          "What is the typical QuickStart pricing?"
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() - 1).toString(),
          role: 'user',
          content: query,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        assistantMessage,
      ]);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to connect to assistant service');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "I am here to help you evaluate your Salesforce requirements. Would you like to schedule a quick 30-minute discovery call?",
        suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
        actionTrigger: data.actionTrigger || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now, but our team is available to review your requirements directly. Would you like to book a 30-minute discovery call or submit an inquiry?",
        suggestions: [
          "Schedule a discovery call with an architect",
          "What services do you offer?"
        ],
        actionTrigger: 'SCHEDULE_CALL',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Conversation reset. How can I assist with your Salesforce project or operational workflows?",
        suggestions: [
          "What's in the 4-week QuickStart?",
          "How do you audit an existing CRM?",
          "Schedule a discovery call with an architect"
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2.5 group border border-slate-700/60 focus-visible:outline-2 focus-visible:outline-slate-900"
          aria-label="Open solutions advisory chatbot"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-slate-900" />
          </div>
          <span className="hidden sm:inline font-display text-xs font-semibold uppercase tracking-wider">
            Ask Advisor AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
          role="dialog"
          aria-label="Corner Stone Solutions Advisory Chat"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-display font-bold flex items-center justify-center text-xs shadow-inner">
                CS
              </div>
              <div>
                <h3 className="text-sm font-display font-bold leading-tight flex items-center gap-1.5">
                  <span>Solutions Advisor</span>
                  <span className="text-[9px] uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-800/80 px-1.5 py-0.2 rounded font-mono">
                    AI
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 leading-none mt-0.5">
                  Direct answers on Salesforce SMB solutions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                title="Restart conversation"
                aria-label="Reset chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                aria-label="Close chat window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scope notice banner */}
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Specialized in Corner Stone Salesforce services</span>
            <span className="text-slate-400">Strictly relevant answers</span>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                      isAssistant
                        ? 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-sm'
                        : 'bg-slate-900 text-white rounded-tr-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Action Card triggered when user needs contact or Nonprofit guide */}
                    {(msg.actionTrigger === 'SCHEDULE_CALL' || msg.actionTrigger === 'NONPROFIT_GUIDE') && (
                      <div className="mt-3 pt-3 border-t border-slate-200 bg-white/70 p-3 rounded-lg border border-slate-200 text-slate-900 space-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
                          <Calendar className="w-3.5 h-3.5 text-blue-700" />
                          <span>Recommended Next Step:</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Speak directly with our Lead Certified Architect to review your exact requirements.
                        </p>
                        {(msg.actionTrigger === 'NONPROFIT_GUIDE' ||
                          msg.content.toLowerCase().includes('npsp') ||
                          msg.content.toLowerCase().includes('nonprofit cloud')) && (
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              onOpenNonprofitModal();
                            }}
                            className="w-full py-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded flex items-center justify-center gap-1.5"
                          >
                            <span>Open Nonprofit (NPSP &amp; NPC) Guide</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const isNp =
                              msg.content.toLowerCase().includes('npsp') ||
                              msg.content.toLowerCase().includes('nonprofit');
                            onOpenScheduler(
                              isNp ? 'Nonprofit Operations (NPSP & NPC)' : undefined,
                              `Inquiry from Chatbot: ${messages[messages.length - 2]?.content || 'CRM Discussion'}`
                            );
                          }}
                          className="w-full py-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <span>Schedule Free 30-Min Discovery</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>

                  {/* Suggested Prompts below assistant message */}
                  {isAssistant && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1.5 w-full max-w-[88%]">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Suggested Next Questions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(sug)}
                            className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/80 text-blue-900 border border-blue-200/60 transition-colors flex items-center gap-1"
                          >
                            <span>{sug}</span>
                            <ChevronRight className="w-3 h-3 text-blue-600 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 w-fit">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Checking solutions & architectural specs...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starters Row (if only welcome message) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 border-t border-slate-100 bg-slate-50/50 pt-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Popular Inquiries:
              </span>
              <div className="flex flex-wrap gap-1">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[10px] font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded px-2 py-1 text-left transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our QuickStart, audit, or flows..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-slate-900 shrink-0"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
