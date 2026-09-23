import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Bot, User, Send, Paperclip, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const AIHealthAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Health Assistant. I can help you understand medical reports, find hospitals, and explain health concepts. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchParams] = useSearchParams();

  const [conversationId, setConversationId] = useState<number | null>(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setInput(q);
      // Auto-submit if coming from dashboard search
      setTimeout(() => {
        const form = document.getElementById('ai-chat-form') as HTMLFormElement;
        if (form) form.requestSubmit();
      }, 100);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const { sendChatMessage } = await import('../services/aiApi');
      const response = await sendChatMessage(currentInput, conversationId || undefined);
      
      const { message, conversation_id } = response.data;
      setMessages(prev => [...prev, { role: 'assistant', content: message.content }]);
      if (conversation_id) setConversationId(conversation_id);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      
      // Fallback for Demo Mode or API failure
      const isDemoMode = localStorage.getItem('token')?.startsWith('demo_mode_token_');
      if (isDemoMode || !err.response) {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `Based on the symptoms you've described, it is possible you are experiencing a common clinical condition, though many diseases share overlapping presentations. For example, symptoms such as fever and cough frequently indicate a respiratory infection, whereas persistent fatigue or headaches could relate to systemic inflammation, stress, or dehydration.\n\nPlease note: While I can provide general health information, I cannot formally diagnose your condition. I highly recommend consulting a qualified healthcare professional for a precise clinical evaluation.`
          }]);
          setLoading(false);
        }, 1200);
        return;
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the backend. Please try again.' }]);
      setLoading(false);
    }
  };

  const suggestions = [
    "Explain my latest report",
    "Find nearby hospitals",
    "What does HbA1c mean?",
    "Compare my reports"
  ];

  return (
    <div className={`mx-auto flex flex-col animate-in fade-in duration-500 transition-all ${isExpanded ? 'fixed top-4 bottom-4 right-4 left-4 md:left-[17rem] z-50 bg-dark-bg p-4 md:p-6 rounded-2xl border border-white/10 shadow-2xl' : 'max-w-4xl h-[calc(100vh-10rem)]'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-primary-500/10 p-3 rounded-2xl border border-primary-500/20 shadow-glow">
            <Bot className="text-primary-400 h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-50 mb-1">AI Health Assistant</h1>
            <p className="text-slate-400 text-sm">Powered by MediSphere Intelligence</p>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 bg-dark-surface border border-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center justify-center shadow-sm"
          title={isExpanded ? "Minimize" : "Maximize"}
        >
          {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>



      <Card className="flex-1 flex flex-col min-h-0 !bg-dark-surface/50">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center shrink-0 border border-primary-500/20 shadow-sm">
                  <Bot size={16} className="text-primary-400"/>
                </div>
              )}
              <div className={`p-4 text-sm leading-relaxed max-w-[85%] shadow-sm ${
                m.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-2xl rounded-tr-sm shadow-glow' 
                  : 'bg-dark-surface border border-white/5 text-slate-200 rounded-2xl rounded-tl-sm'
              }`}>
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20 shadow-sm">
                  <User size={16} className="text-slate-300"/>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center shrink-0 border border-primary-500/20 shadow-sm">
                <Bot size={16} className="text-primary-400"/>
              </div>
              <div className="p-4 bg-dark-surface border border-white/5 rounded-2xl rounded-tl-sm text-slate-400 text-sm shadow-sm flex items-center gap-2">
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                </span>
                Analyzing...
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/5 bg-dark-surface rounded-b-2xl flex-shrink-0">
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 custom-scrollbar">
            {suggestions.map(s => (
              <button 
                key={s} 
                onClick={() => setInput(s)} 
                className="whitespace-nowrap text-xs bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 px-4 py-2 rounded-full transition-all focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {s}
              </button>
            ))}
          </div>
          <form id="ai-chat-form" onSubmit={handleSubmit} className="flex gap-2 relative items-center">
            <button type="button" className="p-2.5 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-xl border border-white/5">
              <Paperclip size={20} />
            </button>
            <div className="flex-1 relative">
              <textarea 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const form = document.getElementById('ai-chat-form') as HTMLFormElement;
                    if (form) form.requestSubmit();
                  }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3.5 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:bg-white/10 outline-none transition-all text-sm text-slate-50 placeholder:text-slate-500 resize-y min-h-[52px] max-h-[250px] custom-scrollbar"
                placeholder="Ask a healthcare question... (Shift+Enter for new line)"
                rows={1}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading} 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 disabled:opacity-50 transition-colors shadow-lg shadow-primary-900/20"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};