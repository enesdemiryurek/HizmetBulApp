'use client';
import { API_BASE_URL } from '@/config';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Search, MapPin, ArrowRight, Star, Shield, Zap,
  Sparkles, Truck, Wrench, Code2, GraduationCap, Car, Camera, Leaf,
  ChevronDown, TrendingUp, Heart, Scissors, PawPrint, PartyPopper, Megaphone
} from 'lucide-react';
import { providers, categories } from '@/lib/data';
import SearchBar from '@/components/SearchBar';
import { CTASection } from '@/components/blocks/cta-with-rectangle';

/* ── Animation variants ─────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

/* ── Icon map ──────────────────────────────────── */
const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Sparkles, Truck, Wrench, Code2, GraduationCap, Car, Camera, Leaf,
  Heart, Scissors, PawPrint, PartyPopper, Megaphone
};

/* ── Floating Profile Card ─────────────────────── */
function FloatingCard({ provider, className }: { provider: (typeof providers)[0]; className?: string }) {
  return (
    <motion.div
      className={`absolute bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 ${className}`}
      whileHover={{ scale: 1.04, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="p-3 flex items-center gap-2.5 min-w-[180px]">
        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-emerald-400 ring-offset-1">
          <Image src={provider.avatarUrl} alt={provider.name} fill className="object-cover" sizes="40px" unoptimized={true} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-900 truncate">{provider.name}</p>
          <p className="text-[10px] text-gray-500 truncate">{provider.jobTitle}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={9} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold text-gray-700">{provider.rating}</span>
            {provider.verified && (
              <Shield size={9} className="text-emerald-500 fill-emerald-500 ml-0.5" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


/* ── Stat counter ──────────────────────────────── */
function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="text-3xl md:text-4xl font-black text-white mb-1">{value}</div>
      <div className="text-sm text-white/80 font-medium">{label}</div>
    </motion.div>
  );
}

/* ── Section wrapper ───────────────────────────── */
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ── Marquee category strip ────────────────────── */
const marqueeItems = [
  'Ev Temizliği', 'Web Tasarım', 'Elektrikçi', 'Nakliyat', 'Özel Ders',
  'Boyacı', 'Fotoğrafçı', 'SEO Uzmanı', 'Çilingir', 'Tesisatçı',
  'Grafik Tasarım', 'Bahçıvan', 'Klima Servisi', 'Kombi Tamiri', 'Kalorifer',
];

/* ══════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════ */
export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [featuredProviders, setFeaturedProviders] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/listings/public?t=${Date.now()}`, { 
      cache: 'no-store', 
      headers: { 
        'Cache-Control': 'no-cache',
        'Accept': 'application/json'
      } 
    })
      .then(async res => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          console.warn("API response parsing failed. Using empty listings.");
          return { success: false, listings: [] };
        }
      })
      .then(data => {
        if (data && data.success && data.listings) {
          const mapped = data.listings.map((l: any) => ({
            id: 'db-' + l.id,
            slug: `db-${l.id}`,
            name: l.user?.name || 'İsimsiz',
            avatarUrl: l.user?.avatar || '',
            jobTitle: l.title || l.service || '',
            city: l.city || l.user?.city || '',
            district: l.district || l.user?.district || '',
            rating: l.rating !== undefined ? Number(l.rating) : 0,
            reviewCount: l.reviewCount !== undefined ? Number(l.reviewCount) : (l.reviews ? l.reviews.length : 0),
            verified: true,
            tags: l.tags || [],
            previewImages: l.cover_image ? [l.cover_image] : [],
            connections: l.gamification_xp || 0,
          }));
          
          // Sort by highest rating or XP (connections field used for display temporarily)
          mapped.sort((a: any, b: any) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.connections - a.connections;
          });
          
          setFeaturedProviders(mapped.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  const displayProviders = featuredProviders.length > 0 ? featuredProviders : providers.slice(0, 6);

  return (
    <div className="bg-[#efe6dd] dark:bg-[#050505] transition-colors duration-300 overflow-x-hidden">

      {/* ╔══ HERO ══════════════════════════════════════════╗ */}
      <section
        ref={heroRef}
        className="relative min-h-screen bg-[#efe6dd] flex flex-col items-center justify-center noise"
      >
        {/* Gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px]" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[80px]" />
        </div>

        {/* Floating cards — left side */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 pointer-events-none hidden lg:block"
        >
          <div className="absolute top-[15%] left-[8%] animate-float">
            <FloatingCard provider={providers[0]} />
          </div>
          <div className="absolute top-[38%] left-[12%] animate-float-delay">
            <FloatingCard provider={providers[2]} />
          </div>
          <div className="absolute top-[65%] left-[6%] animate-float">
            <FloatingCard provider={providers[4]} />
          </div>
          <div className="absolute top-[80%] left-[16%] animate-float-delay">
            <FloatingCard provider={providers[1]} />
          </div>

          {/* Right side */}
          <div className="absolute top-[18%] right-[8%] animate-float-delay">
            <FloatingCard provider={providers[1]} />
          </div>
          <div className="absolute top-[40%] right-[12%] animate-float">
            <FloatingCard provider={providers[3]} />
          </div>
          <div className="absolute top-[62%] right-[6%] animate-float-delay">
            <FloatingCard provider={providers[5]} />
          </div>
          <div className="absolute top-[85%] right-[14%] animate-float">
            <FloatingCard provider={providers[0]} />
          </div>
        </motion.div>

        {/* Center content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4 text-center mt-20 md:mt-0"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-600/10 border border-rose-600/20 text-rose-600 text-sm font-semibold mb-8"
          >
            <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" />
            Türkiye&apos;nin #1 Hizmet Ağı
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-rose-900 leading-[0.95] tracking-tight mb-8"
          >
            En iyi<br />
            <span className="text-gradient">hizmet uzmanını</span><br />
            hemen bul.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg text-rose-800/70 mb-10 max-w-xl mx-auto font-medium"
          >
            12.000+ doğrulanmış uzman profili. Teklif yok, aracı yok — direkt ara.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="mb-8 relative z-20 pointer-events-auto"
          >
            <div className="w-full max-w-3xl mx-auto">
              <SearchBar />
            </div>
          </motion.div>

          {/* Trending tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-xs text-rose-900/30 font-medium">Popüler:</span>
            {['Ev Temizliği', 'Elektrikçi', 'Web Tasarım', 'Nakliyat'].map((t) => (
              <Link
                key={t}
                href={`/arama?q=${encodeURIComponent(t)}`}
                className="px-3 py-1 text-xs font-semibold text-rose-900/60 border border-rose-900/10 rounded-full hover:bg-rose-900/10 hover:text-rose-900 transition-all"
              >
                {t}
              </Link>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-rose-900/30"
        >
          <span className="text-xs font-medium">Keşfet</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </section>

      {/* ╔══ MARQUEE STRIP ═════════════════════════════════╗ */}
      <div className="bg-emerald-500 py-3 overflow-hidden marquee-wrapper border-y border-emerald-400">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center text-white text-sm font-bold mx-6">
              <span className="mr-6 text-emerald-200">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ╔══ FEATURED PROVIDERS ════════════════════════════╗ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Section className="">
            <div className="flex items-end justify-between mb-10">
              <div>
                <motion.p variants={fadeUp} className="text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-widest mb-2">
                  Öne Çıkan Uzmanlar
                </motion.p>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white leading-tight transition-colors">
                  Sizin için<br />seçtiklerimiz
                </motion.h2>
              </div>
              <motion.div variants={fadeUp}>
                <Link
                  href="/arama"
                  className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                >
                  Tümünü Gör
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Provider grid — LinkedIn style */}
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayProviders.map((p) => (
                <motion.div key={p.id} variants={scaleIn}>
                  <LinkedInCard provider={p} />
                </motion.div>
              ))}
            </motion.div>
          </Section>
        </div>
      </section>

      {/* ╔══ CATEGORIES ════════════════════════════════════╗ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#9a0002] via-[#c40003] to-[#9a0002] shadow-inner shadow-black/20">
        <div className="max-w-7xl mx-auto">
          <Section>
            <motion.p variants={fadeUp} className="text-[#efe6dd]/70 font-bold text-sm uppercase tracking-widest mb-3">
              Kategoriler
            </motion.p>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white leading-tight">
                İhtiyacınız olan<br />hizmet burada.
              </motion.h2>
              <motion.div variants={fadeUp}>
                <Link href="/arama" className="flex items-center gap-2 text-sm font-bold text-[#efe6dd] hover:text-white transition-colors group">
                  Tüm Kategoriler <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((cat) => {
                const Icon = ICONS[cat.icon] || Sparkles;
                return (
                  <motion.div key={cat.id} variants={scaleIn}>
                    <Link
                      href={`/arama?kategori=${cat.slug}`}
                      id={`cat-${cat.id}`}
                      className="group premium-glow flex flex-col items-center gap-4 p-5 rounded-3xl bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/10 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-inner">
                        <Icon size={24} className="text-white drop-shadow-md" />
                      </div>
                      <span className="text-sm font-bold text-white text-center leading-tight">
                        {cat.name}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </Section>
        </div>
      </section>

      {/* ╔══ HOW IT WORKS ══════════════════════════════════╗ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#efe6dd] transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <Section>
            <motion.p variants={fadeUp} className="text-[#ff003c] font-bold text-sm uppercase tracking-widest mb-3">
              Nasıl Çalışır
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-rose-900 mb-16 max-w-lg transition-colors">
              3 adımda hizmet al.
            </motion.h2>

            <motion.div variants={stagger} className="bento-grid">
              {[
                { n: '01', icon: Search, title: 'Arama Yap', desc: 'Hizmet veya uzman adı yaz. Şehrine göre filtrele.' },
                { n: '02', icon: Star, title: 'Profili İncele', desc: 'Yorumları, portföyü ve fiyatı karşılaştır.' },
                { n: '03', icon: Zap, title: 'Direkt Ara', desc: 'Komisyon yok, bekleme yok. Telefonda konuş.' },
              ].map(({ n, icon: Icon, title, desc }) => (
                <motion.div
                  key={n}
                  variants={fadeUp}
                  className="bento-item premium-glow p-8 flex flex-col justify-between"
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center mb-8 border border-rose-100 dark:border-rose-800/30 group-hover:bg-rose-600 transition-colors duration-300">
                      <Icon size={24} className="text-rose-600 dark:text-rose-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">{title}</h3>
                    <p className="text-gray-500 dark:text-white/60 leading-relaxed font-medium">{desc}</p>
                  </div>
                  <div className="absolute top-4 right-6 text-7xl font-black text-gray-900/5 dark:text-white/5 leading-none select-none">
                    {n}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Section>
        </div>
      </section>

      {/* ╔══ STATS DARK BAND ═══════════════════════════════╗ */}
      <section className="py-20 bg-gradient-to-r from-[#9a0002] via-[#c40003] to-[#9a0002] shadow-inner shadow-black/20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { value: '12K+', label: 'Aktif Uzman' },
              { value: '98K+', label: 'Mutlu Müşteri' },
              { value: '81', label: 'Şehir' },
              { value: '4.8★', label: 'Ortalama Puan' },
            ].map(({ value, label }) => (
              <StatCounter key={label} value={value} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* ╔══ CTA BANNER ════════════════════════════════════╗ */}
      <CTASection
        badge={{ text: "Hemen Başla" }}
        title="İşini Büyütmek İçin HizmetBul'a Katıl"
        description="Uzman profilini oluştur, binlerce müşteriye anında ulaş ve iş hacmini büyütmeye başla. 0 TL lead ücreti, %0 komisyon."
        action={{
          text: "Ücretsiz Kayıt Ol",
          href: "/hizmet-veren",
          variant: "default"
        }}
        className="mb-24"
      />

    </div>
  );
}

/* ── LinkedIn-style Provider Card ─────────────── */
function LinkedInCard({ provider }: { provider: any }) {
  return (
    <Link href={`/esnaf/${provider.slug}`} className="block group bento-item premium-glow cursor-pointer">
      {/* Cover */}
      <div className="relative h-24 overflow-hidden bg-gradient-to-br from-[#e11d48] to-[#9a0002]">
        {provider.previewImages[0] && (
          <Image
            src={provider.previewImages[0]}
            alt=""
            fill
            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            sizes="400px"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {provider.is_promoted && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-black text-white bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full shadow-lg uppercase tracking-wide">
            ⭐ Sponsorlu
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className="px-5 pb-5">
        <div className="relative -mt-7 mb-3">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-3 ring-white shadow-lg bg-gray-100 flex items-center justify-center">
            {provider.avatarUrl ? (
              <Image
                src={provider.avatarUrl}
                alt={provider.name}
                width={56}
                height={56}
                className="object-cover"
                unoptimized={true}
              />
            ) : (
              <div className="text-xl font-bold text-gray-400">{provider.name.charAt(0)}</div>
            )}
          </div>
          {provider.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#9a0002] rounded-full flex items-center justify-center ring-2 ring-white">
              <Shield size={10} className="text-white fill-white" />
            </div>
          )}
        </div>

        <h3 className="font-black text-gray-900 dark:text-white text-base group-hover:text-[#9a0002] transition-colors leading-tight">
          {provider.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-white/60 font-medium mt-0.5 mb-1 line-clamp-2 transition-colors">
          {provider.jobTitle}
        </p>
        <p className="text-xs text-gray-400 dark:text-white/40 flex items-center gap-1 mb-3 transition-colors">
          <MapPin size={10} className="shrink-0" />
          {provider.district}, {provider.city}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(provider.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
              />
            ))}
          </div>
          <span className="text-xs font-black text-gray-800">{provider.rating}</span>
          <span className="text-xs text-gray-400">({provider.reviewCount})</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {provider.tags.slice(0, 3).map((t: string) => (
            <span key={t} className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {t}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-500">
            {provider.id?.toString().startsWith('db-') 
              ? `${provider.reviewCount} iş bitirdi` 
              : `${provider.connections.toLocaleString('tr')} bağlantı`}
          </span>
          <span className="text-xs font-black text-[#9a0002] group-hover:underline">
            Profili Gör →
          </span>
        </div>
      </div>
    </Link>
  );
}
