'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Home, MessageCircle, Bot, Moon, LogOut, Send, X, Compass, Briefcase, Settings
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserRole(JSON.parse(storedUser).role);
    }

    const handleToggle = () => setMobileOpen(prev => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  // Determine active item based on current path
  let activeMenu = 'Profilim';
  if (pathname.startsWith('/mesajlar')) activeMenu = 'Mesajlar';
  if (pathname === '/arama') activeMenu = 'Hizmet Bul';
  if (pathname === '/ayarlar') activeMenu = 'Ayarlar';
  if (pathname === '/hizmet-veren' || pathname === '/hizmet-alan') activeMenu = 'Hizmet Sayfam';
  if (aiOpen) activeMenu = 'AI Asistan';

  // AI Chat States
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Merhaba! Ben HizmetBul AI Asistan. Size nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (aiOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, aiOpen]);

  // Don't show sidebar on auth pages
  if (pathname === '/giris-yap' || pathname === '/kayit-ol') return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) })
      });

      const data = await res.json();
      
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Üzgünüm, bir hata: ' + (data.error || 'Bilinmeyen Hata') }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Bağlantı hatası oluştu.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/giris-yap';
  };

  const menuItems = [
    { label: 'Hizmet Bul', icon: Compass, href: '/arama' },
    { label: 'Hizmet Sayfam', icon: Briefcase, href: '/hizmet-sayfam' },
    { label: 'Mesajlar', icon: MessageCircle, href: '/mesajlar', badge: 'Yeni' },
    { label: 'Ayarlar', icon: Settings, href: '/ayarlar' },
    { label: 'AI Asistan', icon: Bot, href: '#', onClick: () => { setAiOpen(true); setIsExpanded(false); } }
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Area - Red/Black Gradient Design */}
      <div 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`fixed left-0 top-0 bottom-0 bg-gradient-to-b from-rose-600 via-rose-950 to-[#0a0a0a] border-r border-white/5 z-50 flex-col py-6 transition-all duration-300 ease-in-out
          ${mobileOpen ? 'flex translate-x-0 w-[260px]' : 'hidden md:flex md:translate-x-0'}
          ${!mobileOpen && !isExpanded ? 'md:w-[80px]' : 'md:w-[260px]'}`}
        style={{ boxShadow: (isExpanded || mobileOpen) ? '10px 0 40px rgba(225,29,72,0.1)' : 'none' }}
      >
        {/* Logo Section */}
        <div className="flex items-center px-6 mb-10 overflow-hidden shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg shadow-rose-500/30 flex items-center justify-center shrink-0">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <div className={`ml-4 whitespace-nowrap font-black text-xl text-white transition-opacity duration-300 ${(isExpanded || mobileOpen) ? 'opacity-100' : 'opacity-0'}`}>
            Hizmet<span className="text-rose-400">Bul</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-4 space-y-3 overflow-x-hidden overflow-y-auto scrollbar-none">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={item.onClick}
                className={`flex items-center px-3 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-rose-600/20 to-rose-600/5 border border-rose-500/20 text-rose-400 font-bold shadow-[0_0_15px_rgba(225,29,72,0.1)]' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white font-medium border border-transparent'
                }`}
              >
                <div className="shrink-0 flex items-center justify-center relative">
                  <item.icon size={22} className={`${isActive ? 'text-rose-400 fill-rose-500/20' : 'group-hover:scale-110 transition-transform'}`} />
                  {/* Badge dot for collapsed state */}
                  {item.badge && (!isExpanded && !mobileOpen) && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#1a0004]" />
                  )}
                </div>
                
                <div className={`ml-4 whitespace-nowrap transition-all duration-300 flex-1 flex items-center justify-between ${(isExpanded || mobileOpen) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0'}`}>
                  {item.label}
                  {item.badge && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm shadow-rose-500/50">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Bottom Section */}
        <div className="px-4 mt-auto shrink-0 flex flex-col gap-4">
          
          {/* Dark Mode Toggle */}
          {mounted && (
            <div className={`flex items-center px-3 py-2 text-white/60 whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 overflow-hidden'}`}>
              <Moon size={20} className="shrink-0" />
              <span className="ml-4 flex-1 text-sm font-medium">Dark Mode</span>
              
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`relative w-10 h-5 rounded-full transition-colors flex items-center ${theme === 'dark' ? 'bg-rose-500' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform absolute top-0.5 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          )}

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className={`flex items-center justify-center px-3 py-3.5 bg-white/5 hover:bg-rose-600 border border-white/10 hover:border-rose-500 text-white rounded-2xl transition-all duration-300 w-full overflow-hidden group`}
          >
            <LogOut size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
            <span className={`ml-3 font-bold text-sm transition-all duration-300 ${(isExpanded || mobileOpen) ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              Çıkış Yap
            </span>
          </button>
        </div>
      </div>

      {/* AI Chat Drawer Overlay */}
      <AnimatePresence>
        {aiOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-white dark:bg-[#111] shadow-2xl border-l border-gray-200 dark:border-white/10 z-50 flex flex-col"
            >
              {/* Header */}
              <div className="h-16 px-6 bg-white dark:bg-[#111] border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <Bot size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white font-celinda">HizmetBul AI</div>
                    <div className="text-xs text-emerald-500 flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Çevrimiçi
                    </div>
                  </div>
                </div>
                <button onClick={() => setAiOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-[#0a0a0a]">
                {messages.map((msg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-rose-600 text-white rounded-br-sm' 
                          : 'bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-bl-sm [&_a]:text-rose-500 [&_a]:font-bold [&_a:hover]:underline'
                      }`}
                      dangerouslySetInnerHTML={{ 
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
                          .replace(/\n/g, '<br/>')
                      }}
                    />
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-[#111] border-t border-gray-100 dark:border-white/5 shrink-0">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Yapay zekaya bir şey sorun..."
                    className="w-full bg-gray-100 dark:bg-[#1a1a1a] border border-transparent focus:border-rose-300 dark:focus:border-rose-500/50 rounded-full pl-5 pr-14 py-3.5 text-sm outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1.5 w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white disabled:opacity-50 disabled:bg-gray-300 transition-colors shadow-sm active:scale-95"
                  >
                    <Send size={16} className="ml-0.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
