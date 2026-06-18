'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Smartphone, Briefcase, ArrowRight } from 'lucide-react';

export default function HeroCTA() {
  const [isProvider, setIsProvider] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // Checking if user is a provider or has the provider role
        if (user && user.role === 'provider') {
          setIsProvider(true);
        }
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#ff003c]/50 text-white/50 font-black text-lg rounded-2xl border border-[#ff6b8b]/10 animate-pulse">
        Yükleniyor...
      </div>
    );
  }

  if (isProvider) {
    return (
      <Link
        href="/profil"
        className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#ff003c] hover:bg-[#d40032] text-white font-black text-lg rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,0,60,0.4)] active:scale-95 border border-[#ff6b8b]/30"
      >
        <Briefcase size={24} />
        İlanlarımı Yönet & Düzenle
        <ArrowRight size={20} className="ml-1" />
      </Link>
    );
  }

  return (
    <a
      href="https://play.google.com/store"
      target="_blank"
      rel="noopener noreferrer"
      id="playstore-cta-btn"
      className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#ff003c] hover:bg-[#d40032] text-white font-black text-lg rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,0,60,0.4)] active:scale-95 border border-[#ff6b8b]/30"
    >
      <Smartphone size={24} />
      Google Play Store'dan Uygulamayı İndir ve Kazanmaya Başla
    </a>
  );
}
