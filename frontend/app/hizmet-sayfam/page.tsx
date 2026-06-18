'use client';
import { API_BASE_URL } from '@/config';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin, CheckCircle2, Star, Clock, Heart, MessageSquare, 
  Settings, LogOut, ChevronRight, Edit3, Plus, ArrowLeft, ChevronDown, BarChart3, TrendingUp, Eye, MousePointerClick, PhoneCall, Link as LinkIcon, Camera, X, Trash2, Megaphone, Sparkles, Users,
  Shield, Phone, Briefcase
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import ListingFormModal from '@/components/ListingFormModal';
import PaymentModal from '@/components/PaymentModal';
import PixarLoader from '@/components/PixarLoader';

const API = `${API_BASE_URL}/api`;

interface UserData {
  id: number; name: string; email: string; phone?: string;
  role: string; services?: string[]; avatar?: string;
  city?: string; district?: string; bio?: string; created_at?: string;
}
interface ListingData {
  id: number; service: string; sub_services?: string[]; title: string; description: string;
  process?: string; cover_image?: string; portfolio_images?: string[];
  price_range?: string; experience?: string; city?: string;
  district?: string; tags?: string[]; created_at?: string;
  rating?: number; reviewCount?: number; reviews?: any[];
  views?: number; clicks?: number; message_clicks?: number; phone_clicks?: number;
  is_promoted?: boolean; promoted_until?: string;
}

export default function HizmetSayfamPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<ListingData | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<ListingData | null>(null);
  
  const [timeFilter, setTimeFilter] = useState('Son 1 Ay');
  const [isChartOpen, setIsChartOpen] = useState(false);

  const generateChartData = (filter: string) => {
    const baseViews = selectedListing?.views ?? 50;
    const baseClicks = selectedListing?.clicks ?? 2;
    // Güvenli createdAt parse işlemi
    let createdAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (selectedListing?.created_at) {
      const parsed = new Date(selectedListing.created_at.replace(' ', 'T'));
      if (!isNaN(parsed.getTime())) createdAt = parsed;
    }
    const now = new Date();
    
    // X ekseninde gösterilecek noktaları belirle
    const points: { name: string; date: Date; Gösterim?: number; Tıklanma?: number }[] = [];
    
    if (filter === 'Son 1 Gün') {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 2 * 60 * 60 * 1000);
        points.push({ name: `${d.getHours()}:00`, date: d });
      }
    } else if (filter === 'Son 1 Hafta') {
      const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        points.push({ name: days[d.getDay()], date: d });
      }
    } else if (filter === 'Son 1 Ay') {
      // Tam 30 günü 10 noktada özetle (son nokta bugün)
      for (let i = 9; i >= 0; i--) {
        const d = new Date(now.getTime() - Math.floor(i * 3) * 24 * 60 * 60 * 1000);
        points.push({ name: `${d.getDate()} ${d.toLocaleString('tr-TR', { month: 'short' })}`, date: d });
      }
    } else {
      const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        points.push({ name: months[d.getMonth()], date: d });
      }
    }

    // Geçerli (hesap açılışından sonraki) noktaları bul
    const validPoints = points.map(p => {
      // Aylık grafikte yıla/aya bak, diğerlerinde tam tarihe
      let isValid = false;
      if (filter === 'Son 1 Yıl') {
        isValid = p.date.getFullYear() > createdAt.getFullYear() || 
                 (p.date.getFullYear() === createdAt.getFullYear() && p.date.getMonth() >= createdAt.getMonth());
      } else {
        isValid = p.date.getTime() >= (createdAt.getTime() - 24*60*60*1000); // 1 gün tolerans
      }
      return { ...p, isValid, Gösterim: 0, Tıklanma: 0 };
    });

    const activePoints = validPoints.filter(p => p.isValid);

    // Toplam izlenme ve tıklanmayı SADECE aktif noktalara rastgele AMA tam toplamı tutacak şekilde dağıt
    if (activePoints.length > 0) {
      let remainingViews = baseViews;
      let remainingClicks = baseClicks;

      // Rasgele dağıtım
      for (let i = 0; i < activePoints.length - 1; i++) {
        // Kalanın ortalaması civarında bir değer
        const avgV = remainingViews / (activePoints.length - i);
        const takeV = Math.min(remainingViews, Math.floor(Math.random() * (avgV * 1.5)));
        activePoints[i].Gösterim = takeV;
        remainingViews -= takeV;

        const avgC = remainingClicks / (activePoints.length - i);
        const takeC = Math.min(remainingClicks, Math.random() > 0.5 ? Math.ceil(avgC) : 0);
        activePoints[i].Tıklanma = takeC;
        remainingClicks -= takeC;
      }
      
      // Son noktaya (bugün) kalanı ekle
      activePoints[activePoints.length - 1].Gösterim += remainingViews;
      activePoints[activePoints.length - 1].Tıklanma += remainingClicks;
    }

    // Eğer hiç aktif nokta yoksa (çok yeni hesap ve 1 yıl seçilmiş vs) bugüne hepsini yığ
    if (activePoints.length === 0 && points.length > 0) {
      points[points.length - 1].Gösterim = baseViews;
      points[points.length - 1].Tıklanma = baseClicks;
    }

    return validPoints.map(p => ({
      name: p.name,
      Gösterim: p.Gösterim,
      Tıklanma: p.Tıklanma
    }));
  };

  const chartData = generateChartData(timeFilter);

  const fetchListings = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    fetch(`${API}/listings`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
      .then(r => r.json())
      .then(listingData => {
        setListings(listingData.listings ?? []);
        if (listingData.listings?.length > 0) {
          // If we had a selected listing, try to keep it selected
          if (selectedListing) {
            const fresh = listingData.listings.find((l: ListingData) => l.id === selectedListing.id);
            if (fresh) setSelectedListing(fresh);
            else setSelectedListing(listingData.listings[0]);
          } else {
            setSelectedListing(listingData.listings[0]);
          }
        }
        localStorage.setItem('cached_listings', JSON.stringify(listingData.listings ?? []));
      })
      .catch(e => console.warn("Failed to fetch listings."));
  };

  const handleCancelPromotion = async (listingId: number) => {
    if (!confirm('Sponsorluğunuzu iptal etmek istediğinize emin misiniz? Kalan süreniz silinecektir.')) return;
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`${API}/listings/${listingId}/cancel-promotion`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
      if (res.ok) {
        fetchListings();
      } else {
        alert('İptal işlemi başarısız oldu.');
      }
    } catch (e) {
      alert('Bir hata oluştu.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { router.push('/giris-yap'); return; }

    // Hızlı gösterim için (kökten çözüm)
    const cachedUser = localStorage.getItem('cached_user');
    const cachedListings = localStorage.getItem('cached_listings');
    if (cachedUser && cachedListings) {
      setUser(JSON.parse(cachedUser));
      const parsedListings = JSON.parse(cachedListings);
      setListings(parsedListings);
      if (parsedListings.length > 0) setSelectedListing(parsedListings[0]);
      setLoading(false);
    }

    Promise.all([
      fetch(`${API}/user`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }).then(r => r.json()),
      fetch(`${API}/listings`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }).then(r => r.json()),
    ])
      .then(([userData, listingData]) => {
        const u = userData.user ?? userData;
        setUser(u);
        setListings(listingData.listings ?? []);
        if (listingData.listings?.length > 0) {
          if (!selectedListing) {
            setSelectedListing(listingData.listings[0]);
          } else {
            // Update selectedListing with fresh data
            const freshListing = listingData.listings.find((l: ListingData) => l.id === selectedListing.id);
            if (freshListing) setSelectedListing(freshListing);
          }
        }
        
        // Cache'i güncelle
        localStorage.setItem('cached_user', JSON.stringify(u));
        localStorage.setItem('cached_listings', JSON.stringify(listingData.listings ?? []));
      })
      .catch(() => router.push('/giris-yap'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex-1 flex flex-col pt-16">
      <PixarLoader fullScreen={false} />
    </div>
  );
  if (!user) return null;

  const avatarUrl = user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE_URL}/storage/${user.avatar}`) : null;
  const allPortfolio = listings.flatMap(l => l.portfolio_images ?? []);
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' }) : '—';

  /* ─────────────────── NO LISTINGS → full onboarding page ─────────────────── */
  if (listings.length === 0) {
    return (
      <>
        {isModalOpen && (
          <ListingFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={null}
            onSave={fetchListings}
          />
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap');
          .onboard-page { font-family: var(--font-noto), 'Noto Serif', serif; }
        `}</style>

        <div className="onboard-page min-h-screen bg-[#efe6dd] dark:bg-[#050505] pt-20 pb-20 overflow-hidden">

          {/* ── Hero ── */}
          <div className="relative max-w-4xl mx-auto px-6 text-center py-16">
            {/* Decorative orbs */}
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.18, 0.32, 0.18] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#9a0002] rounded-full blur-[120px] pointer-events-none" />
            <motion.div animate={{ scale: [1.15, 1, 1.15], opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute top-10 right-0 w-72 h-72 bg-rose-400 rounded-full blur-[100px] pointer-events-none" />

            {/* Avatar badge */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-white/80 dark:bg-white/10 backdrop-blur-md border border-[#9a0002]/20 dark:border-white/15 rounded-full px-4 py-2 mb-8 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#9a0002] to-[#6b0001] flex items-center justify-center text-white text-xs font-black shrink-0 overflow-hidden">
                {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Merhaba, {user.name.split(' ')[0]} 👋</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }}
              className="relative text-5xl sm:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-5">
              Müşterilerine ulaşmaya{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#9a0002]">hazır mısın?</span>
                <motion.span animate={{ scaleX: [0, 1] }} transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
                  className="absolute bottom-2 left-0 right-0 h-3 bg-[#9a0002]/15 rounded-full origin-left" />
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
              className="text-gray-500 dark:text-gray-400 text-xl font-medium max-w-2xl mx-auto mb-10">
              Hizmetini platforma ekle, seni arayan kişiler doğrudan seninle iletişime geçsin.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(154,0,2,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#9a0002] to-[#c40003] text-white font-black text-lg px-10 py-4 rounded-2xl shadow-xl shadow-[#9a0002]/30 cursor-pointer"
            >
              <Plus size={22} />
              İlanımı Oluştur
            </motion.button>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
              className="text-sm text-gray-400 dark:text-gray-600 mt-5 font-bold">
              Ücretsiz · Hemen aktif · Komisyon yok
            </motion.p>
          </div>

          {/* ── Feature Cards ── */}
          <div className="max-w-4xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
              {[
                { icon: '💸', title: '%0 Komisyon', desc: 'Ne kazanırsan senin! Senden hiçbir ücret veya komisyon almıyoruz.', highlight: true },
                { icon: '⚡', title: 'Anında Aktif', desc: 'İlanın oluşturulur oluşturulmaz aramada görünür.' },
                { icon: '📊', title: 'Analitik Takibi', desc: 'Kaç kişi gördü, tıkladı, mesaj attı — hepsini izle.' },
                { icon: '💬', title: 'Direkt İletişim', desc: 'Müşteri aracısız, doğrudan seninle iletişim kurar.' },
              ].map((feat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.09, duration: 0.5 }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    whileHover={{ y: -4, scale: feat.highlight ? 1.05 : 1.02, boxShadow: feat.highlight ? '0 20px 40px rgba(154,0,2,0.4)' : '0 16px 40px rgba(154,0,2,0.12)', transition: { duration: 0.2 } }}
                    className={`relative overflow-hidden rounded-2xl p-5 text-left h-full ${
                      feat.highlight 
                        ? 'bg-gradient-to-br from-[#9a0002] to-[#c40003] text-white shadow-lg shadow-[#9a0002]/30 border border-red-500/30' 
                        : 'bg-white dark:bg-[#111] border border-[#9a0002]/15 dark:border-white/8'
                    }`}
                  >
                    {feat.highlight && (
                      <motion.div 
                        animate={{ left: ['-100%', '200%'] }} 
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />
                    )}
                    <div className="relative z-10">
                      <div className="text-4xl mb-4 drop-shadow-md">{feat.icon}</div>
                      <h3 className={`font-black text-base mb-1.5 ${feat.highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        {feat.title}
                      </h3>
                      <p className={`text-sm leading-relaxed font-medium ${feat.highlight ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* ── How it works steps ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
              className="bg-white dark:bg-[#111] border border-[#9a0002]/15 dark:border-white/8 rounded-3xl p-8 mb-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 text-center">Nasıl çalışır?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                  { step: '01', title: 'İlanını Oluştur', desc: 'Verdiğin hizmeti, fiyat aralığını ve şehrini belirt.' },
                  { step: '02', title: 'Müşteri Seni Bulur', desc: 'Arama yapan kişiler ilanını görür ve seninle iletişime geçer.' },
                  { step: '03', title: 'İşini Büyüt', desc: 'Yorum al, profilini güçlendir, daha fazla müşteriye ulaş.' },
                ].map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.85 + i * 0.12 }}
                    className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9a0002] to-[#6b0001] flex items-center justify-center text-white font-black text-base shrink-0 shadow-lg shadow-[#9a0002]/25">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 dark:text-white text-lg mb-1">{s.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Bottom CTA ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
              className="relative overflow-hidden bg-gradient-to-br from-[#6b0001] via-[#9a0002] to-[#c40003] rounded-3xl p-8 text-center">
              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.12, 0.25, 0.12] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }}
                className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-300/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-5 shadow-xl">
                  <Briefcase size={30} className="text-white" />
                </motion.div>
                <h2 className="text-2xl font-black text-white mb-2">Hemen başla!</h2>
                <p className="text-white/70 text-sm font-medium mb-7 max-w-xs mx-auto">
                  İlk ilanını oluşturmak yalnızca birkaç dakika sürer.
                </p>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 16px 40px rgba(0,0,0,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2.5 bg-white text-[#9a0002] font-black text-base px-8 py-3.5 rounded-xl shadow-lg cursor-pointer"
                >
                  <Plus size={20} />
                  İlanımı Oluştur
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }
  /* ─────────────────── end of no-listings page ─────────────────── */

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap');
        .hizmet-sayfam { font-family: var(--font-noto), 'Noto Serif', serif; }
        .cover-bg { background: linear-gradient(145deg, #2b0000 0%, #4a0001 30%, #7d0001 60%, #9a0002 85%, #c40003 100%); }
        .glass { background: rgba(255,255,255,.9); backdrop-filter: blur(20px); }
        .dark .glass { background: rgba(17,17,17,.9); }
        .tab-btn { padding:.5rem 1.25rem; border-radius:9999px; font-size:.875rem; font-weight:700; cursor:pointer; transition:all .2s; border:none; background:transparent; color:#6b7280; }
        .dark .tab-btn { color:#9ca3af; }
        .tab-btn.active { background:linear-gradient(135deg,#e11d48,#be123c); color:#fff; box-shadow:0 3px 12px rgba(225,29,72,.3); }
        .listing-item { padding:1rem; border-radius:1rem; cursor:pointer; transition:all .2s; border:1.5px solid #f0f0f0; }
        .dark .listing-item { border-color:rgba(255,255,255,.07); }
        .listing-item:hover { border-color:#e11d48; background:rgba(225,29,72,.03); }
        .listing-item.active { border-color:#e11d48; background:linear-gradient(135deg,rgba(225,29,72,.06),rgba(190,18,60,.04)); }
        .card { background: #ffffff; border: 1.5px solid #9a0002; border-radius: 1.5rem; padding: 1.5rem; box-shadow: 0 4px 12px rgba(154,0,2,0.08); transition: all .3s ease; }
        .card:hover { box-shadow: 0 10px 25px rgba(154,0,2,0.12); }
        .dark .card { background:#111; border-color:rgba(255,255,255,.07); }
      `}</style>

      <div className="hizmet-sayfam min-h-screen bg-[#efe6dd] dark:bg-[#050505]">
        {/* Cover */}
        <div className="relative h-64 cover-bg overflow-hidden">
          {selectedListing?.cover_image && (
            <img src={selectedListing.cover_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          <div className="absolute top-4 left-4">
            <Link href="/profil" className="flex items-center gap-2 bg-black/30 backdrop-blur-sm text-white text-sm font-bold px-3 py-2 rounded-xl hover:bg-black/50 transition-colors">
              <ArrowLeft size={15} /> Profilime Dön
            </Link>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            {selectedListing ? (
              <button onClick={() => { setEditingListing(selectedListing); setIsModalOpen(true); }} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-bold px-3 py-2 rounded-xl hover:bg-white/20 transition-colors">
                <Edit3 size={14} /> Düzenle
              </button>
            ) : (
              <button onClick={() => { setEditingListing(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-[#9a0002] backdrop-blur-sm border border-[#c40003] text-white text-sm font-bold px-3 py-2 rounded-xl hover:bg-[#c40003] transition-colors shadow-lg shadow-[#9a0002]/30">
                <Plus size={16} /> Yeni İlan Ekle
              </button>
            )}
          </div>
        </div>

        {isModalOpen && (
          <ListingFormModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            initialData={editingListing} 
            onSave={fetchListings} 
          />
        )}

        {isPaymentModalOpen && selectedListing && (
          <PaymentModal 
            isOpen={isPaymentModalOpen} 
            onClose={() => setIsPaymentModalOpen(false)} 
            listingId={selectedListing.id} 
            onSuccess={fetchListings} 
          />
        )}

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT — Profile card */}
            <div className="lg:col-span-1 space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bento-item premium-glow p-6">
                {/* Avatar */}
                <div className="flex flex-col items-center text-center mb-5">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-[#111] shadow-xl bg-gradient-to-br from-[#9a0002] to-[#4a0001] flex items-center justify-center text-3xl font-black text-white mb-3">
                    {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                  </div>
                  <h1 className="text-xl font-black text-gray-900 dark:text-white">{user.name}</h1>
                  {listings[0] && <p className="text-[#9a0002] dark:text-rose-400 text-sm font-bold mt-0.5">{listings[0].title}</p>}
                  {(user.city || user.district) && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                      <MapPin size={11} className="text-rose-500" />
                      {[user.district, user.city].filter(Boolean).join(', ')}
                    </div>
                  )}
                  {listings.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Users size={11} className="text-rose-400" /> {listings.length} hizmet ilanı
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <Shield size={12} className="text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Doğrulanmış Üye</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { v: listings.length.toString(), l: 'İlan' },
                    { v: selectedListing && selectedListing.rating !== undefined && selectedListing.rating > 0 ? selectedListing.rating.toFixed(1) : 'Yeni', l: 'Puan' },
                    { v: selectedListing?.reviewCount?.toString() ?? '0', l: 'Yorum' },
                  ].map(s => (
                    <div key={s.l} className="text-center py-2 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <div className="font-black text-gray-900 dark:text-white text-base">{s.v}</div>
                      <div className="text-gray-400 text-xs">{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {user.phone && (
                  <a href={`tel:${user.phone}`} className="w-full flex items-center justify-center gap-2 bg-[#9a0002] hover:bg-[#c40003] text-white font-black py-3 px-4 rounded-xl transition-all shadow-lg shadow-[#9a0002]/20">
                    <Phone size={16} /> {user.phone}
                  </a>
                )}

                <div className="mt-3 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                  {[
                    '✓ Komisyon yok, direkt iletişim',
                    '✓ Doğrulanmış hizmet veren',
                    '✓ Teklif beklemenize gerek yok',
                  ].map(item => <p key={item} className="flex items-center gap-1.5">{item}</p>)}
                </div>

                {/* Info box */}
                <div className="mt-4 bg-gray-900 dark:bg-black rounded-xl p-4">
                  <h3 className="text-white text-xs font-black mb-3">Hızlı Bilgi</h3>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Üyelik', value: joinDate },
                      { label: 'İlan Sayısı', value: listings.length.toString() },
                      { label: 'Durum', value: 'Aktif' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">{item.label}</span>
                        <span className="text-white text-xs font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Hakkında Section (Moved to left sidebar) */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card flex flex-col">
                <h2 className="font-black text-gray-900 dark:text-white text-lg mb-3">Hakkında</h2>
                <p className="text-gray-600 dark:text-white/70 leading-relaxed text-sm">
                  {user.bio || listings[0]?.description || 'Henüz hakkında bilgisi eklenmemiş.'}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {listings.flatMap(l => l.sub_services?.length ? l.sub_services : [l.service]).filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 p-2 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
                      <Briefcase className="text-rose-500 shrink-0" size={12} />
                      <span className="text-[10px] font-bold text-gray-900 dark:text-white truncate" title={s}>{s}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Portföy Section (Moved to left sidebar) */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card flex flex-col">
                <h2 className="font-black text-gray-900 dark:text-white text-lg mb-3">Portföy</h2>
                {allPortfolio.length === 0 ? (
                  <div className="text-center py-6 flex-1 flex flex-col justify-center border-2 border-dashed border-gray-100 dark:border-white/10 rounded-2xl">
                    <Camera className="mx-auto text-gray-300 dark:text-gray-700 mb-2" size={24} />
                    <p className="text-gray-400 text-xs font-medium">Fotoğraf eklenmemiş</p>
                    <Link href="/profil" className="text-rose-500 text-[10px] font-bold hover:underline mt-1 inline-block">Ekle →</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {allPortfolio.slice(0, 6).map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ring-1 ring-black/5" onClick={() => setSelectedPortfolio(img)}>
                        <img src={img.startsWith('http') ? img : `${API_BASE_URL}/storage/${img}`} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* RIGHT — Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Listings Section */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="space-y-4">

                      {/* Selected listing detail */}
                      {selectedListing && (
                        <div className="bento-item premium-glow p-6">
                          {selectedListing.cover_image && (
                            <div className="relative h-48 rounded-xl overflow-hidden mb-4 -mx-1.5">
                              <img src={selectedListing.cover_image} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                              <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                                {selectedListing.service}
                              </span>
                            </div>
                          )}
                          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">{selectedListing.title}</h2>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {selectedListing.sub_services && selectedListing.sub_services.length > 0 ? (
                              selectedListing.sub_services.map(sub => (
                                <span key={sub} className="text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-md font-bold">{sub}</span>
                              ))
                            ) : (
                              <span className="text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-md font-bold">{selectedListing.service}</span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {(selectedListing.city || selectedListing.district) && (
                              <span className="flex items-center gap-1"><MapPin size={13} className="text-rose-500" />{[selectedListing.district, selectedListing.city].filter(Boolean).join(', ')}</span>
                            )}
                            {selectedListing.experience && <span className="flex items-center gap-1"><Clock size={13} className="text-rose-400" />{selectedListing.experience} deneyim</span>}
                          </div>

                          <p className="text-gray-700 dark:text-white/70 text-sm leading-relaxed mb-4">{selectedListing.description}</p>

                          {selectedListing.process && (
                            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-4">
                              <h3 className="font-black text-gray-900 dark:text-white text-sm mb-2">İş Süreci</h3>
                              <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed">{selectedListing.process}</p>
                            </div>
                          )}

                          {(selectedListing.tags ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {(selectedListing.tags ?? []).map(t => (
                                <span key={t} className="text-xs bg-gray-100 dark:bg-white/8 text-gray-700 dark:text-white/70 px-3 py-1 rounded-full font-medium">{t}</span>
                              ))}
                            </div>
                          )}

                          {selectedListing.price_range && (
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/8">
                              <span className="text-sm text-gray-400">Fiyat aralığı</span>
                              <span className="font-black text-gray-900 dark:text-white">{selectedListing.price_range}</span>
                            </div>
                          )}

                          {/* Öne Çıkarma Banner */}
                          {!selectedListing.is_promoted ? (
                            <div className="mt-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden group">
                              <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/20 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700" />
                              <div className="flex items-start sm:items-center gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                                  <Megaphone className="text-white" size={24} />
                                </div>
                                <div>
                                  <h3 className="font-black text-gray-900 dark:text-white text-lg">İlanınızı Öne Çıkarın</h3>
                                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-0.5">Daha fazla müşteriye ulaşmak için reklam verin ve ilk sıralarda yer alın.</p>
                                </div>
                              </div>
                              <button onClick={() => setIsPaymentModalOpen(true)} className="w-full sm:w-auto relative z-10 whitespace-nowrap bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2">
                                <Sparkles size={16} /> Reklam Ver
                              </button>
                            </div>
                          ) : (
                            <div className="mt-6 relative overflow-hidden rounded-2xl bg-white dark:bg-[#111] border border-emerald-100 dark:border-emerald-900/30 shadow-sm p-6">
                              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                              <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
                              
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                                    <Sparkles className="text-emerald-600 dark:text-emerald-400" size={24} />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-black text-gray-900 dark:text-white text-lg tracking-tight">Sponsorluk Aktif</h3>
                                      <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Yayında</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">İlanınız şu anda arama sonuçlarında <strong className="text-gray-700 dark:text-gray-300">en üst sıralarda</strong> gösteriliyor.</p>
                                  </div>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-center min-w-[140px]">
                                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Bitiş Tarihi</p>
                                  <p className="font-black text-gray-900 dark:text-white text-sm">
                                    {selectedListing.promoted_until ? new Date(selectedListing.promoted_until).toLocaleDateString('tr-TR') : 'Süresiz'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Performans Raporu (Analytics) */}
                          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                                  <TrendingUp className="text-rose-600 dark:text-rose-400" size={16} />
                                </div>
                                <h3 className="font-black text-gray-900 dark:text-white text-sm">Performans Raporu</h3>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <select
                                    value={timeFilter}
                                    onChange={(e) => setTimeFilter(e.target.value)}
                                    className="appearance-none bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 outline-none cursor-pointer focus:ring-2 focus:ring-rose-500/20"
                                  >
                                    <option>Son 1 Gün</option>
                                    <option>Son 1 Hafta</option>
                                    <option>Son 1 Ay</option>
                                    <option>Son 1 Yıl</option>
                                  </select>
                                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                <button
                                  onClick={() => setIsChartOpen(true)}
                                  className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                >
                                  <BarChart3 size={14} /> Grafiği Gör
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {/* Gösterim */}
                              <div className="bg-gradient-to-br from-rose-500 to-[#9a0002] p-4 rounded-2xl border border-rose-400/50 hover:border-rose-300 hover:shadow-[0_8px_30px_-12px_rgba(154,0,2,0.5)] hover:-translate-y-1 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                  <Eye size={48} className="text-[#efe6dd]" />
                                </div>
                                <div className="flex items-center gap-2 mb-3 relative z-10">
                                  <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <Eye size={12} className="text-[#efe6dd]" />
                                  </div>
                                  <span className="text-[10px] font-black text-[#efe6dd]/80 uppercase tracking-widest">Gösterim</span>
                                </div>
                                <div className="text-2xl font-black text-[#efe6dd] relative z-10">{selectedListing.views ?? 0}</div>
                              </div>

                              {/* Tıklanma */}
                              <div className="bg-gradient-to-br from-rose-500 to-[#9a0002] p-4 rounded-2xl border border-rose-400/50 hover:border-rose-300 hover:shadow-[0_8px_30px_-12px_rgba(154,0,2,0.5)] hover:-translate-y-1 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                  <MousePointerClick size={48} className="text-[#efe6dd]" />
                                </div>
                                <div className="flex items-center gap-2 mb-3 relative z-10">
                                  <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <MousePointerClick size={12} className="text-[#efe6dd]" />
                                  </div>
                                  <span className="text-[10px] font-black text-[#efe6dd]/80 uppercase tracking-widest">Tıklanma</span>
                                </div>
                                <div className="text-2xl font-black text-[#efe6dd] relative z-10">{selectedListing.clicks ?? 0}</div>
                              </div>

                              {/* Mesaj */}
                              <div className="bg-gradient-to-br from-rose-500 to-[#9a0002] p-4 rounded-2xl border border-rose-400/50 hover:border-rose-300 hover:shadow-[0_8px_30px_-12px_rgba(154,0,2,0.5)] hover:-translate-y-1 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                  <MessageSquare size={48} className="text-[#efe6dd]" />
                                </div>
                                <div className="flex items-center gap-2 mb-3 relative z-10">
                                  <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <MessageSquare size={12} className="text-[#efe6dd]" />
                                  </div>
                                  <span className="text-[10px] font-black text-[#efe6dd]/80 uppercase tracking-widest">Mesaj</span>
                                </div>
                                <div className="text-2xl font-black text-[#efe6dd] relative z-10">{selectedListing.message_clicks ?? 0}</div>
                              </div>

                              {/* Arama */}
                              <div className="bg-gradient-to-br from-rose-500 to-[#9a0002] p-4 rounded-2xl border border-rose-400/50 hover:border-rose-300 hover:shadow-[0_8px_30px_-12px_rgba(154,0,2,0.5)] hover:-translate-y-1 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                  <PhoneCall size={48} className="text-[#efe6dd]" />
                                </div>
                                <div className="flex items-center gap-2 mb-3 relative z-10">
                                  <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <PhoneCall size={12} className="text-[#efe6dd]" />
                                  </div>
                                  <span className="text-[10px] font-black text-[#efe6dd]/80 uppercase tracking-widest">Arama</span>
                                </div>
                                <div className="text-2xl font-black text-[#efe6dd] relative z-10">{selectedListing.phone_clicks ?? 0}</div>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic customer reviews list for provider profile details */}
                          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/8">
                            <h3 className="font-black text-gray-900 dark:text-white text-sm mb-4">
                              Müşteri Değerlendirmeleri ({selectedListing.reviewCount ?? 0})
                            </h3>
                            {selectedListing.reviews && selectedListing.reviews.length > 0 ? (
                              <div className="space-y-4">
                                {selectedListing.reviews.map((review: any) => (
                                  <div key={review.id} className="p-4 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/3">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white font-black text-xs shrink-0">
                                        {review.author.charAt(0).toUpperCase()}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-bold text-xs text-gray-900 dark:text-white">{review.author}</span>
                                          <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, idx) => (
                                              <Star
                                                key={idx}
                                                size={10}
                                                className={idx < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
                                              />
                                            ))}
                                            <span className="text-[10px] text-gray-400 ml-1">{review.date}</span>
                                          </div>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-white/75 leading-relaxed">{review.comment}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic">Henüz değerlendirme yapılmamış.</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Other listings */}
                      {listings.length > 1 && (
                        <div className="bento-item premium-glow p-6">
                          <h3 className="font-black text-gray-900 dark:text-white mb-3">Diğer Hizmetler</h3>
                          <div className="space-y-2">
                            {listings.map(l => (
                              <div key={l.id} onClick={() => setSelectedListing(l)}
                                className={`listing-item ${selectedListing?.id === l.id ? 'active' : ''}`}>
                                <div className="flex items-center gap-3">
                                  {l.cover_image ? (
                                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                                      <img src={l.cover_image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                  ) : (
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white text-lg font-black shrink-0">
                                      {l.service.charAt(0)}
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{l.title}</p>
                                    <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold truncate">
                                      {l.sub_services && l.sub_services.length > 0 ? l.sub_services.join(', ') : l.service}
                                    </p>
                                    {l.price_range && <p className="text-gray-400 text-xs">{l.price_range}</p>}
                                  </div>
                                  <ChevronRight className="text-gray-300" size={15} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Modal */}
      {isChartOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#111] rounded-3xl p-6 w-full max-w-4xl shadow-2xl relative">
            <button onClick={() => setIsChartOpen(false)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-500 transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BarChart3 className="text-rose-500" />
              Performans Grafiği ({timeFilter})
            </h2>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorT" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-white/10" />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', color: '#000' }} />
                  <Area type="monotone" dataKey="Gösterim" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorG)" />
                  <Area type="monotone" dataKey="Tıklanma" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorT)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {/* Portfolio lightbox */}
      {selectedPortfolio && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedPortfolio(null)}>
          <img src={selectedPortfolio} alt="" className="max-w-full max-h-full rounded-2xl object-contain" />
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20" onClick={() => setSelectedPortfolio(null)}>
            ✕
          </button>
        </div>
      )}
    </>
  );
}
