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
          {/* Removed backdrop blur to allow interacting with the page and remove blur effect */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-[100dvh] w-full sm:w-[420px] bg-white dark:bg-[#0a0a0a] z-50 flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.05)] dark:shadow-[-10px_0_40px_rgba(0,0,0,0.5)] border-l border-gray-100 dark:border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-white/5 shrink-0 z-10 relative shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
                  <Bot size={24} />
                </div>
                <div>
                  <h2 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    HizmetBul AI
                  </h2>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Çevrimiçi
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafa] dark:bg-[#050505]">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] rounded-3xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-rose-600 text-white rounded-br-sm shadow-rose-600/20' 
                      : 'bg-white dark:bg-[#111] text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-100 dark:border-white/5 font-medium'
                  }`}>
                    {msg.role === 'bot' && <Sparkles size={16} className="text-rose-500 mb-2 inline-block mr-2" />}
                    {msg.content}
                  </div>
                  
                  {/* Suggested Provider Card (If bot returns one) */}
                  {msg.suggestedProvider && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 max-w-[95%] self-start w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-2xl p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <img src={msg.suggestedProvider.avatarUrl} alt="" className="w-12 h-12 rounded-xl border border-gray-100 dark:border-white/10 object-cover bg-gray-50" />
                        <div>
                          <h4 className="font-black text-base text-gray-900 dark:text-white leading-tight mb-1">{msg.suggestedProvider.name}</h4>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{msg.suggestedProvider.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm mb-4 bg-gray-50 dark:bg-white/5 p-2.5 rounded-xl">
                        <span className="flex items-center gap-1.5 font-bold text-gray-700 dark:text-gray-300"><Star size={14} className="fill-amber-400 text-amber-400" /> {msg.suggestedProvider.rating}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
                        <span className="flex items-center gap-1.5 font-bold text-gray-700 dark:text-gray-300"><MapPin size={14} className="text-rose-500" /> {msg.suggestedProvider.district}</span>
                      </div>
                      <Link href={`/esnaf/${msg.suggestedProvider.slug}`} onClick={() => setIsOpen(false)} className="block w-full py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white text-center rounded-xl text-sm font-black transition-colors">
                        Profili İncele
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              ))}
              
              {loading && (
                <div className="flex items-start">
                  <div className="bg-white dark:bg-[#111] rounded-3xl rounded-tl-sm px-5 py-4 border border-gray-100 dark:border-white/5 flex gap-2 shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDuration: '1s' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1s' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '1s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 shrink-0 z-10 relative pb-safe">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Yapay zekaya bir şey sorun..."
                  className="w-full pl-6 pr-14 py-4 bg-gray-50 dark:bg-[#111] rounded-full border border-gray-200 dark:border-white/10 outline-none focus:border-rose-500 dark:focus:border-rose-500 focus:bg-white dark:focus:bg-black transition-all text-[15px] font-medium text-gray-900 dark:text-white placeholder:text-gray-400 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 p-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-gray-800 transition-colors shadow-md active:scale-95"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </form>
              <p className="text-center text-[11px] font-bold text-gray-400 mt-3 flex items-center justify-center gap-1">
                <Sparkles size={10} /> Yapay zeka yanlış veya eksik bilgi üretebilir.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
