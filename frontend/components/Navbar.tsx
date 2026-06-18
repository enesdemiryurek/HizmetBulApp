'use client';
import { API_BASE_URL } from '@/config';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, ChevronDown, Menu, Zap, User, LogOut,
  Settings, Briefcase, MessageCircle,
  Sparkles, Truck, Wrench, Code2, GraduationCap, Camera, Leaf,
  Heart, Scissors, PawPrint, PartyPopper, Car, X
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

/* ── Curated category groups (cleaned, no duplicates/nonsense) ── */
const MEGA_MENU: {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  items: string[];
}[] = [
  {
    name: 'Temizlik',
    icon: Sparkles,
    color: 'text-sky-400',
    items: [
      'Ev Temizliği', 'Ofis Temizliği', 'Apartman Temizliği', 'Dükkan Temizliği',
      'İnşaat Sonrası Temizlik', 'Boş Ev Temizliği', 'Taşınma Öncesi Temizlik',
      'Buharlı Ev Temizliği', 'Koltuk Yıkama', 'Halı Yıkama', 'Yatak Yıkama',
      'Cam Silme', 'Mermer Cilalama', 'Petek Temizliği', 'Su Deposu Temizliği',
      'İlaçlama', 'Böcek İlaçlama', 'Haşere İlaçlama', 'Fare İlaçlama',
      'Kuru Temizleme', 'Bilgisayar Temizliği',
    ],
  },
  {
    name: 'Nakliyat',
    icon: Truck,
    color: 'text-orange-400',
    items: [
      'Evden Eve Nakliyat', 'Asansörlü Nakliyat', 'Şehirler Arası Eşya Taşıma',
      'Ofis Taşıma', 'Parça Eşya Taşıma', 'Ev Eşyası Depolama', 'Eşya Depolama',
      'Kamyonet Nakliye', 'Kamyonet Kiralama', 'Hamal', 'Kurye', 'Moto Kurye',
      'Havaalanı Transfer', 'VIP Transfer', 'Özel Şoför', 'Taksi', 'Çöp Taşıma',
      'Araç Taşıma', 'Oto Çekici', 'Çeyiz Taşıma',
    ],
  },
  {
    name: 'Tamirat & İnşaat',
    icon: Wrench,
    color: 'text-yellow-400',
    items: [
      'Elektrikçi', 'Elektrik Tesisatı', 'Su Tesisatçısı', 'Boya Badana',
      'Kombi Servisi', 'Klima Servisi', 'Beyaz Eşya Servisi', 'Çilingir',
      'Mobilya Montajı', 'Fayans & Seramik Döşeme', 'Banyo Tadilat',
      'Alçıpan', 'Asma Tavan', 'Cam Balkon', 'Çatı Yapımı & Tamiri',
      'Güvenlik Kamerası Montajı', 'Bilgisayar Tamiri', 'Telefon & Ekran Değişimi',
      'Çamaşır Makinesi Tamiri', 'Buzdolabı Servisi', 'Bulaşık Makinesi Tamiri',
      'IKEA Montaj', 'Duşakabin Montaj & Tamiri', 'Anahtar Teslim Tadilat',
    ],
  },
  {
    name: 'Yazılım & Tasarım',
    icon: Code2,
    color: 'text-purple-400',
    items: [
      'Web Tasarım', 'Mobil Uygulama Geliştirme', 'E-Ticaret Danışmanlığı',
      'UI/UX Tasarım', 'Logo Tasarımı', 'Kurumsal Kimlik Tasarımı', 'Grafik Tasarım',
      'SEO Hizmeti', 'Google Ads & Reklam Yönetimi', 'Sosyal Medya Yönetimi',
      'Sosyal Medya Reklamları', 'Instagram Reklam Yönetimi', 'İçerik Yazarlığı',
      'Kartvizit Tasarım & Baskı', 'Broşür & Katalog Tasarımı', 'Tabela & Kutu Harf',
      '3D Modelleme', 'Video Kurgu & Montaj', 'Yeminli Tercüme', 'İngilizce Çeviri',
    ],
  },
  {
    name: 'Özel Ders',
    icon: GraduationCap,
    color: 'text-green-400',
    items: [
      'Matematik Özel Ders', 'İngilizce Özel Ders', 'Almanca Özel Ders',
      'YKS / LGS Hazırlık', 'Lise Matematik Özel Ders', 'İlkokul Özel Ders',
      'Fizik Özel Ders', 'Kimya Özel Ders', 'Direksiyon Dersi', 'Gitar Dersi',
      'Piyano Dersi', 'Bağlama Dersi', 'Keman Dersi', 'Dans Dersi',
      'Yüzme Dersi', 'Futbol Özel Ders', 'Pilates & Yoga Dersi', 'Diksiyon Dersi',
      'KPSS Hazırlık', 'Eğitim Koçu',
    ],
  },
  {
    name: 'Fotoğrafçılık',
    icon: Camera,
    color: 'text-pink-400',
    items: [
      'Düğün Fotoğrafçılığı', 'Nişan Fotoğrafçısı', 'Ürün Fotoğraf Çekimi',
      'Portre Fotoğrafçılığı', 'Doğum Günü Fotoğrafçısı', 'Dış Çekim Fotoğraf',
      'Drone Çekimi', 'Tanıtım Filmi Çekimi', 'Video Kurgu', 'Video Çekimi',
      'Instagram İçin Fotoğraf Çekimi', 'E-Ticaret Fotoğraf Çekimi',
      'Sosyal Medya Video Çekimi', 'Düğün Video Çekimi',
    ],
  },
  {
    name: 'Araç & Oto',
    icon: Car,
    color: 'text-blue-400',
    items: [
      'Araç Kiralama', 'Oto Ekspertiz', 'Oto Kuaför & Detaylı Temizlik',
      'Oto Boya & Kaporta', 'Pasta Cila & Seramik Kaplama', 'Oto Elektrik & Akü',
    ],
  },
  {
    name: 'Bahçe & Peyzaj',
    icon: Leaf,
    color: 'text-emerald-400',
    items: [
      'Bahçe Bakımı', 'Peyzaj Tasarımı', 'Çim Biçme', 'Çim Halı', 'Çit',
    ],
  },
  {
    name: 'Sağlık & Yaşam',
    icon: Heart,
    color: 'text-rose-400',
    items: [
      'Kişisel Spor Antrenörü', 'Diyetisyen', 'Psikolog & Psikolojik Danışman',
      'Çift ve Aile Terapisi', 'Çocuk Psikoloğu', 'Evde Fizik Tedavi',
      'Fizyoterapist', 'Yaşam Koçu', 'Online Psikolog', 'Reformer Pilates',
      'Manuel Terapi', 'Ergoterapi', 'Evde Hemşire', 'Çocuk Bakımı',
    ],
  },
  {
    name: 'Güzellik & Bakım',
    icon: Scissors,
    color: 'text-fuchsia-400',
    items: [
      'Kuaför & Berber', 'Makyaj & Cilt Bakımı', 'Gelin Saçı & Makyajı',
      'Protez Tırnak & Kalıcı Oje', 'Epilasyon', 'Dövme & Tattoo', 'Masaj Terapisi',
    ],
  },
  {
    name: 'Evcil Hayvan',
    icon: PawPrint,
    color: 'text-amber-400',
    items: [
      'Evcil Hayvan Bakımı', 'Köpek Gezdirme', 'Pet Kuaförü', 'Köpek Eğitimi',
      'Kedi / Köpek Oteli', 'Kedi Bakımı', 'Köpek Pansiyonu',
    ],
  },
  {
    name: 'Organizasyon',
    icon: PartyPopper,
    color: 'text-red-400',
    items: [
      'Düğün Organizasyonu', 'Catering & Özel Aşçı', 'Doğum Günü Organizasyonu',
      'Nişan & Söz Organizasyonu', 'Ses & Işık Sistemi Kiralama',
      'Palyaço & Animatör', 'Gelin Arabası Kiralama',
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  /* Mega menu */
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const megaRef = useRef<HTMLDivElement>(null);

  /* Search */
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  /* Flat all items for search */
  const allItems = useMemo(() =>
    MEGA_MENU.flatMap(g => g.items.map(name => ({ name, group: g.name }))),
    []
  );

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return allItems.filter(c => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [searchQuery, allItems]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/arama?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); setSearchFocus(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    router.push(`/arama?q=${encodeURIComponent(name)}`);
    setSearchQuery(''); setSearchFocus(false);
  };

  useEffect(() => {
    setIsClient(true);
    const loadUser = () => {
      const s = localStorage.getItem('user');
      const t = localStorage.getItem('auth_token');
      setUser(s && t ? JSON.parse(s) : null);
    };
    loadUser();
    window.addEventListener('auth-change', loadUser);
    return () => window.removeEventListener('auth-change', loadUser);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
      } catch {}
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocus(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (pathname === '/giris-yap' || pathname === '/kayit-ol') return null;

  const activeGroup = MEGA_MENU[activeIdx];

  return (
    <>
      <div className="fixed top-3 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none">
        <header className="max-w-[1200px] mx-auto bg-[#9a0002]/95 backdrop-blur-xl shadow-2xl shadow-black/20 rounded-2xl pointer-events-auto border border-white/10">
          <div className="px-4 h-14 flex items-center gap-2">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0 mr-1 group">
            <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center border border-white/25 group-hover:bg-white/25 transition-colors">
              <Zap size={14} className="text-white fill-white" />
            </div>
            <span className="font-black text-lg tracking-tight font-celinda text-white">
              Hizmet<span className="text-white">Bul</span>
            </span>
          </Link>

          {/* ── Tüm Hizmetler mega trigger ── */}
          <div 
            ref={megaRef} 
            className="relative hidden md:block shrink-0"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <Link
              href="/arama"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                megaOpen ? 'bg-white/20 text-white' : 'text-white/85 hover:text-white hover:bg-white/15'
              }`}
            >
              Tüm Hizmetler
              <ChevronDown size={14} className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
            </Link>

            {/* ── MEGA MENU ── */}
            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 top-full mt-2 flex rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 z-50"
                  style={{ width: 680, maxHeight: 500 }}
                >
                  {/* Left — group list */}
                  <div className="w-48 bg-[#8a0002] border-r border-white/10 py-2 overflow-y-auto shrink-0">
                    {MEGA_MENU.map((g, idx) => {
                      const Icon = g.icon;
                      const active = idx === activeIdx;
                      return (
                        <button
                          key={g.name}
                          onMouseEnter={() => setActiveIdx(idx)}
                          onClick={() => {
                            router.push(`/arama?q=${encodeURIComponent(g.name)}`);
                            setMegaOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-all ${
                            active
                              ? 'bg-white/20 text-white font-bold'
                              : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                          }`}
                        >
                          <Icon size={13} className={active ? 'text-white drop-shadow-md' : 'text-white/60'} />
                          <span className="text-xs leading-tight">{g.name}</span>
                          {active && <div className="ml-auto w-1 h-3.5 rounded-full bg-white shrink-0 shadow-sm" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right — subcategories */}
                  <div className="flex-1 bg-[#9a0002] p-4 overflow-y-auto">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3 border-b border-white/20 pb-2">
                      <div className="flex items-center gap-2">
                        <activeGroup.icon size={15} className="text-white drop-shadow-sm" />
                        <span className="text-sm font-black text-white">{activeGroup.name}</span>
                        <span className="text-[10px] text-white/80 font-medium bg-white/10 px-2 py-0.5 rounded-md">{activeGroup.items.length} hizmet</span>
                      </div>
                      <Link
                        href={`/arama?q=${encodeURIComponent(activeGroup.name)}`}
                        onClick={() => setMegaOpen(false)}
                        className="text-[11px] font-bold text-white hover:text-white/80 hover:underline transition-colors"
                      >
                        Tümünü Gör →
                      </Link>
                    </div>

                    {/* Items grid */}
                    <div className="grid grid-cols-2 gap-1">
                      {activeGroup.items.map(item => (
                        <Link
                          key={item}
                          href={`/arama?q=${encodeURIComponent(item)}`}
                          onClick={() => setMegaOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] font-medium text-white hover:bg-white/20 transition-all group shadow-sm hover:shadow"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white/50 group-hover:bg-white transition-colors shrink-0 shadow-sm" />
                          {item}
                        </Link>
                      ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <Link
                        href="/arama"
                        onClick={() => setMegaOpen(false)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#9a0002] hover:bg-gray-100 rounded-lg text-xs font-black shadow-md transition-all active:scale-95"
                      >
                        <Search size={12} className="text-[#9a0002]" />
                        Tüm İlanlara Gözat
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Nav links ── */}
          <nav className="hidden md:flex items-center gap-0.5 shrink-0">
            {[
              { label: 'Hizmet Alan', href: '/hizmet-alan' },
              { label: 'Hizmet Veren', href: '/hizmet-veren' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  pathname === link.href ? 'bg-white/20 text-white' : 'text-white/75 hover:text-white hover:bg-white/12'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Search bar ── */}
          <div ref={searchRef} className="flex-1 mx-3 max-w-sm hidden md:block relative min-w-0">
            <form onSubmit={handleSearch}>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                searchFocus
                  ? 'bg-white border-white/50 shadow-lg'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}>
                <Search size={14} className={`shrink-0 transition-colors ${searchFocus ? 'text-rose-600' : 'text-white/50'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocus(true)}
                  placeholder="Hizmet ara... (Temizlik, Web...)"
                  className={`flex-1 text-sm bg-transparent outline-none min-w-0 ${
                    searchFocus ? 'text-gray-900 placeholder:text-gray-400' : 'text-white placeholder:text-white/40'
                  }`}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')}>
                    <X size={12} className={searchFocus ? 'text-gray-400' : 'text-white/40'} />
                  </button>
                )}
              </div>
            </form>

            {/* Suggestions */}
            <AnimatePresence>
              {searchFocus && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.13 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  {searchSuggestions.length > 0 ? (
                    <div className="py-1.5">
                      {searchSuggestions.map(s => (
                        <button
                          key={s.name}
                          onClick={() => handleSuggestionClick(s.name)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
                        >
                          <Search size={12} className="text-gray-300 shrink-0" />
                          <span className="text-sm text-gray-800 font-medium flex-1 truncate">{s.name}</span>
                          <span className="text-[10px] text-gray-400 shrink-0">{s.group}</span>
                        </button>
                      ))}
                      <div className="border-t border-gray-50 px-4 py-2">
                        <button
                          onClick={() => { router.push(`/arama?q=${encodeURIComponent(searchQuery)}`); setSearchQuery(''); setSearchFocus(false); }}
                          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
                        >
                          <Search size={11} />
                          "{searchQuery}" için tüm sonuçlar →
                        </button>
                      </div>
                    </div>
                  ) : searchQuery.length === 0 ? (
                    <div className="p-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Popüler</p>
                      {['Ev Temizliği', 'Elektrikçi', 'Web Tasarım', 'Evden Eve Nakliyat', 'Kombi Servisi', 'Özel Ders'].map(item => (
                        <button key={item} onClick={() => handleSuggestionClick(item)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-left transition-colors">
                          <Search size={12} className="text-gray-300" />
                          <span className="text-sm text-gray-700 font-medium">{item}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right actions ── */}
          <div className="hidden md:flex items-center gap-1 ml-auto shrink-0">
            <ThemeToggle />

            {isClient && user ? (
              <NotificationDropdown />
            ) : (
              <button className="p-2 rounded-xl text-white/65 hover:text-white hover:bg-white/12 transition-colors">
                <Bell size={17} />
              </button>
            )}

            {isClient && user && (
              <Link href="/mesajlar" className="p-2 rounded-xl text-white/65 hover:text-white hover:bg-white/12 transition-colors">
                <MessageCircle size={17} />
              </Link>
            )}

            {isClient && user ? (
              <UserDropdown user={user} onLogout={handleLogout} />
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link href="/giris-yap" className="px-3 py-2 text-sm font-bold text-white/80 hover:text-white hover:bg-white/12 rounded-xl transition-all">
                  Giriş Yap
                </Link>
                <Link href="/kayit-ol" className="px-4 py-2 text-sm font-black bg-white text-rose-700 rounded-xl hover:bg-gray-50 transition-all active:scale-95 shadow-md shadow-black/20">
                  Üye Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <button
            onClick={() => window.dispatchEvent(new Event('toggle-sidebar'))}
            className="md:hidden ml-auto p-2 rounded-xl text-white hover:bg-white/15 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
        </header>
      </div>
    </>
  );
}

/* ── User Dropdown ── */
function UserDropdown({ user, onLogout }: { user: { name: string; email: string; role: string }; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const initials = user.name.charAt(0).toUpperCase();
  const isProvider = user.role === 'hizmet_veren';
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/12 transition-all">
        <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-xs text-white">{initials}</div>
        <span className="text-sm font-semibold max-w-[70px] truncate text-white">{user.name.split(' ')[0]}</span>
        <ChevronDown size={12} className={`text-white/60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-[#1c0202] rounded-2xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden z-50"
          >
            <div className="px-4 py-3 bg-gradient-to-r from-rose-900/40 to-rose-800/20 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-500/30 border border-rose-500/30 flex items-center justify-center text-rose-200 font-bold text-sm">{initials}</div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-white/40 truncate">{isProvider ? '🏆 Hizmet Veren' : '👤 Hizmet Alan'}</p>
                </div>
              </div>
            </div>
            <div className="py-2 px-1">
              {[
                { href: '/profil', icon: User, label: 'Profilim' },
                { href: isProvider ? '/hizmet-sayfam' : '/hizmet-alan', icon: Briefcase, label: isProvider ? 'Hizmet Sayfam' : 'Hizmet Bul' },
                { href: '/ayarlar', icon: Settings, label: 'Ayarlar' },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/8 transition-colors font-medium">
                  <item.icon size={14} className="text-white/30" />{item.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-white/8 p-1">
              <button onClick={() => { setOpen(false); onLogout(); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors font-semibold">
                <LogOut size={14} />Çıkış Yap
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Notification Dropdown ── */
function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const fetchN = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
      const data = await res.json();
      if (data.notifications) setNotifications(data.notifications);
    } catch {}
  };
  useEffect(() => { fetchN(); const i = setInterval(fetchN, 10000); return () => clearInterval(i); }, []);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const markRead = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try { await fetch(`${API_BASE_URL}/api/notifications/read-all`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); setNotifications(p => p.map(n => ({ ...n, read_at: new Date().toISOString() }))); } catch {}
  };
  const unread = notifications.filter(n => !n.read_at).length;
  return (
    <div ref={ref} className="relative">
      <button onClick={() => { setOpen(v => !v); if (!open && unread > 0) markRead(); }} className="relative p-2 rounded-xl text-white/65 hover:text-white hover:bg-white/12 transition-colors">
        <Bell size={17} />
        {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse border border-rose-800" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 bg-[#1c0202] rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Bildirimler</h3>
              {unread > 0 && <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full">{unread} Yeni</span>}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0
                ? <div className="p-6 text-center text-sm text-white/30">Bildiriminiz yok.</div>
                : notifications.map((n, i) => (
                  <div key={i} className={`p-4 border-b border-white/5 last:border-0 ${!n.read_at ? 'bg-white/4' : ''}`}>
                    <div className="text-sm font-medium text-white/80">{n.data.message || 'Yeni bildirim'}</div>
                    <div className="text-[10px] text-white/30 mt-1">{new Date(n.created_at).toLocaleString('tr-TR')}</div>
                  </div>
                ))
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
