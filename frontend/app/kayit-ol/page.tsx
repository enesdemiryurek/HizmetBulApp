'use client';
import { API_BASE_URL } from '@/config';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, ArrowLeft,
  Sparkles, Truck, Wrench, Code2, GraduationCap, Camera, Leaf,
  Car, UserCheck, Briefcase, Search, X, CheckCircle2, Star,
  Heart, Scissors, PawPrint, PartyPopper, MapPin
} from 'lucide-react';
import { districts } from '@/lib/data';
import { motion } from 'framer-motion';
import { ALL_CATEGORIES } from '@/lib/data';

const POPULAR = ['Web Tasarım', 'Ev Temizliği', 'Elektrik Tamiri', 'Nakliyat'];

const heroFeatures = [
  { icon: Star, text: '50.000+ aktif kullanıcı' },
  { icon: CheckCircle2, text: 'Doğrulanmış uzman profilleri' },
  { icon: Briefcase, text: 'Güvenli ödeme altyapısı' },
];

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '' as '' | 'hizmet_alan' | 'hizmet_veren',
    password: '',
    password_confirmation: '',
    services: [] as string[],
    city: '',
    district: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState('');

  /* ── Filtered categories ── */
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return ALL_CATEGORIES;
    const q = searchTerm.toLowerCase();
    return ALL_CATEGORIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const toggleService = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(name)
        ? prev.services.filter((s) => s !== name)
        : [...prev.services, name],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: [] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.role) { setErrorMsg('Lütfen üyelik tipini seçin.'); return; }
    if (formData.role === 'hizmet_veren' && formData.services.length === 0) {
      setErrorMsg('Lütfen en az bir hizmet kategorisi seçin.'); return;
    }

    setLoading(true);
    setErrorMsg('');
    setFieldErrors({});

    try {
      const payload = { ...formData };
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) setFieldErrors(data.errors);
        else setErrorMsg(data.message || 'Kayıt işlemi sırasında bir hata oluştu.');
        return;
      }

      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('auth-change'));

      if (data.user.role === 'hizmet_veren') router.push('/profil?ilan-ekle=1');
      else router.push('/arama');
    } catch {
      setErrorMsg('Sunucuya bağlanılamadı. Lütfen backend sunucusunun çalıştığından emin olun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap');
        .auth-page { font-family: var(--font-noto), 'Noto Serif', serif; }

        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }

        .float-a { animation: float 4s ease-in-out infinite; }
        .float-b { animation: float2 5s ease-in-out infinite; }
        .fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
        .d1{animation-delay:.05s} .d2{animation-delay:.1s} .d3{animation-delay:.15s}
        .d4{animation-delay:.2s} .d5{animation-delay:.25s} .d6{animation-delay:.3s}
        .scale-in { animation: scaleIn 0.3s ease-out; }

        .hero-bg {
          background: linear-gradient(145deg, #2b0000 0%, #4a0001 30%, #7d0001 60%, #9a0002 85%, #c40003 100%);
        }
        .glass { background:rgba(255,255,255,0.08); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.14); }
        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #ff4d4f 50%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: shimmer 3s linear infinite;
        }

        .input-field {
          width:100%; padding:.72rem .75rem .72rem 2.6rem;
          border-radius:.75rem; font-size:.875rem; transition:all .2s; outline:none;
          background:#f9fafb; border:1.5px solid #e5e7eb; color:#111827;
        }
        .input-field:focus { border-color:#9a0002; box-shadow:0 0 0 3px rgba(154,0,2,.15); background:#fff; }
        .input-field.err { border-color:#9a0002; }
        .dark .input-field { background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.1); color:#f9fafb; }
        .dark .input-field:focus { border-color:#9a0002; background:rgba(255,255,255,.08); }

        .role-card {
          border:2px solid #e5e7eb; border-radius:1rem; padding:1.25rem;
          cursor:pointer; transition:all .25s; background:#fff; text-align:left;
        }
        .dark .role-card { background:#1a1a1a; border-color:rgba(255,255,255,.12); }
        .role-card:hover { border-color:#9a0002; box-shadow:0 4px 20px rgba(154,0,2,.15); }
        .role-card.selected {
          border-color:#9a0002;
          background:linear-gradient(135deg,rgba(154,0,2,.08),rgba(74,0,1,.05));
          box-shadow:0 4px 24px rgba(154,0,2,.2);
        }
        .dark .role-card.selected { background:rgba(154,0,2,.12); }

        .chip {
          display:inline-flex; align-items:center; gap:.4rem;
          padding:.35rem .85rem; border-radius:9999px;
          font-size:.8rem; font-weight:500; cursor:pointer;
          transition:all .2s; border:1.5px solid #e5e7eb;
          background:#f9fafb; color:#4b5563;
        }
        .dark .chip { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.12); color:#9ca3af; }
        .chip:hover { border-color:#9a0002; color:#c40003; background:rgba(154,0,2,.06); }
        .chip.active {
          border-color:#9a0002; background:linear-gradient(135deg,#c40003,#9a0002);
          color:#fff; box-shadow:0 2px 10px rgba(154,0,2,.3);
        }
        .dark .chip.active { color:#fff; }

        .submit-btn {
          width:100%; display:flex; align-items:center; justify-content:center; gap:.5rem;
          padding:.875rem 1.5rem; border-radius:.875rem; font-weight:700; font-size:.9375rem;
          color:white; background:linear-gradient(135deg,#c40003,#9a0002); border:none;
          cursor:pointer; transition:all .2s; box-shadow:0 4px 20px rgba(154,0,2,.35);
        }
        .submit-btn:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(154,0,2,.45); }
        .submit-btn:active { transform:translateY(0); }
        .submit-btn:disabled { opacity:.65; cursor:not-allowed; transform:none; }

        .search-box {
          width:100%; padding:.65rem .75rem .65rem 2.4rem;
          border-radius:.75rem; font-size:.8rem; outline:none;
          background:#f3f4f6; border:1.5px solid #e5e7eb; color:#111;
          transition:all .2s;
        }
        .search-box:focus { border-color:#9a0002; background:#fff; box-shadow:0 0 0 3px rgba(154,0,2,.12); }
        .dark .search-box { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.12); color:#f9fafb; }
        .dark .search-box:focus { background:rgba(255,255,255,.1); }

        .chip-scroll { max-height:200px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#9a0002 transparent; }
        .chip-scroll::-webkit-scrollbar { width:4px; }
        .chip-scroll::-webkit-scrollbar-thumb { background:#9a0002; border-radius:4px; }
      `}</style>

      <div className="auth-page min-h-screen flex bg-gray-50 dark:bg-[#0a0a0a] md:-ml-[80px] md:w-[calc(100%+80px)]">

        {/* ─── LEFT Hero Panel ─── */}
        <div className="hidden lg:flex lg:w-[45%] hero-bg flex-col justify-between p-10 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-[#c40003]/30 blur-3xl" />

          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-3 w-max">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-white font-bold text-xl font-celinda">HizmetBul</span>
          </Link>

          {/* Hero content */}
          <div className="relative z-10 space-y-6 mt-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm">
                <Star className="text-yellow-400" size={14} />
                <span className="text-white/95 text-xs font-semibold">Sıfır Komisyon, %100 Güven</span>
              </div>
              <h1 className="text-5xl font-black text-white leading-[1.15]">
                Hemen Üye Ol, <br />
                <span className="shimmer-text">Farkı Yaşa!</span>
              </h1>
              <p className="text-rose-100/90 text-base mt-4 leading-relaxed max-w-sm font-medium">
                Komisyon yok, gizli ücret yok. Havuz hesabı sistemiyle ödemeleriniz iş teslimine kadar %100 güvence altında.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-4 pt-2">
              {[
                { icon: Star, text: '50.000+ mutlu müşteri ve uzman' },
                { icon: CheckCircle2, text: 'Sıfır komisyon & şeffaf ücretlendirme' },
                { icon: Briefcase, text: 'Havuz hesabı ile %100 güvenli ödeme' },
              ].map((f, i) => (
                <div key={i} className={`flex items-center gap-4 float-${i % 2 === 0 ? 'a' : 'b'}`} style={{ animationDelay: `${i * 0.3}s` }}>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm">
                    <f.icon className="text-[#efe6dd]" size={15} />
                  </div>
                  <span className="text-white/95 text-sm font-semibold">{f.text}</span>
                </div>
              ))}
            </div>

            {/* Mini stat cards */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mt-6">
              {[
                { v: '₺0', l: 'Komisyon & Ücret' },
                { v: '8K+', l: 'Uzman Üye' },
                { v: '%100', l: 'Güvenli Ödeme' },
                { v: '7/24', l: 'Canlı Destek' },
              ].map((s) => (
                <div key={s.v} className="glass rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                  <div className="text-2xl font-black text-white mb-1">{s.v}</div>
                  <div className="text-rose-200/80 text-xs font-bold uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Testimonial */}
          <div className="relative z-10 glass rounded-3xl p-5 flex flex-col gap-3 mt-10 hover:bg-white/10 transition-colors">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="fill-yellow-400 text-yellow-400" size={14} />)}
            </div>
            <p className="text-white/90 text-sm leading-relaxed font-medium">
              "Kayıt olmak sadece 2 dakikamı aldı. Komisyon ödemediğim için kazancım cebime kalıyor, harika bir sistem!"
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" alt="" />
              <div>
                <p className="text-white text-sm font-bold">Ahmet Yılmaz</p>
                <p className="text-rose-200/80 text-xs font-medium mt-0.5">Tesisat Ustası, Ankara</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT Form Panel ─── */}
        <div className="flex-1 flex flex-col justify-center items-center p-5 sm:p-10 overflow-y-auto relative">

          {/* Mobile Back Button */}
          <Link href="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-gray-100 dark:bg-white/5 px-3 py-2 rounded-xl z-50">
            <ArrowLeft size={14} />
            Ana Sayfa
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(12px)', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg py-6"
          >

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
                <Sparkles className="text-white" size={16} />
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white font-celinda">HizmetBul</span>
            </div>

            <div className="fade-in-up d1 mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Ücretsiz hesap oluşturun 🎉
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Sadece birkaç adımda başlayın
              </p>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="scale-in mb-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 p-4 rounded-xl flex gap-3 items-start">
                <ShieldAlert className="text-rose-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ── STEP 1: Role Selection ── */}
              <div className="fade-in-up d1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Ben kimim? <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Hizmet Alan */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'hizmet_alan', services: [] })}
                    className={`role-card ${formData.role === 'hizmet_alan' ? 'selected' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${formData.role === 'hizmet_alan' ? 'bg-rose-600' : 'bg-gray-100 dark:bg-white/10'}`}>
                        <UserCheck className={formData.role === 'hizmet_alan' ? 'text-white' : 'text-gray-500 dark:text-gray-400'} size={18} />
                      </div>
                      {formData.role === 'hizmet_alan' && (
                        <CheckCircle2 className="text-rose-500 ml-auto" size={16} />
                      )}
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm">Hizmet Arıyorum</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Uzman bul, iş yaptır</div>
                  </button>

                  {/* Hizmet Veren */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'hizmet_veren' })}
                    className={`role-card ${formData.role === 'hizmet_veren' ? 'selected' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${formData.role === 'hizmet_veren' ? 'bg-rose-600' : 'bg-gray-100 dark:bg-white/10'}`}>
                        <Briefcase className={formData.role === 'hizmet_veren' ? 'text-white' : 'text-gray-500 dark:text-gray-400'} size={18} />
                      </div>
                      {formData.role === 'hizmet_veren' && (
                        <CheckCircle2 className="text-rose-500 ml-auto" size={16} />
                      )}
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm">Hizmet Veriyorum</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Uzman ol, müşteri kazan</div>
                  </button>
                </div>
              </div>

              {/* ── Category Selection (only for hizmet_veren) ── */}
              {formData.role === 'hizmet_veren' && (
                <div className="scale-in">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Hangi hizmetleri veriyorsunuz? <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                    Arayın veya aşağıdan seçin. Birden fazla seçebilirsiniz.
                  </p>

                  {/* Search */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Hizmet ara... (örn: Temizlik, Web)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-box"
                    />
                    {searchTerm && (
                      <button type="button" onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Popular quick picks */}
                  {!searchTerm && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs text-gray-400 dark:text-gray-500 w-full mb-1">⚡ Popüler:</span>
                      {POPULAR.map((name) => {
                        const cat = ALL_CATEGORIES.find((c) => c.name === name);
                        if (!cat) return null;
                        const active = formData.services.includes(name);
                        return (
                          <button
                            type="button"
                            key={name}
                            onClick={() => toggleService(name)}
                            className={`chip ${active ? 'active' : ''}`}
                          >
                            <cat.icon size={11} />
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* All / filtered chips */}
                  <div className="chip-scroll flex flex-wrap gap-2 p-1">
                    {filteredCategories.map((cat) => {
                      const active = formData.services.includes(cat.name);
                      return (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => toggleService(cat.name)}
                          className={`chip ${active ? 'active' : ''}`}
                        >
                          <cat.icon size={11} />
                          {cat.name}
                          {active && <X size={9} />}
                        </button>
                      );
                    })}
                    {filteredCategories.length === 0 && (
                      <p className="text-xs text-gray-400 italic py-2">Sonuç bulunamadı.</p>
                    )}
                  </div>

                  {/* Selected badges */}
                  {formData.services.length > 0 && (
                    <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-xl">
                      <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-2">
                        ✓ Seçilen hizmetler ({formData.services.length}):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.services.map((s) => (
                          <span key={s} className="inline-flex items-center gap-1 text-xs bg-rose-600 text-white rounded-full px-2.5 py-0.5 font-medium">
                            {s}
                            <button type="button" onClick={() => toggleService(s)}>
                              <X size={9} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Personal Info ── */}
              <div className="fade-in-up d2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Ad Soyad
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text" name="name" id="name" required
                    value={formData.name} onChange={handleChange}
                    className={`input-field ${fieldErrors.name ? 'err' : ''}`}
                    placeholder="Ahmet Yılmaz"
                  />
                </div>
                {fieldErrors.name && <p className="mt-1 text-xs text-rose-500">{fieldErrors.name[0]}</p>}
              </div>

              <div className="fade-in-up d3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email" name="email" id="email" required
                    value={formData.email} onChange={handleChange}
                    className={`input-field ${fieldErrors.email ? 'err' : ''}`}
                    placeholder="ahmet@example.com"
                  />
                </div>
                {fieldErrors.email && <p className="mt-1 text-xs text-rose-500">{fieldErrors.email[0]}</p>}
              </div>

              <div className="fade-in-up d4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Telefon <span className="text-gray-400 font-normal text-xs">(isteğe bağlı)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel" name="phone" id="phone"
                    value={formData.phone} onChange={handleChange}
                    className={`input-field ${fieldErrors.phone ? 'err' : ''}`}
                    placeholder="0555 123 4567"
                  />
                </div>
                {fieldErrors.phone && <p className="mt-1 text-xs text-rose-500">{fieldErrors.phone[0]}</p>}
              </div>

              {/* ── City & District ── */}
              <div className="fade-in-up d4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    İl <span className="text-gray-400 font-normal text-xs">(isteğe bağlı)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select
                      name="city" id="city"
                      value={formData.city}
                      onChange={(e) => {
                        handleChange(e);
                        setFormData(prev => ({ ...prev, district: '' }));
                      }}
                      className={`input-field appearance-none ${fieldErrors.city ? 'err' : ''}`}
                    >
                      <option value="">İl Seçin</option>
                      {Object.keys(districts).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {fieldErrors.city && <p className="mt-1 text-xs text-rose-500">{fieldErrors.city[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    İlçe <span className="text-gray-400 font-normal text-xs">(isteğe bağlı)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select
                      name="district" id="district"
                      value={formData.district}
                      onChange={handleChange}
                      className={`input-field appearance-none ${fieldErrors.district ? 'err' : ''}`}
                      disabled={!formData.city}
                    >
                      <option value="">İlçe Seçin</option>
                      {formData.city && districts[formData.city]?.map((d: string) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  {fieldErrors.district && <p className="mt-1 text-xs text-rose-500">{fieldErrors.district[0]}</p>}
                </div>
              </div>

              {/* Passwords side by side */}
              <div className="fade-in-up d5 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password" id="password" required
                      value={formData.password} onChange={handleChange}
                      className={`input-field pr-9 ${fieldErrors.password ? 'err' : ''}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="mt-1 text-xs text-rose-500">{fieldErrors.password[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Şifre Tekrar
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password_confirmation" id="password_confirmation" required
                      value={formData.password_confirmation} onChange={handleChange}
                      className="input-field"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="fade-in-up d6 pt-1">
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Kayıt Yapılıyor...
                    </>
                  ) : (
                    <>
                      Ücretsiz Kayıt Ol <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>

              {/* Social divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
                <span className="text-xs font-semibold text-gray-400 dark:text-white/30 tracking-wider">ya da</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
              </div>

              {/* Social Signup Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => alert('Google ile kayıt yakında aktif olacak!')}
                  className="flex items-center justify-center gap-2.5 px-4 py-3 bg-gray-950 dark:bg-[#1a1a1a] hover:bg-gray-800 dark:hover:bg-white/8 border border-gray-800 dark:border-white/10 rounded-2xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => alert('Apple ile kayıt yakında aktif olacak!')}
                  className="flex items-center justify-center gap-2.5 px-4 py-3 bg-gray-950 dark:bg-[#1a1a1a] hover:bg-gray-800 dark:hover:bg-white/8 border border-gray-800 dark:border-white/10 rounded-2xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Apple
                </button>
              </div>

              {/* Terms note */}
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 px-4">
                Kayıt olarak{' '}
                <a href="#" className="text-rose-600 dark:text-rose-400 hover:underline">Kullanım Şartları</a>
                {' '}ve{' '}
                <a href="#" className="text-rose-600 dark:text-rose-400 hover:underline">Gizlilik Politikası</a>
                'nı kabul etmiş sayılırsınız.
              </p>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Zaten hesabınız var mı?{' '}
                <Link href="/giris-yap" className="font-bold text-[#9a0002] hover:underline">
                  Giriş Yapın →
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
