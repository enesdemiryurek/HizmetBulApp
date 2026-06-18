'use client';
import { API_BASE_URL } from '@/config';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Briefcase, Edit3, Save, X, LogOut,
  CheckCircle2, Shield, Settings, ChevronRight, Clock, Star,
  Plus, Camera, MapPin, Users, Pencil, Trash2, Eye
} from 'lucide-react';
import ListingFormModal from '@/components/ListingFormModal';
import PaymentModal from '@/components/PaymentModal';
import PixarLoader from '@/components/PixarLoader';
import { Sparkles } from 'lucide-react';

const API = `${API_BASE_URL}/api`;

interface UserData {
  id: number; name: string; email: string; phone?: string;
  role: 'hizmet_alan' | 'hizmet_veren'; services?: string[];
  avatar?: string; city?: string; district?: string; bio?: string;
  created_at?: string;
}
interface ListingData {
  id: number; service: string; sub_services?: string[]; title: string; description: string;
  process?: string; cover_image?: string; portfolio_images?: string[];
  price_range?: string; experience?: string; city?: string;
  district?: string; tags?: string[]; is_active?: boolean; created_at?: string;
}

/* ── Listing Card — same style as Keşfet page ── */
function ListingCard({ listing, user, onEdit, onDelete, onPromote }: {
  listing: ListingData; user: UserData;
  onEdit: (l: ListingData) => void; onDelete: (id: number) => void;
  onPromote: (l: ListingData) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ backgroundColor: '#ffffff' }}
      className="dark:bg-[#0a0a0a] rounded-2xl border-[1.5px] border-[#9a0002] dark:border-white/10 overflow-hidden hover:shadow-2xl hover:shadow-[#9a0002]/15 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 group"
    >
      {/* Cover */}
      <div className="relative h-28 bg-gradient-to-br from-[#1a0010] via-[#7f1d3f] to-[#e11d48] overflow-hidden">
        {listing.cover_image && (
          <img src={listing.cover_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50" />
        <span className="absolute top-3 left-3 text-[10px] font-extrabold text-white bg-rose-600 px-3 py-1.5 rounded-xl shadow-md border border-rose-500/30 uppercase tracking-wide">
          {listing.sub_services && listing.sub_services.length > 0 ? listing.sub_services[0] : listing.service}
        </span>
        <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-white bg-rose-500/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Shield size={9} className="fill-white text-white" /> Doğrulanmış
        </span>
        {/* Edit/Delete overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button onClick={() => onEdit(listing)} className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-100">
            <Pencil size={12} /> Düzenle
          </button>
          <button onClick={() => { setDeleting(true); onDelete(listing.id); }} disabled={deleting}
            className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-rose-700 disabled:opacity-60">
            <Trash2 size={12} /> Sil
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-8 mb-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-white dark:ring-[#0a0a0a] shadow-lg bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white font-black text-xl shrink-0">
            {user.avatar ? <img src={user.avatar.startsWith('http') ? user.avatar : `${API_BASE_URL}/storage/${user.avatar}`} alt="" className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex items-center gap-1 mb-0.5">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="font-black text-gray-900 dark:text-white text-sm">Yeni</span>
          </div>
        </div>

        <h2 className="text-base font-black text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors leading-tight mb-0.5">{user.name}</h2>
        <p className="text-sm text-gray-500 dark:text-white/60 font-medium mb-1 line-clamp-1">{listing.title}</p>
        {(listing.sub_services && listing.sub_services.length > 0) && (
          <p className="text-xs text-rose-500 font-bold mb-2 truncate">
            {listing.sub_services.join(', ')}
          </p>
        )}

        {(listing.city || user.city) && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
            <MapPin size={11} className="text-rose-500 shrink-0" />
            {[listing.district || user.district, listing.city || user.city].filter(Boolean).join(', ')}
          </div>
        )}
        {user.phone && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
            <Users size={11} className="text-rose-400" /> {user.phone}
          </div>
        )}

        <p className="text-sm text-gray-600 dark:text-white/60 line-clamp-2 mb-3">{listing.description}</p>

        {(listing.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(listing.tags ?? []).slice(0, 3).map(t => (
              <span key={t} className="text-xs bg-gray-100 dark:bg-white/8 text-gray-700 dark:text-white/70 px-2 py-0.5 rounded-full font-medium">{t}</span>
            ))}
          </div>
        )}

        {listing.price_range && (
          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-white/8 pt-3">
            <span>Fiyat aralığı</span>
            <span className="font-black text-gray-900 dark:text-white">{listing.price_range}</span>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <Link href="/hizmet-sayfam" className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-sm font-bold py-2.5 rounded-xl transition-colors">
            <Eye size={14} /> Profili Gör
          </Link>
          <button onClick={() => onPromote(listing)} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20">
            <Sparkles size={14} /> Reklam Ver
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#efe6dd] dark:bg-[#050505] flex flex-col pt-[72px] items-center justify-center"><PixarLoader fullScreen={false} /></div>}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', city: '', district: '' });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);
  const [editingListing, setEditingListing] = useState<ListingData | null>(null);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [promotingListingId, setPromotingListingId] = useState<number | null>(null);

  const avatarRef = useRef<HTMLInputElement>(null);

  const [showProfileCityDropdown, setShowProfileCityDropdown] = useState(false);
  const [showProfileDistrictDropdown, setShowProfileDistrictDropdown] = useState(false);

  const profileCityDropdownRef = useRef<HTMLDivElement>(null);
  const profileDistrictDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileCityDropdownRef.current && !profileCityDropdownRef.current.contains(event.target as Node)) {
        setShowProfileCityDropdown(false);
      }
      if (profileDistrictDropdownRef.current && !profileDistrictDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDistrictDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const profileFilteredCities = form.city.trim() === ''
    ? TURKEY_CITIES
    : TURKEY_CITIES.filter(city =>
        normalizeText(city).includes(normalizeText(form.city))
      );

  const profileCityDistricts = form.city ? (TURKEY_DISTRICTS[form.city] || []) : [];
  const profileFilteredDistricts = form.district.trim() === ''
    ? profileCityDistricts
    : profileCityDistricts.filter(d =>
        normalizeText(d).includes(normalizeText(form.district))
      );

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const authHeaders = { Authorization: `Bearer ${token}`, Accept: 'application/json' };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { router.push('/giris-yap'); return; }

    const cachedUser = localStorage.getItem('user');
    const cachedListings = localStorage.getItem('user_listings');
    if (cachedUser && cachedListings) {
      const u = JSON.parse(cachedUser);
      setUser(u);
      setForm({ name: u.name, phone: u.phone ?? '', city: u.city ?? '', district: u.district ?? '' });
      setListings(JSON.parse(cachedListings));
      setLoading(false);
    }

    Promise.all([
      fetch(`${API}/user`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }).then(r => r.json()),
      fetch(`${API}/listings`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }).then(r => r.json())
    ])
      .then(([userData, listingsData]) => {
        const u = userData.user ?? userData;
        setUser(u);
        setForm({ name: u.name, phone: u.phone ?? '', city: u.city ?? '', district: u.district ?? '' });
        setListings(listingsData.listings ?? []);
        localStorage.setItem('user', JSON.stringify(u));
        localStorage.setItem('user_listings', JSON.stringify(listingsData.listings ?? []));
        
        if (searchParams.get('ilan-ekle') === '1' && u.role === 'hizmet_veren') {
          setShowListingForm(true);
        }
      })
      .catch(() => { localStorage.removeItem('auth_token'); router.push('/giris-yap'); })
      .finally(() => setLoading(false));
  }, [router, searchParams, token]);

  const totalXp = listings.reduce((sum: number, l: any) => sum + (l?.gamification_xp || 0), 0);
  let currentLevel = 'Çırak';
  let nextLevelXp: number | null = 250;
  let levelIcon = '🛠️';
  let levelColor = 'from-slate-400 to-slate-600';

  if (totalXp >= 2500) { currentLevel = 'Efsane Usta'; nextLevelXp = null; levelIcon = '👑'; levelColor = 'from-purple-500 to-indigo-600'; }
  else if (totalXp >= 1000) { currentLevel = 'Usta'; nextLevelXp = 2500; levelIcon = '🔨'; levelColor = 'from-amber-400 to-orange-500'; }
  else if (totalXp >= 250) { currentLevel = 'Kalfa'; nextLevelXp = 1000; levelIcon = '⚒️'; levelColor = 'from-blue-400 to-blue-600'; }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !token) return;
    setUploadingAvatar(true);
    const fd = new FormData();
    fd.append('avatar', avatarFile);
    try {
      const res = await fetch(`${API}/user/avatar`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, body: fd });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setAvatarPreview(null);
        setAvatarFile(null);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));
        setSaveMsg('Profil fotoğrafı güncellendi ✓');
        setTimeout(() => setSaveMsg(''), 3000);
      }
    } catch {}
    setUploadingAvatar(false);
  };

  const saveProfile = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/user/update`, {
        method: 'PUT',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        const u = data.user ?? { ...user, ...form };
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
        window.dispatchEvent(new Event('auth-change'));
        setSaveMsg('Profil güncellendi ✓');
        setEditing(false);
        setTimeout(() => setSaveMsg(''), 3000);
      }
    } catch {}
    setSaving(false);
  };

  const handleLogout = async () => {
    if (token) await fetch(`${API}/logout`, { method: 'POST', headers: authHeaders }).catch(() => {});
    localStorage.removeItem('auth_token'); localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change')); router.push('/');
  };

  const deleteListing = async (id: number) => {
    if (!token) return;
    await fetch(`${API}/listings/${id}`, { method: 'DELETE', headers: authHeaders });
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const onListingSaved = (saved: ListingData) => {
    setListings(prev => {
      const idx = prev.findIndex(l => l.id === saved.id);
      if (idx >= 0) { const arr = [...prev]; arr[idx] = saved; return arr; }
      return [saved, ...prev];
    });
    setShowListingForm(false);
    setEditingListing(null);
  };

  if (loading) return (
    <div className="flex-1 flex flex-col pt-24 bg-[#efe6dd] dark:bg-[#050505]">
      <PixarLoader fullScreen={false} />
    </div>
  );
  if (!user) return null;

  const isProvider = user.role === 'hizmet_veren';
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' }) : '—';
  const avatarUrl = user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE_URL}/storage/${user.avatar}`) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap');
        .profile-page { font-family: var(--font-noto), 'Noto Serif', serif; }
        .hero-red {
          background: linear-gradient(135deg, #6b0001 0%, #9a0002 35%, #be123c 70%, #e11d48 100%);
          position: relative;
        }
        .hero-mesh {
          position: absolute; inset: 0;
          background-image: radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.07) 0%, transparent 60%),
                            radial-gradient(ellipse at 80% 20%, rgba(255,100,100,0.15) 0%, transparent 50%),
                            radial-gradient(ellipse at 60% 90%, rgba(0,0,0,0.2) 0%, transparent 50%);
        }
        .card { background: #ffffff; border: 1.5px solid #9a0002; border-radius: 1.5rem; padding: 1.5rem; box-shadow: 0 4px 12px rgba(154,0,2,0.08); transition: all .3s ease; }
        .card:hover { box-shadow: 0 10px 25px rgba(154,0,2,0.12); }
        .dark .card { background:#111; border-color:rgba(255,255,255,.07); }
        .input-f { width:100%; padding:.65rem .75rem .65rem 2.4rem; border-radius:.75rem; font-size:.875rem; outline:none; transition:all .2s; background:#f9fafb; border:1.5px solid #e5e7eb; color:#111; }
        .input-f:focus { border-color:#e11d48; box-shadow:0 0 0 3px rgba(225,29,72,.1); background:#fff; }
        .dark .input-f { background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.1); color:#f9fafb; }
        .dark .input-f:focus { border-color:#e11d48; }
        .btn-red { display:inline-flex; align-items:center; gap:.4rem; padding:.6rem 1.2rem; border-radius:.875rem; font-weight:800; font-size:.875rem; background:linear-gradient(135deg,#e11d48,#be123c); color:#fff; border:none; cursor:pointer; transition:all .2s; box-shadow:0 3px 14px rgba(225,29,72,.3); }
        .btn-red:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(225,29,72,.4); }
        .btn-red:disabled { opacity:.65; transform:none; cursor:not-allowed; }
        .btn-outline { display:inline-flex; align-items:center; gap:.4rem; padding:.6rem 1.1rem; border-radius:.875rem; font-weight:700; font-size:.875rem; background:transparent; color:#e11d48; border:1.5px solid #e11d48; cursor:pointer; transition:all .2s; }
        .btn-outline:hover { background:#e11d48; color:#fff; }
        .btn-ghost { display:inline-flex; align-items:center; gap:.4rem; padding:.6rem 1.1rem; border-radius:.875rem; font-weight:700; font-size:.875rem; background:#f3f4f6; color:#374151; border:none; cursor:pointer; transition:all .2s; }
        .dark .btn-ghost { background:rgba(255,255,255,.08); color:#d1d5db; }
        .btn-ghost:hover { background:#e9ecef; }
        .stat-tile { background:rgba(255,255,255,.12); backdrop-filter:blur(8px); border-radius:1rem; padding:.75rem 1.25rem; text-align:center; border:1px solid rgba(255,255,255,.18); transition: background .2s; }
        .stat-tile:hover { background:rgba(255,255,255,.2); }
        .btn-logout { width:100%; display:flex; align-items:center; justify-content:center; gap:.5rem; padding:.75rem; border-radius:.875rem; font-weight:700; font-size:.875rem; background:#9a0002; color:#fff; border:none; cursor:pointer; transition:all .2s; box-shadow: 0 4px 14px rgba(154,0,2,0.25); }
        .dark .btn-logout { background:rgba(225,29,72,.1); color:#fda4af; }
        .btn-logout:hover { background:#7a0001; transform:translateY(-1px); }
        .avatar-ring { border:3px solid rgba(255,255,255,.3); box-shadow: 0 0 0 4px rgba(255,255,255,0.1); }
        .hero-badge { background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); }
      `}</style>

      <div className="profile-page min-h-screen bg-[#efe6dd] dark:bg-[#050505] pt-20 pb-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">

          {/* ── HERO ── */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="hero-red rounded-3xl overflow-hidden mb-6 relative">
            {/* Mesh background */}
            <div className="hero-mesh" />
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute bottom-0 left-1/3 w-80 h-32 rounded-full bg-rose-900/30 blur-3xl" />
            <div className="absolute top-4 left-1/2 w-px h-full bg-white/5" />

            <div className="relative z-10 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl avatar-ring overflow-hidden bg-gradient-to-br from-rose-400/30 to-rose-800/40 flex items-center justify-center text-4xl font-black text-white shadow-2xl">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                  ) : avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={() => avatarRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-white rounded-full border-2 border-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-50 transition-all hover:scale-110"
                >
                  <Camera className="text-rose-600" size={13} />
                </button>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              {/* Avatar action */}
              {avatarPreview && (
                <div className="flex gap-2">
                  <button onClick={uploadAvatar} disabled={uploadingAvatar} className="btn-red text-sm">
                    {uploadingAvatar ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Yükleniyor...</> : <><Save size={13} /> Fotoğrafı Kaydet</>}
                  </button>
                  <button onClick={() => { setAvatarPreview(null); setAvatarFile(null); }} className="btn-ghost text-sm"><X size={13} /> İptal</button>
                </div>
              )}

              {/* Info */}
              {!avatarPreview && (
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">{user.name}</h1>
                    <span className={`hero-badge inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1.5 text-white`}>
                      {isProvider ? <Briefcase size={10} /> : <User size={10} />}
                      {isProvider ? 'Hizmet Veren' : 'Hizmet Alan'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-5">
                    <Mail size={12} className="text-rose-300/60" />
                    <p className="text-rose-200/60 text-sm">{user.email}</p>
                    {(user.city || user.district) && (
                      <>
                        <span className="text-rose-300/30">·</span>
                        <MapPin size={12} className="text-rose-300/60" />
                        <p className="text-rose-200/60 text-sm">{[user.district, user.city].filter(Boolean).join(', ')}</p>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {isProvider && (
                      <div className="stat-tile">
                        <div className="text-2xl font-black text-white">{listings.length}</div>
                        <div className="text-rose-300/60 text-xs font-semibold mt-0.5">Aktif İlan</div>
                      </div>
                    )}
                    <div className="stat-tile">
                      <div className="text-2xl font-black text-white">{totalXp}</div>
                      <div className="text-rose-300/60 text-xs font-semibold mt-0.5">XP Puanı</div>
                    </div>
                    <div className="stat-tile">
                      <div className="text-base font-black text-white">{joinDate}</div>
                      <div className="text-rose-300/60 text-xs font-semibold mt-0.5">Üyelik Tarihi</div>
                    </div>
                    <div className="stat-tile">
                      <div className="text-base font-black text-white">{isProvider ? 'Hizmet Veren' : 'Hizmet Alan'}</div>
                      <div className="text-rose-300/60 text-xs font-semibold mt-0.5">Üyelik Tipi</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Toast */}
          {saveMsg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} /> {saveMsg}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* LEFT */}
            <div className="lg:col-span-2 space-y-5">
              {/* Personal Info */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bento-item premium-glow">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center">
                      <User className="text-rose-500" size={16} />
                    </div>
                    <h2 className="font-black text-gray-900 dark:text-white">Kişisel Bilgiler</h2>
                  </div>
                  {!editing ? (
                    <button onClick={() => setEditing(true)} className="btn-outline text-sm"><Edit3 size={13} /> Düzenle</button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(false)} className="btn-ghost text-sm"><X size={13} /> İptal</button>
                      <button onClick={saveProfile} disabled={saving} className="btn-red text-sm">
                        {saving ? 'Kaydediliyor...' : <><Save size={13} /> Kaydet</>}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Ad Soyad</label>
                    {editing ? (
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input type="text" value={form.name} placeholder="Enes Demiryürek"
                          onChange={e => setForm({ ...form, name: e.target.value })} className="input-f" />
                      </div>
                    ) : (
                      <p className="font-bold text-gray-900 dark:text-white mt-1">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Telefon</label>
                    {editing ? (
                      <div className="relative mt-1.5">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input type="tel" value={form.phone} placeholder="0555 123 4567"
                          onChange={e => setForm({ ...form, phone: e.target.value })} className="input-f" />
                      </div>
                    ) : (
                      <p className="font-bold text-gray-900 dark:text-white mt-1">
                        {user.phone || <span className="text-gray-400 italic text-sm font-normal">—</span>}
                      </p>
                    )}
                  </div>

                  {/* Şehir */}
                  <div ref={profileCityDropdownRef} className="relative">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Şehir</label>
                    {editing ? (
                      <div className="relative mt-1.5">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500" size={14} />
                        <input
                          type="text"
                          value={form.city}
                          placeholder="İstanbul"
                          onChange={e => { setForm({ ...form, city: e.target.value, district: '' }); setShowProfileCityDropdown(true); }}
                          onFocus={() => setShowProfileCityDropdown(true)}
                          className="input-f"
                        />
                        <AnimatePresence>
                          {showProfileCityDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                              className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden divide-y divide-gray-50 dark:divide-white/5"
                            >
                              {profileFilteredCities.length > 0 ? profileFilteredCities.map((cityName: string) => (
                                <button key={cityName} type="button"
                                  onClick={() => { setForm({ ...form, city: cityName, district: '' }); setShowProfileCityDropdown(false); }}
                                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-rose-600 hover:text-white transition-colors"
                                >{cityName}</button>
                              )) : (
                                <div className="px-4 py-3 text-xs font-semibold text-gray-400 italic">Şehir bulunamadı.</div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <p className="font-bold text-gray-900 dark:text-white mt-1">
                        {user.city || <span className="text-gray-400 italic text-sm font-normal">—</span>}
                      </p>
                    )}
                  </div>

                  {/* İlçe */}
                  <div ref={profileDistrictDropdownRef} className="relative">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">İlçe</label>
                    {editing ? (
                      <div className="relative mt-1.5">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" size={14} />
                        <input
                          type="text"
                          value={form.district}
                          placeholder={form.city ? 'İlçe seçin/yazın' : 'Önce şehir seçin'}
                          disabled={!form.city}
                          onChange={e => { setForm({ ...form, district: e.target.value }); setShowProfileDistrictDropdown(true); }}
                          onFocus={() => setShowProfileDistrictDropdown(true)}
                          className="input-f disabled:opacity-50"
                        />
                        <AnimatePresence>
                          {showProfileDistrictDropdown && form.city && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                              className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden divide-y divide-gray-50 dark:divide-white/5"
                            >
                              {profileFilteredDistricts.length > 0 ? profileFilteredDistricts.map((districtName: string) => (
                                <button key={districtName} type="button"
                                  onClick={() => { setForm({ ...form, district: districtName }); setShowProfileDistrictDropdown(false); }}
                                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-rose-600 hover:text-white transition-colors"
                                >{districtName}</button>
                              )) : (
                                <div className="px-4 py-3 text-xs font-semibold text-gray-400 italic">İlçe bulunamadı.</div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <p className="font-bold text-gray-900 dark:text-white mt-1">
                        {user.district || <span className="text-gray-400 italic text-sm font-normal">—</span>}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Listings (providers only) */}
              {isProvider && (
                <div className="bento-item premium-glow col-span-1 xl:col-span-2 p-6 xl:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                        <Briefcase className="text-rose-600 dark:text-rose-400" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Aktif İlanlarım</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Platformda görünen hizmet ilanların</p>
                      </div>
                    </div>
                    <button onClick={() => { setEditingListing(null); setShowListingForm(true); }} className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors w-full sm:w-auto justify-center shadow-lg shadow-black/5 dark:shadow-white/5">
                      <Plus size={18} /> Yeni İlan
                    </button>
                  </div>

                  {listings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {listings.map(listing => (
                        <ListingCard 
                          key={listing.id} 
                          listing={listing} 
                          user={user} 
                          onEdit={(l) => { setEditingListing(l); setShowListingForm(true); }} 
                          onDelete={deleteListing} 
                          onPromote={(l) => { setPromotingListingId(l.id); setShowPaymentModal(true); }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-2xl bg-gray-50 dark:bg-[#111]">
                      <Briefcase size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Henüz ilan oluşturmamışsın</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-sm">Müşterilerin seni bulabilmesi için hemen bir hizmet ilanı oluştur.</p>
                      <button onClick={() => { setEditingListing(null); setShowListingForm(true); }} className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-500/20">
                        <Plus size={18} /> İlk İlanını Oluştur
                      </button>
                    </div>
                  )}
                </div>
              )}
              
            </div>

            {/* RIGHT */}
            <div className="space-y-5">


              {/* Gamification Level UI on right sidebar */}
              {isProvider && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bento-item premium-glow overflow-hidden relative mt-5 p-6">
                  <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${levelColor}`}></div>
                  <div className="absolute -right-6 -top-6 text-9xl opacity-[0.03] filter blur-sm transform rotate-12">
                    {levelIcon}
                  </div>
                  
                  <div className="relative z-10 flex flex-col mb-5">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${levelColor} flex items-center justify-center text-2xl shadow-lg border-2 border-white dark:border-gray-800 shrink-0 transform -rotate-3`}>
                        {levelIcon}
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Mevcut Seviye</div>
                        <h3 className={`text-2xl font-black bg-gradient-to-br ${levelColor} bg-clip-text text-transparent leading-none`}>{currentLevel}</h3>
                      </div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff' }} className="relative z-10 rounded-xl p-4 border-[1.5px] border-[#9a0002] shadow-md">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                      <span className="text-[#9a0002]">{totalXp} XP</span>
                      <span className="text-[#9a0002]/60">{nextLevelXp ? `${nextLevelXp} XP` : 'Maksimum'}</span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-2 shadow-inner border border-gray-300">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${nextLevelXp ? Math.min(100, Math.round((totalXp / nextLevelXp) * 100)) : 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full bg-[#efe6dd] rounded-full`}
                      />
                    </div>
                    {nextLevelXp && (
                      <div className="text-[10px] font-semibold text-gray-500 text-center mt-3">
                        Sonraki seviyeye geçmek için <span className="font-black text-[#9a0002]">{nextLevelXp - totalXp} XP</span> daha gerekiyor.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card mt-5">
                <h2 className="font-black text-gray-900 dark:text-white mb-3">Hızlı Erişim</h2>
                <div className="space-y-1">
                  {[
                    { icon: isProvider ? Briefcase : Star, label: isProvider ? 'Hizmet Sayfam' : 'Hizmet Bul', href: '/hizmet-sayfam' },
                    { icon: Settings, label: 'Ayarlar', href: '/ayarlar' },
                    { icon: MapPin, label: 'Konumum', href: '#' },
                  ].map(item => (
                    <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <item.icon className="text-gray-400 group-hover:text-rose-500 transition-colors" size={15} />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors flex-1">{item.label}</span>
                      <ChevronRight className="text-gray-300 group-hover:text-rose-400 transition-colors" size={14} />
                    </Link>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                <button onClick={handleLogout} className="btn-logout"><LogOut size={15} /> Çıkış Yap</button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Listing Form Modal */}
      <AnimatePresence>
        {showListingForm && (
          <ListingFormModal
            listing={editingListing}
            user={user}
            token={token!}
            isMandatory={searchParams.get('ilan-ekle') === '1' && listings.length === 0}
            onClose={() => { setShowListingForm(false); setEditingListing(null); }}
            onSaved={onListingSaved}
          />
        )}
      </AnimatePresence>

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        listingId={promotingListingId || 0}
        onSuccess={(until: string) => {
          setSaveMsg('Ödemeniz başarıyla alındı! İlanınız sponsorlu oldu.');
          setTimeout(() => setSaveMsg(''), 4000);
          setListings(prev => prev.map(l => l.id === promotingListingId ? { ...l, is_promoted: true, promoted_until: until } : l));
        }}
      />
    </>
  );
}

/* ────────────────────────────────── Autocomplete Data ────────────────────────────────── */
const POPULAR_SERVICES = [
  'Web Tasarım',
  'Web Sitesi Geliştirme',
  'Mobil Uygulama Geliştirme',
  'SEO ve Dijital Pazarlama',
  'Grafik Tasarım',
  'Sosyal Medya Yönetimi',
  'Logo Tasarımı',
  'Ev Temizliği',
  'Ofis Temizliği',
  'İnşaat Sonrası Temizlik',
  'Halı Yıkama',
  'Evden Eve Nakliyat',
  'Şehirler Arası Nakliyat',
  'Matematik Özel Ders',
  'İngilizce Özel Ders',
  'Kişisel Spor Antrenörü (PT)',
  'Diyetisyen',
  'Psikolog ve Danışmanlık',
  'Boya Badana Ustası',
  'Elektrik Tesisatı',
  'Su Tesisatçısı',
  'Marangoz ve Mobilya Kurulumu',
  'Klima Servisi',
  'Fotoğrafçı ve Video Çekimi',
  'Araç Kiralama',
  'Evcil Hayvan Bakımı (Pet Sitter)'
];

const TURKEY_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 
  'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 
  'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 
  'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 
  'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 
  'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 
  'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 
  'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

const TURKEY_DISTRICTS: Record<string, string[]> = {
  'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ'],
  'İstanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Üsküdar', 'Fatih', 'Beyoğlu', 'Bakırköy', 'Ataşehir'],
  'İzmir': ['Konak', 'Bornova', 'Karşıyaka', 'Buca', 'Balçova', 'Çiğli', 'Gaziemir'],
  'Bursa': ['Nilüfer', 'Osmangazi', 'Yıldırım', 'Mudanya'],
};

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i');
};

