'use client';
import { API_BASE_URL } from '@/config';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, Star, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AiSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string, suggestedProvider?: any}[]>([
    { role: 'bot', content: 'Merhaba! Ben HizmetBul AI Asistan. Size nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !isOpen);
    window.addEventListener('toggleAiSidebar', handleToggle);
    return () => window.removeEventListener('toggleAiSidebar', handleToggle);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'bot', content: data.message, suggestedProvider: data.suggested_provider }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Üzgünüm, şu an bağlantı kuramıyorum. Lütfen daha sonra tekrar deneyin.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* We do NOT close on backdrop click, it just exists to blur or darken slightly if we want. But the user asked for "doesn't close when clicked outside" */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 pointer-events-none"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#fdfaf9] dark:bg-[#0a0a0a] z-50 flex flex-col shadow-2xl border-l border-gray-200 dark:border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-white dark:bg-[#111] border-b border-gray-100 dark:border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                  <Bot size={22} />
                </div>
                <div>
                  <h2 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                    HizmetBul AI
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Çevrimiçi
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium ${
                    msg.role === 'user' 
                      ? 'bg-rose-600 text-white rounded-tr-sm shadow-md shadow-rose-600/20' 
                      : 'bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-white/5 shadow-sm'
                  }`}>
                    {msg.role === 'bot' && <Sparkles size={14} className="text-rose-500 mb-1.5 inline-block mr-1.5" />}
                    {msg.content}
                  </div>
                  
                  {/* Suggested Provider Card (If bot returns one) */}
                  {msg.suggestedProvider && (
                    <div className="mt-3 max-w-[90%] self-start w-full bg-white dark:bg-[#111] border-[2px] border-gray-950 dark:border-white/20 rounded-xl p-3 shadow-[4px_4px_0_0_rgba(3,7,18,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0_0_rgba(3,7,18,1)] transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={msg.suggestedProvider.avatarUrl} alt="" className="w-10 h-10 rounded-full border-2 border-gray-950 dark:border-white/20 object-cover" />
                        <div>
                          <h4 className="font-black text-sm text-gray-900 dark:text-white leading-tight">{msg.suggestedProvider.name}</h4>
                          <p className="text-[10px] font-bold text-gray-500">{msg.suggestedProvider.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs mb-3">
                        <span className="flex items-center gap-1 font-bold text-gray-600 dark:text-gray-300"><Star size={12} className="fill-amber-400 text-amber-400" /> {msg.suggestedProvider.rating}</span>
                        <span className="flex items-center gap-1 font-bold text-gray-600 dark:text-gray-300"><MapPin size={12} className="text-rose-500" /> {msg.suggestedProvider.district}</span>
                      </div>
                      <Link href={`/esnaf/${msg.suggestedProvider.slug}`} onClick={() => setIsOpen(false)} className="block w-full py-2 bg-gray-950 dark:bg-white text-white dark:text-gray-950 text-center rounded-lg text-xs font-black uppercase tracking-wider">
                        Profili İncele
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex items-start">
                  <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100 dark:border-white/5 flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-[#111] border-t border-gray-100 dark:border-white/5 shrink-0">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Yapay zekaya bir şey sorun..."
                  className="w-full pl-5 pr-12 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border-2 border-gray-200 dark:border-white/10 outline-none focus:border-rose-500 dark:focus:border-rose-500 focus:bg-white transition-all text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 transition-colors"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </form>
              <p className="text-center text-[10px] font-bold text-gray-400 mt-2">
                Yapay zeka yanlış veya eksik bilgi üretebilir.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
