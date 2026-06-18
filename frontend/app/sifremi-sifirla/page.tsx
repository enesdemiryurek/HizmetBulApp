'use client';
import { API_BASE_URL } from '@/config';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!token || !email) {
      setMsg({ text: 'Geçersiz veya eksik şifre sıfırlama bağlantısı.', type: 'error' });
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) return;
    if (password !== passwordConfirmation) {
      setMsg({ text: 'Şifreler eşleşmiyor.', type: 'error' });
      return;
    }
    
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ token, email, password, password_confirmation: passwordConfirmation }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Şifreniz başarıyla sıfırlandı. Giriş yapabilirsiniz.', type: 'success' });
        setTimeout(() => router.push('/giris-yap'), 3000);
      } else {
        setMsg({ text: data.message || data.errors?.password?.[0] || 'Bir hata oluştu.', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Sunucuya bağlanılamadı.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f8f6] dark:bg-[#050505] p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 border border-gray-100 dark:border-white/10 shadow-xl"
      >
        <h2 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-2">Yeni Şifre Belirle</h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
          Hesabınız için yeni ve güvenli bir şifre oluşturun.
        </p>

        {msg && (
          <div className={`mb-6 p-4 rounded-xl flex gap-3 text-sm font-semibold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            {msg.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
            <p>{msg.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Yeni Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-rose-500" placeholder="En az 8 karakter" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Şifreyi Doğrula</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="password" required value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-rose-500" placeholder="Şifrenizi tekrar girin" />
            </div>
          </div>

          <button type="submit" disabled={loading || !token || !email || msg?.type === 'success'} className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Şifreyi Kaydet <ArrowRight size={18} /></>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f9f8f6] dark:bg-[#050505]">Yükleniyor...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
