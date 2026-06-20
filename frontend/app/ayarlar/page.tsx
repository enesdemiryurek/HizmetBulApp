'use client';
import { API_BASE_URL } from '@/config';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, Shield, Bell,
  Globe, ChevronRight, CheckCircle2, Save, X,
  Trash2, AlertTriangle, Sparkles, Truck, Wrench, Code2,
  GraduationCap, Camera, Car, Leaf, Briefcase, Search, Plus,
  Heart, Scissors, PawPrint, PartyPopper, Receipt, CreditCard,
  BarChart3, MousePointerClick, PhoneCall,
  MessageSquare, ExternalLink, Info, LogOut, MapPin, FileText, Zap
} from 'lucide-react';

import Link from 'next/link';
import PixarLoader from '@/components/PixarLoader';

import { ALL_CATEGORIES } from '@/lib/data';

type Section = 'performans' | 'hesap' | 'gizlilik' | 'bildirimler' | 'hizmetler' | 'faturalar';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  district?: string;
  address?: string;
  website?: string;
  role: 'hizmet_alan' | 'hizmet_veren';
  services?: string[];
  avatar?: string;
}

/* ── Toggle Switch Component ── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-all duration-300 focus:outline-none ${
        checked ? 'bg-rose-600 shadow-lg shadow-rose-500/30' : 'bg-zinc-200 dark:bg-zinc-700'
      }`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-md ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}

/* ── Premium Input Field ── */
function InputField({
  icon: Icon, label, type = 'text', value, onChange, placeholder, disabled, trailing
}: {
  icon?: React.ElementType;
  label: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  trailing?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className={`relative flex items-center rounded-2xl border transition-all duration-200 ${
        disabled
          ? 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 opacity-60'
          : focused
          ? 'border-rose-500 bg-white dark:bg-zinc-900 shadow-lg shadow-rose-500/10 ring-4 ring-rose-500/10'
          : 'border-zinc-200 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-600'
      }`}>
        {Icon && (
          <Icon size={15} className={`ml-4 shrink-0 transition-colors duration-200 ${focused ? 'text-rose-500' : 'text-zinc-400'}`} />
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent px-3 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none"
        />
        {trailing && <div className="mr-3 shrink-0">{trailing}</div>}
      </div>
    </div>
  );
}

/* ── Section Card ── */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function StatCard({
  label, value, icon: Icon, color
}: {
  label: string; value: number | string; icon: React.ElementType; color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider leading-tight max-w-[100px]">{label}</span>
        <div className={`p-2.5 rounded-2xl ${color}`}>
          <Icon size={17} />
        </div>
      </div>
      <div className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{value}</div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('hesap');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [accountForm, setAccountForm] = useState({
    name: '', email: '', phone: '', city: '', district: '', address: '', website: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', password: '', password_confirmation: '' });
  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { router.push('/giris-yap'); return; }

    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      const u = JSON.parse(cachedUser);
      setUser(u);
      setAccountForm({ name: u.name || '', email: u.email || '', phone: u.phone ?? '', city: u.city ?? '', district: u.district ?? '', address: u.address ?? '', website: u.website ?? '' });
      setSelectedServices(Array.isArray(u.services) ? u.services : []);
      setLoading(false);
    }

    fetch(`${API_BASE_URL}/api/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        const u = data.user ?? data;
        setUser(u);
        setAccountForm({ name: u.name || '', email: u.email || '', phone: u.phone || '', city: u.city || '', district: u.district || '', address: u.address || '', website: u.website || '' });
        setSelectedServices(Array.isArray(u.services) ? u.services : []);
        localStorage.setItem('user', JSON.stringify(u));
        if (u.role === 'hizmet_veren') setActiveSection('performans');
      })
      .catch(() => { if (!cachedUser) router.push('/giris-yap'); })
      .finally(() => setLoading(false));

    fetch(`${API_BASE_URL}/api/listings`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
      .then(r => r.json())
      .then(data => { if (data.listings?.length > 0) setSelectedListing(data.listings[0]); })
      .catch(console.error);
  }, [router]);



  useEffect(() => {
    if (activeSection === 'faturalar' && payments.length === 0) {
      setLoadingPayments(true);
      const token = localStorage.getItem('auth_token');
      fetch(`${API_BASE_URL}/api/user/payments`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      })
        .then(r => r.json())
        .then(data => setPayments(data.payments || []))
        .catch(() => showToast('Faturalar yüklenirken hata oluştu.', 'error'))
        .finally(() => setLoadingPayments(false));
    }
  }, [activeSection]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const saveAccount = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: accountForm.name, phone: accountForm.phone, city: accountForm.city, district: accountForm.district, address: accountForm.address, website: accountForm.website }),
      });
      if (res.ok) {
        const data = await res.json();
        const u = data.user ?? { ...user, ...accountForm };
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
        window.dispatchEvent(new Event('auth-change'));
        showToast('Hesap bilgileri güncellendi ✓');
      }
    } catch { showToast('Bağlantı hatası.', 'error'); }
    setSaving(false);
  };

  const updateAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const token = localStorage.getItem('auth_token');
    if (!token || !user) return;
    setSaving(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        const newAvatar = data.avatar_url || data.avatar || data.user?.avatar;
        const u: UserData = { ...user, avatar: newAvatar };
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
        window.dispatchEvent(new Event('auth-change'));
        showToast('Profil fotoğrafı güncellendi ✓');
      } else { showToast(`Hata: ${data.message || 'Fotoğraf yüklenemedi.'}`, 'error'); }
    } catch { showToast('Bağlantı hatası.', 'error'); }
    setSaving(false);
  };

  const savePassword = async () => {
    if (passForm.password !== passForm.password_confirmation) { showToast('Şifreler eşleşmiyor!', 'error'); return; }
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/password`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ current_password: passForm.current, password: passForm.password, password_confirmation: passForm.password_confirmation }),
      });
      const data = await res.json();
      if (res.ok) { showToast('Şifre güncellendi ✓'); setPassForm({ current: '', password: '', password_confirmation: '' }); }
      else { showToast(`Hata: ${data.message || data.errors?.current_password?.[0] || 'Şifre güncellenemedi.'}`, 'error'); }
    } catch { showToast('Bağlantı hatası.', 'error'); }
    setSaving(false);
  };

  const saveServices = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ services: selectedServices }),
      });
      if (res.ok) showToast('Hizmetler güncellendi ✓');
    } catch { }
    setSaving(false);
  };

  const toggleService = (name: string) => {
    setSelectedServices(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);
  };

  const filteredCats = searchTerm.trim()
    ? ALL_CATEGORIES.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.group.toLowerCase().includes(searchTerm.toLowerCase()))
    : ALL_CATEGORIES;

  if (loading) return (
    <div className="flex-1 flex flex-col pt-24 bg-zinc-50 dark:bg-zinc-950">
      <PixarLoader fullScreen={false} />
    </div>
  );
  if (!user) return null;

  const isProvider = user.role === 'hizmet_veren';

  const sideItems: { id: Section | 'profil'; icon: React.ElementType; label: string; href?: string; badge?: string }[] = [
    { id: 'hesap', icon: User, label: 'Hesap Bilgileri' },
    ...(isProvider ? [{ id: 'performans' as Section, icon: BarChart3, label: 'Performans' }] : []),
    { id: 'gizlilik', icon: Shield, label: 'Güvenlik & Şifre' },
    { id: 'bildirimler', icon: Bell, label: 'Bildirimler' },
    ...(isProvider ? [{ id: 'hizmetler' as Section, icon: Briefcase, label: 'Hizmetlerim' }] : []),
    { id: 'faturalar', icon: Receipt, label: 'Faturalar' },
  ];

  const pageVariants: import('framer-motion').Variants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
  };


  const avatarSrc = user.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE_URL}/storage/${user.avatar}`)
    : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] pt-20 pb-16">

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white border border-emerald-200 dark:border-emerald-800'
                : 'bg-white/90 dark:bg-zinc-900/90 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {toast.type === 'success'
              ? <CheckCircle2 size={17} className="text-emerald-500 shrink-0" />
              : <AlertTriangle size={17} className="text-rose-500 shrink-0" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Page Header ── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Ayarlar</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Hesabınızı ve tercihlerinizi yönetin</p>
        </motion.div>

        <div className="flex gap-6 items-start">
          {/* ── LEFT SIDEBAR ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden lg:flex flex-col w-72 shrink-0 gap-3"
          >
            {/* Profile Card */}
            <div className="bg-gradient-to-b from-[#1a0000] to-[#0d0000] rounded-3xl overflow-hidden shadow-2xl">
              {/* Cover */}
              <div className="h-20 bg-gradient-to-br from-rose-900 via-rose-700 to-red-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 60%)' }} />
              </div>
              <div className="px-5 pb-5 -mt-10">
                <label className="relative inline-block cursor-pointer group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-[#1a0000] bg-zinc-800 shadow-xl">
                    {avatarSrc
                      ? <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-white font-black text-3xl bg-gradient-to-br from-rose-600 to-red-700">{user.name.charAt(0).toUpperCase()}</div>
                    }
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-2xl">
                      <Camera size={18} className="text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-rose-600 rounded-lg flex items-center justify-center border-2 border-[#1a0000] shadow-lg">
                    <Plus size={12} strokeWidth={3} className="text-white" />
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={updateAvatar} />
                </label>
                <div className="mt-3">
                  <h2 className="font-black text-white text-base leading-tight">{user.name}</h2>
                  <p className="text-xs text-white/40 font-medium mt-0.5">{user.email}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-600/20">
                    {user.role === 'hizmet_veren' ? '⚡ Hizmet Veren' : '🔍 Hizmet Alan'}
                  </span>
                </div>
              </div>

              {/* Nav */}
              <nav className="px-3 pb-3">
                {sideItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as Section)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 text-sm font-semibold transition-all duration-200 group relative ${
                      activeSection === item.id
                        ? 'bg-white text-zinc-900 shadow-lg'
                        : 'text-white/50 hover:text-white hover:bg-white/6'
                    }`}
                  >
                    <item.icon
                      size={16}
                      className={`transition-colors duration-200 ${activeSection === item.id ? 'text-rose-600' : 'text-white/30 group-hover:text-white/70'}`}
                    />
                    <span>{item.label}</span>
                    {activeSection === item.id && (
                      <ChevronRight size={13} className="ml-auto text-rose-600" />
                    )}
                  </button>
                ))}

                <Link
                  href="/hizmet-sayfam"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 text-sm font-semibold text-white/50 hover:text-white hover:bg-white/6 transition-all duration-200 group"
                >
                  <ExternalLink size={16} className="text-white/30 group-hover:text-white/70 transition-colors" />
                  <span>Profilime Git</span>
                </Link>

                <div className="mt-2 pt-3 border-t border-white/8">
                  <button
                    onClick={() => { localStorage.removeItem('auth_token'); localStorage.removeItem('user'); router.push('/giris-yap'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                  >
                    <LogOut size={16} />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </nav>
            </div>
          </motion.aside>

          {/* ── RIGHT CONTENT ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile tab bar */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 lg:hidden scrollbar-hide">
              {sideItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as Section)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeSection === item.id
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">

              {/* ─── PERFORMANS ─── */}
              {activeSection === 'performans' && (
                <motion.div key="performans" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
                  {!selectedListing ? (
                    <Card className="p-10 flex flex-col items-center justify-center text-center border-dashed border-2">
                      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mb-6">
                        <BarChart3 size={32} className="text-rose-600" />
                      </div>
                      <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-3">Henüz bir ilanınız yok</h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
                        Müşterilerin sizi bulabilmesi ve performans istatistiklerinizi burada gerçek verilerle (görüntülenme, tıklama vb.) analiz edebilmeniz için hemen bir hizmet ilanı oluşturun.
                      </p>
                      <Link href="/hizmet-sayfam?ilan-ekle=1" className="flex items-center gap-2 px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/20 transition-all">
                        <Plus size={18} /> İlk İlanını Oluştur
                      </Link>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                      <StatCard label="Toplam Görüntülenme" value={selectedListing?.views || 0} icon={Eye} color="bg-rose-50 dark:bg-rose-950/30 text-rose-500" />
                      <StatCard label="İlan Tıklanması" value={selectedListing?.clicks || 0} icon={MousePointerClick} color="bg-orange-50 dark:bg-orange-950/30 text-orange-500" />
                      <StatCard label="Mesajlar" value={selectedListing?.message_clicks || 0} icon={MessageSquare} color="bg-violet-50 dark:bg-violet-950/30 text-violet-500" />
                      <StatCard label="Telefon Aramaları" value={selectedListing?.phone_clicks || 0} icon={PhoneCall} color="bg-amber-50 dark:bg-amber-950/30 text-amber-500" />
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── HESAP ─── */}
              {activeSection === 'hesap' && (
                <motion.div key="hesap" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
                  {/* Profile Header Card */}
                  <Card className="overflow-hidden">
                    <div className="h-28 bg-gradient-to-r from-rose-800 via-rose-600 to-red-400 relative">
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, white 0%, transparent 60%)' }} />
                    </div>
                    <div className="px-6 pb-6 -mt-12 flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                      <label className="relative group cursor-pointer shrink-0">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-zinc-900 bg-zinc-100 shadow-xl">
                          {avatarSrc
                            ? <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-white font-black text-3xl bg-gradient-to-br from-rose-500 to-red-600">{user.name.charAt(0)}</div>
                          }
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-2xl">
                            <Camera size={22} className="text-white" />
                          </div>
                        </div>
                        <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-rose-600 rounded-xl flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-lg">
                          <Plus size={13} strokeWidth={3} className="text-white" />
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={updateAvatar} />
                      </label>
                      <div className="pb-1">
                        <h2 className="text-xl font-black text-zinc-900 dark:text-white">{user.name}</h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{user.role === 'hizmet_veren' ? 'Hizmet Sağlayıcı' : 'Hizmet Alan'}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Personal Info */}
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={16} className="text-rose-600" />
                      <h3 className="font-black text-zinc-900 dark:text-white text-sm uppercase tracking-wider">Kişisel Bilgiler</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField icon={User} label="Ad Soyad" value={accountForm.name} onChange={v => setAccountForm({ ...accountForm, name: v })} placeholder="Ad Soyad" />
                      <InputField icon={Phone} label="Telefon" value={accountForm.phone} onChange={v => setAccountForm({ ...accountForm, phone: v })} placeholder="0555 123 4567" />
                      <InputField
                        icon={Mail} label="E-posta" value={accountForm.email} disabled
                        trailing={<span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg"><CheckCircle2 size={11} />Doğrulandı</span>}
                      />
                      <InputField icon={Globe} label="Web Sitesi" value={accountForm.website} onChange={v => setAccountForm({ ...accountForm, website: v })} placeholder="https://..." />
                    </div>
                  </Card>

                  {/* Location */}
                  <Card className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={16} className="text-rose-600" />
                      <h3 className="font-black text-zinc-900 dark:text-white text-sm uppercase tracking-wider">Konum</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Şehir" value={accountForm.city} onChange={v => setAccountForm({ ...accountForm, city: v })} placeholder="İstanbul" />
                      <InputField label="İlçe" value={accountForm.district} onChange={v => setAccountForm({ ...accountForm, district: v })} placeholder="Kadıköy" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Açık Adres</label>
                      <textarea
                        value={accountForm.address}
                        onChange={e => setAccountForm({ ...accountForm, address: e.target.value })}
                        rows={2}
                        placeholder="Tam adresinizi girin..."
                        className="w-full px-4 py-3 text-sm font-medium bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none resize-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white dark:focus:bg-zinc-900 transition-all"
                      />
                    </div>
                  </Card>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={saveAccount}
                      disabled={saving}
                      className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-br from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-sm font-bold rounded-2xl shadow-lg shadow-rose-500/30 transition-all disabled:opacity-60"
                    >
                      {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
                      Değişiklikleri Kaydet
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ─── GÜVENLİK ─── */}
              {activeSection === 'gizlilik' && (
                <motion.div key="gizlilik" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Lock size={16} className="text-rose-600" />
                      <h3 className="font-black text-zinc-900 dark:text-white text-sm uppercase tracking-wider">Şifre Değiştir</h3>
                    </div>
                    <InputField
                      icon={Lock} label="Mevcut Şifre" type={showPass ? 'text' : 'password'}
                      value={passForm.current} onChange={v => setPassForm({ ...passForm, current: v })} placeholder="••••••••"
                      trailing={
                        <button type="button" onClick={() => setShowPass(!showPass)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      }
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField icon={Lock} label="Yeni Şifre" type={showPass ? 'text' : 'password'} value={passForm.password} onChange={v => setPassForm({ ...passForm, password: v })} placeholder="En az 8 karakter" />
                      <InputField icon={Lock} label="Yeni Şifre Tekrar" type={showPass ? 'text' : 'password'} value={passForm.password_confirmation} onChange={v => setPassForm({ ...passForm, password_confirmation: v })} placeholder="Şifreyi tekrar gir" />
                    </div>
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                        onClick={savePassword} disabled={saving}
                        className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-br from-rose-600 to-red-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-rose-500/30 transition-all disabled:opacity-60"
                      >
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Shield size={15} />}
                        Şifreyi Güncelle
                      </motion.button>
                    </div>
                  </Card>

                  <Card className="p-6 border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-950/10">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
                        <AlertTriangle size={18} className="text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-zinc-900 dark:text-white mb-1 text-sm">Tehlikeli Bölge</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-4 leading-relaxed">Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.</p>
                        <button className="flex items-center gap-2 text-xs font-bold text-rose-600 border border-rose-200 dark:border-rose-800 px-4 py-2.5 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/30 transition-colors">
                          <Trash2 size={13} /> Hesabımı Kalıcı Sil
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ─── BİLDİRİMLER ─── */}
              {activeSection === 'bildirimler' && (
                <motion.div key="bildirimler" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <Card className="p-6 space-y-1">
                    <div className="flex items-center gap-2 mb-6">
                      <Bell size={16} className="text-rose-600" />
                      <h3 className="font-black text-zinc-900 dark:text-white text-sm uppercase tracking-wider">Bildirim Tercihleri</h3>
                    </div>
                    {[
                      { key: 'email' as const, icon: Mail, label: 'E-posta Bildirimleri', desc: 'Yeni mesaj ve güncellemeleri e-posta ile al' },
                      { key: 'sms' as const, icon: Phone, label: 'SMS Bildirimleri', desc: 'Önemli uyarıları SMS ile al' },
                      { key: 'push' as const, icon: Zap, label: 'Anlık Bildirimler', desc: 'Tarayıcı push bildirimlerini etkinleştir' },
                    ].map((item, i) => (
                      <div key={item.key} className={`flex items-center justify-between py-4 ${i < 2 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <item.icon size={16} className="text-zinc-500 dark:text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{item.label}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                        <Toggle checked={notifs[item.key]} onChange={v => setNotifs({ ...notifs, [item.key]: v })} />
                      </div>
                    ))}
                    <div className="flex justify-end pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                        onClick={() => showToast('Bildirim tercihleri kaydedildi ✓')}
                        className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-br from-rose-600 to-red-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-rose-500/30 transition-all"
                      >
                        <Save size={15} /> Tercihleri Kaydet
                      </motion.button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ─── HİZMETLER ─── */}
              {activeSection === 'hizmetler' && isProvider && (
                <motion.div key="hizmetler" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase size={16} className="text-rose-600" />
                      <h3 className="font-black text-zinc-900 dark:text-white text-sm uppercase tracking-wider">Hizmetlerimi Yönet</h3>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">Verdiğiniz hizmetleri aşağıdan güncelleyebilirsiniz.</p>

                    <div className="relative">
                      <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Hizmet ara..."
                        className="w-full pl-10 pr-10 py-3 text-sm font-medium bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:bg-white dark:focus:bg-zinc-900 transition-all"
                      />
                      {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto">
                      {filteredCats.map(cat => {
                        const active = selectedServices.includes(cat.name);
                        return (
                          <motion.button
                            key={cat.id}
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleService(cat.name)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                              active
                                ? 'bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-500/20'
                                : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-rose-300 hover:text-rose-600'
                            }`}
                          >
                            <cat.icon size={11} />
                            {cat.name}
                            {active && <X size={9} className="ml-0.5" />}
                          </motion.button>
                        );
                      })}
                    </div>

                    {selectedServices.length > 0 && (
                      <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl">
                        <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2.5">✓ {selectedServices.length} hizmet seçildi</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedServices.map(s => (
                            <span key={s} className="flex items-center gap-1 text-xs bg-rose-600 text-white px-2.5 py-1 rounded-lg font-semibold">
                              {s}
                              <button type="button" onClick={() => toggleService(s)}><X size={9} /></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                        onClick={saveServices} disabled={saving}
                        className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-br from-rose-600 to-red-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-rose-500/30 transition-all disabled:opacity-60"
                      >
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
                        Hizmetleri Kaydet
                      </motion.button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ─── FATURALAR ─── */}
              {activeSection === 'faturalar' && (
                <motion.div key="faturalar" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Receipt size={16} className="text-rose-600" />
                      <h3 className="font-black text-zinc-900 dark:text-white text-sm uppercase tracking-wider">Faturalar & Ödemeler</h3>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">Platform üzerinden aldığınız sponsorluk ödemeleri ve faturalarınız.</p>

                    {loadingPayments ? (
                      <div className="py-16 flex justify-center">
                        <div className="w-7 h-7 border-2 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
                      </div>
                    ) : payments.length === 0 ? (
                      <div className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Receipt size={24} className="text-zinc-400" />
                        </div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">Henüz fatura bulunamadı</p>
                        <p className="text-xs text-zinc-500 mt-1">Geçmişe dönük bir ödemeniz bulunmamaktadır.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {payments.map((p, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:border-rose-200 dark:hover:border-rose-900/50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center shrink-0">
                                <CreditCard size={15} className="text-rose-600" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{p.package_name}</h4>
                                <p className="text-xs text-zinc-500 mb-0.5">{p.listing?.title || 'Bilinmeyen İlan'}</p>
                                <p className="text-[10px] text-zinc-400">
                                  {new Date(p.created_at).toLocaleDateString('tr-TR')} · Fatura #INV-{p.id.toString().padStart(6, '0')}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 sm:mt-0 flex items-center gap-3 sm:flex-col sm:items-end">
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                                ✓ Ödendi
                              </span>
                              <span className="font-black text-zinc-900 dark:text-white text-base">{Number(p.amount).toFixed(2)} ₺</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
