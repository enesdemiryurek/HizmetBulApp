'use client';
import { API_BASE_URL } from '@/config';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Şifre sıfırlama bağlantısı e-posta adresinize (veya sistem loglarına) gönderildi.', type: 'success' });
        setEmail('');
      } else {
        setMsg({ text: data.message || data.errors?.email?.[0] || 'Bir hata oluştu.', type: 'error' });
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
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
            <Sparkles className="text-rose-600" size={24} />
          </div>
        </div>

        <h2 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-2">Şifremi Unuttum</h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
          E-posta adresinizi girin, size şifrenizi sıfırlamanız için bir bağlantı gönderelim.
        </p>

        {msg && (
          <div className={`mb-6 p-4 rounded-xl flex gap-3 text-sm font-semibold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            {msg.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
            <p>{msg.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">E-posta Adresiniz</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-rose-500" placeholder="ornek@mail.com" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition-colors">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Bağlantı Gönder <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/giris-yap" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            ← Giriş sayfasına dön
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
