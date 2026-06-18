'use client';
import { API_BASE_URL } from '@/config';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Wrench, Code2, Truck, GraduationCap, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const floatingItems = [
  { icon: Wrench, label: 'Tamirat', x: '65%', y: '18%', delay: 0 },
  { icon: Sparkles, label: 'Temizlik', x: '82%', y: '8%', delay: 0.5 },
  { icon: Code2, label: 'Yazılım', x: '75%', y: '35%', delay: 1 },
  { icon: Truck, label: 'Nakliyat', x: '85%', y: '55%', delay: 1.5 },
  { icon: GraduationCap, label: 'Özel Ders', x: '65%', y: '70%', delay: 2 },
];

const stats = [
  { value: '50K+', label: 'Kullanıcı' },
  { value: '8K+', label: 'Uzman' },
  { value: '%98', label: 'Memnuniyet' },
];

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) setFieldErrors({ ...fieldErrors, [e.target.name]: [] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setFieldErrors({});
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 422 && data.errors) setFieldErrors(data.errors);
        else setErrorMsg(data.message || 'Giriş yapılamadı.');
        return;
      }
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('auth-change'));
      if (data.user.role === 'hizmet_veren') router.push('/profil');
      else router.push('/profil');
    } catch {
      setErrorMsg('Sunucuya bağlanılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap');
        .login-page * { font-family: var(--font-noto), 'Noto Serif', serif; box-sizing: border-box; }

        @keyframes floatY {
          0%, 100% { transform: translate(0, 0) rotate(-2deg) scale(1); }
          33% { transform: translate(-8px, -15px) rotate(2deg) scale(1.03); }
          66% { transform: translate(5px, 8px) rotate(0deg) scale(0.98); }
        }
        @keyframes floatY2 {
          0%, 100% { transform: translate(0, 0) rotate(2deg) scale(1); }
          33% { transform: translate(8px, 15px) rotate(-2deg) scale(0.98); }
          66% { transform: translate(-5px, -8px) rotate(1deg) scale(1.03); }
        }
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 0 0 0 rgba(154,0,2,0.4); }
          50% { box-shadow: 0 0 0 16px rgba(154,0,2,0); }
        }
        @keyframes shimmer-red {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hero-bg-red {
          background: linear-gradient(145deg, #2b0000 0%, #4a0001 30%, #7d0001 60%, #9a0002 85%, #c40003 100%);
        }
        .float-chip-a { animation: floatY 6s ease-in-out infinite; }
        .float-chip-b { animation: floatY2 7s ease-in-out infinite; }
        .shimmer-red {
          background: linear-gradient(90deg, #fff 0%, #ff4d4f 50%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: shimmer-red 3s linear infinite;
        }
        .glass-red {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .ring-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
        .spin-deco { animation: spin-slow 25s linear infinite; }

        .input-field {
          width:100%; padding:.75rem .75rem .75rem 2.6rem;
          border-radius:.875rem; font-size:.875rem; transition:all .2s; outline:none;
          background:#f9fafb; border:1.5px solid #e5e7eb; color:#111827;
        }
        .input-field:focus { border-color:#9a0002; box-shadow:0 0 0 3px rgba(154,0,2,.12); background:#fff; }
        .input-field.err { border-color:#9a0002; }
        .dark .input-field { background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.1); color:#f9fafb; }
        .dark .input-field:focus { border-color:#9a0002; background:rgba(255,255,255,.08); }

        .btn-red {
          width:100%; display:flex; align-items:center; justify-content:center; gap:.5rem;
          padding:.9rem; border-radius:.875rem; font-weight:800; font-size:.9375rem;
          color:#fff; background:linear-gradient(135deg,#c40003,#9a0002);
          border:none; cursor:pointer; transition:all .2s;
          box-shadow:0 4px 22px rgba(154,0,2,.4);
        }
        .btn-red:hover { transform:translateY(-1px); box-shadow:0 8px 32px rgba(154,0,2,.5); }
        .btn-red:active { transform:translateY(0); }
        .btn-red:disabled { opacity:.65; cursor:not-allowed; transform:none; }
      `}</style>

      <div className="login-page min-h-screen flex bg-white dark:bg-[#0a0a0a] md:-ml-[80px] md:w-[calc(100%+80px)]" style={{ paddingTop: 0 }}>

        {/* ── LEFT HERO ── */}
        <div className="hidden lg:flex lg:w-[52%] hero-bg-red flex-col relative overflow-hidden">

          {/* Spinning decorative ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-white/5 spin-deco" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5" />
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#9a0002]/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#c40003]/30 blur-3xl" />

          {/* Floating icon chips */}
          {floatingItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`absolute z-10 glass-red rounded-2xl px-4 py-3 flex items-center gap-3 ${i % 2 === 0 ? 'float-chip-a' : 'float-chip-b'}`}
                style={{ left: item.x, top: item.y, animationDelay: `${item.delay}s` }}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Icon size={16} className="text-white" />
                </div>
                <span className="text-white font-bold tracking-wide">{item.label}</span>
              </div>
            );
          })}

          {/* Content */}
          <div className="relative z-20 flex flex-col justify-between h-full p-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <Zap size={20} className="text-white fill-white" />
              </div>
              <span className="text-white font-black text-xl tracking-tight font-celinda">HizmetBul</span>
            </Link>

            {/* Main headline */}
            <div className="space-y-6 mt-12">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                    Sıfır Komisyon,<br />
                    <span className="shimmer-red">%100 Güven.</span>
                  </h1>
                  <p className="text-rose-100/90 text-lg leading-relaxed max-w-md font-medium">
                    Türkiye'nin en yenilikçi hizmet platformunda havuz hesabı ile paranız iş bitene kadar güvendedir. Ücretsiz katılın!
                  </p>
                </motion.div>
              </div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="grid grid-cols-3 gap-4 max-w-md"
              >
                {stats.map((s) => (
                  <div key={s.value} className="glass-red rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                    <div className="text-2xl lg:text-3xl font-black text-white mb-1">{s.value}</div>
                    <div className="text-rose-200/80 text-xs font-bold uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4 mt-8"
              >
                {[
                  { title: '%0 Komisyon Ücreti', desc: 'Ne teklif için ne de aracı kesintisi için ödeme yapın.' },
                  { title: 'Güvenli Havuz Hesabı', desc: 'İş teslim edilene kadar paranız banka güvencesinde.' },
                  { title: 'Sadece Doğrulanmış Uzmanlar', desc: 'Kimliği doğrulanmış, gerçek ve nitelikli profesyoneller.' }
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="text-white" size={14} />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-bold mb-0.5">{item.title}</h4>
                      <p className="text-rose-200/70 text-xs font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Bottom testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="glass-red rounded-3xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors mt-auto w-full max-w-lg"
            >
              <div className="absolute -top-2 -right-2 p-6 opacity-10 rotate-12 group-hover:rotate-6 transition-transform">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M14.017 21L16.411 14.505C16.892 13.14 17.487 11.233 17.487 9.539C17.487 5.86 14.814 3 10.963 3C6.772 3 3 6.945 3 11.967C3 15.69 5.617 18.232 8.784 18.232C9.535 18.232 10.158 18.069 10.741 17.808L9.88 21H14.017ZM20.916 21L23.31 14.505C23.791 13.14 24.386 11.233 24.386 9.539C24.386 5.86 21.713 3 17.862 3C13.671 3 9.899 6.945 9.899 11.967C9.899 15.69 12.516 18.232 15.683 18.232C16.434 18.232 17.057 18.069 17.64 17.808L16.779 21H20.916Z"/></svg>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="fill-yellow-400 text-yellow-400" size={16} />)}
              </div>
              <p className="text-white/95 text-sm md:text-base leading-relaxed mb-5 relative z-10 font-medium">
                "HizmetBul üzerinden evimin boyası için usta buldum. Havuz hesabı sistemi sayesinde en ufak bir endişe duymadan ödememi yaptım. Ustam harika iş çıkardı, kesinlikle tavsiye ediyorum!"
              </p>
              <div className="flex items-center gap-4">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" className="w-12 h-12 rounded-full border-2 border-white/30 object-cover shadow-lg" alt="" />
                <div>
                  <p className="text-white text-sm font-bold">Zeynep Kaya</p>
                  <p className="text-rose-200/80 text-xs font-medium mt-0.5">Ev Sahibi, İstanbul</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── RIGHT FORM ── */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-[#0a0a0a] relative">
          
          {/* Mobile Back Button */}
          <Link href="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-gray-100 dark:bg-white/5 px-3 py-2 rounded-xl z-50">
            <ArrowLeft size={14} />
            Ana Sayfa
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(12px)', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <Link href="/" className="flex items-center justify-center gap-2 mb-6 group">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="font-black text-lg text-gray-900 dark:text-white font-celinda">HizmetBul</span>
            </Link>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1">Hoş geldiniz 👋</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Hesabınıza giriş yapın</p>
            </motion.div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 p-4 rounded-xl flex gap-3 items-center"
              >
                <ShieldAlert className="text-rose-500 shrink-0" size={18} />
                <p className="text-sm text-rose-700 dark:text-rose-300 font-semibold">{errorMsg}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">E-posta</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="email" name="email" id="login-email" required value={formData.email} onChange={handleChange}
                    className={`input-field ${fieldErrors.email ? 'err' : ''}`} placeholder="ahmet@example.com" />
                </div>
                {fieldErrors.email && <p className="mt-1 text-xs text-rose-500 font-semibold">{fieldErrors.email[0]}</p>}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Şifre</label>
                  <Link href="/sifremi-unuttum" className="text-xs font-black text-[#9a0002] hover:underline">Şifremi Unuttum</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type={showPassword ? 'text' : 'password'} name="password" id="login-password" required
                    value={formData.password} onChange={handleChange}
                    className={`input-field pr-10 ${fieldErrors.password ? 'err' : ''}`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
                className="pt-1"
              >
                <button type="submit" disabled={loading} className="btn-red">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Giriş Yapılıyor...</>
                  ) : (
                    <>Giriş Yap <ArrowRight size={17} /></>
                  )}
                </button>
              </motion.div>

              {/* Social Login Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="flex items-center gap-4 my-1"
              >
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
                <span className="text-xs font-semibold text-gray-400 dark:text-white/30 tracking-wider">ya da</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
              </motion.div>

              {/* Social Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="grid grid-cols-2 gap-3"
              >
                {/* Google */}
                <button
                  type="button"
                  onClick={() => alert('Google ile giriş yakında aktif olacak!')}
                  className="flex items-center justify-center gap-2.5 px-4 py-3 bg-gray-950 dark:bg-[#1a1a1a] hover:bg-gray-800 dark:hover:bg-white/8 border border-gray-800 dark:border-white/10 rounded-2xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 group"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

                {/* Apple */}
                <button
                  type="button"
                  onClick={() => alert('Apple ile giriş yakında aktif olacak!')}
                  className="flex items-center justify-center gap-2.5 px-4 py-3 bg-gray-950 dark:bg-[#1a1a1a] hover:bg-gray-800 dark:hover:bg-white/8 border border-gray-800 dark:border-white/10 rounded-2xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 group"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Apple
                </button>
              </motion.div>
            </form>

            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6, duration: 0.6 }} 
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hesabınız yok mu?{' '}
                <Link href="/kayit-ol" className="font-black text-[#9a0002] hover:underline">
                  Ücretsiz Kayıt Ol →
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
