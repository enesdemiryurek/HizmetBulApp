'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Mail, Phone, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Hizmet Ara', href: '/arama' },
    { label: 'Hizmet Alan', href: '/hizmet-alan' },
    { label: 'Hizmet Veren', href: '/hizmet-veren' },
    { label: 'Nasıl Çalışır?', href: '/hizmet-alan' },
  ],
  Kategoriler: [
    { label: 'Temizlik', href: '/arama?kategori=temizlik' },
    { label: 'Nakliyat', href: '/arama?kategori=nakliyat' },
    { label: 'Tamirat', href: '/arama?kategori=tamirat' },
    { label: 'Yazılım & Tasarım', href: '/arama?kategori=yazilim-tasarim' },
    { label: 'Özel Ders', href: '/arama?kategori=ozel-ders' },
  ],
  Şehirler: [
    { label: 'Ankara', href: '/arama?sehir=ankara' },
    { label: 'İstanbul', href: '/arama?sehir=istanbul' },
    { label: 'İzmir', href: '/arama?sehir=izmir' },
    { label: 'Bursa', href: '/arama?sehir=bursa' },
    { label: 'Antalya', href: '/arama?sehir=antalya' },
  ],
  Şirket: [
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'Blog', href: '/blog' },
    { label: 'Gizlilik', href: '/gizlilik' },
    { label: 'Koşullar', href: '/kosullar' },
    { label: 'İletişim', href: '/iletisim' },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/giris-yap' || pathname === '/kayit-ol') return null;
  return (
    <footer className="bg-[#050505] text-white">
      {/* Top CTA */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black leading-tight mb-2">
                Hizmet veren misiniz?
              </h2>
              <p className="text-white/40 text-lg">
                0 TL teklif ücreti. Doğrudan müşteri araması. Bugün başlayın.
              </p>
            </div>
            <Link
              href="/hizmet-veren"
              className="shrink-0 flex items-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl text-base transition-all hover:shadow-2xl hover:shadow-rose-500/20 active:scale-95 group"
            >
              Ücretsiz Profil Oluştur
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="font-black text-lg tracking-tight">
                Hizmet<span className="text-rose-500">Bul</span>
              </span>
            </Link>
            <p className="text-sm text-white/30 leading-relaxed mb-5">
              Türkiye&apos;nin en büyük hizmet profesyonelleri ağı.
            </p>
            <div className="space-y-2">
              <a href="mailto:iletisim@hizmetbul.com.tr" className="flex items-center gap-2 text-xs text-white/30 hover:text-rose-500 transition-colors">
                <Mail size={12} /> iletisim@hizmetbul.com.tr
              </a>
              <a href="tel:+908501234567" className="flex items-center gap-2 text-xs text-white/30 hover:text-rose-500 transition-colors">
                <Phone size={12} /> 0850 123 45 67
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/50 hover:text-rose-500 transition-colors font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">© 2025 HizmetBul. Tüm hakları saklıdır.</p>
          <p className="text-xs text-white/20">🇹🇷 Türkiye&apos;de yapılmıştır</p>
        </div>
      </div>
    </footer>
  );
}
