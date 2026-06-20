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
    const token = localStorage.getItem('auth_token');
    if (storedUser && token) {
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

  // Don't show sidebar on auth pages
  if (pathname === '/giris-yap' || pathname === '/kayit-ol') return null;

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/giris-yap';
  };

  const isLoggedIn = !!userRole;

  const menuItems = [
    { label: 'Hizmet Bul', icon: Compass, href: '/arama' },
    ...(isLoggedIn 
      ? [
          { label: 'Hizmet Sayfam', icon: Briefcase, href: userRole === 'hizmet_veren' ? '/hizmet-sayfam' : '/hizmet-alan' },
          { label: 'Mesajlar', icon: MessageCircle, href: '/mesajlar', badge: 'Yeni' },
          { label: 'Ayarlar', icon: Settings, href: '/ayarlar' }
        ]
      : [
          { label: 'Hizmet Alan', icon: Home, href: '/hizmet-alan' },
          { label: 'Hizmet Veren', icon: Briefcase, href: '/hizmet-veren' }
        ]
    ),
    { label: 'AI Asistan', icon: Bot, href: '#', onClick: () => { window.dispatchEvent(new CustomEvent('toggleAiSidebar')); setIsExpanded(false); } }
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
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer"
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
                onClick={(e) => {
                  setMobileOpen(false);
                  if (item.onClick) item.onClick(e);
                }}
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

          {/* Auth Buttons */}
          {mounted && isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className={`flex items-center justify-center px-3 py-3.5 bg-white/5 hover:bg-rose-600 border border-white/10 hover:border-rose-500 text-white rounded-2xl transition-all duration-300 w-full overflow-hidden group`}
            >
              <LogOut size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
              <span className={`ml-3 font-bold text-sm transition-all duration-300 ${(isExpanded || mobileOpen) ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                Çıkış Yap
              </span>
            </button>
          ) : mounted ? (
            <div className={`flex flex-col gap-2 transition-all duration-300 ${(isExpanded || mobileOpen) ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
              <Link 
                href="/giris-yap"
                className="flex items-center justify-center px-3 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl transition-all duration-300 w-full font-bold text-sm"
              >
                Giriş Yap
              </Link>
              <Link 
                href="/kayit-ol"
                className="flex items-center justify-center px-3 py-3 bg-white hover:bg-rose-50 text-rose-600 rounded-xl transition-all duration-300 w-full font-black text-sm shadow-md"
              >
                Ücretsiz Üye Ol
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
