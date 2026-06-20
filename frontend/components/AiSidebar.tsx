'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Star, MapPin, Search, Paperclip, Mic, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AiSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, suggestedProviders?: any[]}[]>([
    { role: 'assistant', content: 'Merhaba! Ben HizmetBul AI. Size nasıl yardımcı olabilirim?' }
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

  const handleSend = async (e?: React.FormEvent, text?: string) => {
    e?.preventDefault();
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput('');
    const newMessages = [...messages, { role: 'user', content: userText } as const];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply, suggestedProviders: data.suggestedProviders }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.error || 'Bir hata oluştu.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Üzgünüm, şu an bağlantı kuramıyorum. Lütfen daha sonra tekrar deneyin.' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = [
    { text: "Web Tasarımcı Bul", icon: Search, color: "bg-blue-50 text-blue-600" },
    { text: "Temizlik Fiyatları", icon: Sparkles, color: "bg-emerald-50 text-emerald-600" },
    { text: "En İyi Boyacı", icon: Star, color: "bg-amber-50 text-amber-600" },
    { text: "Nakliye Lazım", icon: MapPin, color: "bg-purple-50 text-purple-600" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 md:bottom-6 right-0 md:right-6 w-full md:w-[420px] h-[85vh] md:h-[700px] max-h-[90vh] bg-[#fdfdfd] dark:bg-[#0a0a0a] md:rounded-[2rem] rounded-t-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/10 z-[100] flex flex-col overflow-hidden"
          >
            {/* Premium Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-white dark:bg-[#0a0a0a] z-20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center shadow-lg shadow-rose-600/30">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#0a0a0a] rounded-full" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-lg tracking-tight leading-none">HizmetBul AI</h3>
                  <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Asistan • Çevrimiçi</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-2xl transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-[#fdfdfd] dark:bg-[#0a0a0a]">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {msg.role === 'assistant' && idx > 0 && (
                    <div className="flex items-center gap-2 mb-1.5 ml-1">
                      <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
                        <Sparkles size={10} className="text-rose-600" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-400">HizmetBul AI</span>
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] rounded-[1.5rem] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-black dark:bg-white text-white dark:text-black rounded-br-md shadow-lg shadow-black/10' 
                      : 'bg-white dark:bg-[#111] text-gray-800 dark:text-gray-200 rounded-tl-md border border-gray-100 dark:border-white/5 font-medium [&_a]:text-rose-600 [&_a]:font-bold [&_a:hover]:underline'
                  }`}>
                    <span dangerouslySetInnerHTML={{ 
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
                        .replace(/\n/g, '<br/>')
                    }} />
                  </div>
                  
                  {/* Cards for suggested providers */}
                  {msg.suggestedProviders && msg.suggestedProviders.length > 0 && (
                    <div className="mt-4 flex flex-col gap-3 w-full pl-2 pr-4">
                      {msg.suggestedProviders.map((provider: any, pIdx: number) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: pIdx * 0.1 }}
                          key={pIdx}
                          className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center font-black text-rose-600 text-lg border border-gray-100 dark:border-white/10 shrink-0">
                                {provider.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-black text-sm text-gray-900 dark:text-white leading-tight">{provider.name}</h4>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{provider.level || 'Uzman'}</div>
                              </div>
                            </div>
                            {provider.rating > 0 && (
                              <div className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 px-2 py-1 rounded-lg flex items-center gap-1 font-black text-xs">
                                <Star size={12} className="fill-amber-500 text-amber-500" />
                                {provider.rating}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 pt-3 border-t border-gray-50 dark:border-white/5 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1.5"><MapPin size={12} /> {provider.district || 'Merkez'}</div>
                            <div className="flex items-center gap-1.5"><Star size={12} /> {provider.reviewCount || 0} Yorum</div>
                            {provider.avgPricePaid && <div className="flex items-center gap-1.5 ml-auto text-rose-600">~{provider.avgPricePaid}</div>}
                          </div>
                          
                          <Link href={`/esnaf/${provider.slug}`} onClick={() => setIsOpen(false)} className="mt-4 block w-full py-2.5 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white text-center rounded-[1rem] text-xs font-black transition-colors">
                            Profili İncele
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {messages.length === 1 && !loading && (
                <div className="mt-6 mb-2">
                  <div className="grid grid-cols-2 gap-3 pl-1 pr-4">
                    {quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(undefined, reply.text)}
                        className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 hover:shadow-lg hover:-translate-y-1 rounded-[1.5rem] transition-all text-center group"
                      >
                        <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center ${reply.color}`}>
                          <reply.icon size={18} />
                        </div>
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 group-hover:text-rose-600 transition-colors">
                          {reply.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {loading && (
                <div className="flex items-start">
                  <div className="bg-white dark:bg-[#111] rounded-[1.5rem] rounded-tl-sm px-5 py-4 border border-gray-100 dark:border-white/5 flex gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDuration: '1s' }} />
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1s' }} />
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '1s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#fdfdfd] dark:bg-[#0a0a0a] shrink-0 z-10 relative pb-safe">
              <form onSubmit={handleSend} className="relative flex items-center">
                <div className="absolute left-2 flex items-center gap-1">
                  <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors">
                    <Paperclip size={18} />
                  </button>
                </div>
                
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full pl-12 pr-24 py-4 bg-white dark:bg-[#111] rounded-[2rem] border border-gray-200 dark:border-white/10 outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-all text-[14px] font-medium text-gray-900 dark:text-white placeholder:text-gray-400 shadow-sm"
                />
                
                <div className="absolute right-2 flex items-center gap-1">
                  <button type="button" className="p-2 text-gray-400 hover:text-rose-600 transition-colors">
                    <Mic size={18} />
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-gray-800 transition-all shadow-md active:scale-95"
                  >
                    <Send size={16} className="ml-0.5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
