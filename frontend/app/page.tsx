'use client';
import { API_BASE_URL } from '@/config';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Search, MapPin, ArrowRight, Star, Shield, Zap, Phone,
  Sparkles, Truck, Wrench, Code2, GraduationCap, Car, Camera, Leaf,
  ChevronDown, TrendingUp, Heart, Scissors, PawPrint, PartyPopper, Megaphone, Users
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0a0a0a] border-y-[3px] border-gray-950 dark:border-white shadow-[0_8px_0_0_rgba(3,7,18,1)] relative z-20">
        <div className="max-w-7xl mx-auto">
          <Section>
            <motion.p variants={fadeUp} className="text-rose-600 font-black text-sm uppercase tracking-widest mb-3">
              Kategoriler
            </motion.p>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                İhtiyacınız olan<br />hizmet burada.
              </motion.h2>
              <motion.div variants={fadeUp}>
                <Link href="/arama" className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors group px-5 py-2.5 bg-white dark:bg-black border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[4px_4px_0_0_rgba(225,29,72,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(225,29,72,1)]">
                  Tüm Kategoriler <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <motion.div variants={stagger} className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {categories.map((cat) => {
                const Icon = ICONS[cat.icon] || Sparkles;
                return (
                  <motion.div key={cat.id} variants={scaleIn}>
                    <Link
                      href={`/arama?kategori=${cat.slug}`}
                      id={`cat-${cat.id}`}
                      className="group flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white dark:bg-black border-[3px] border-gray-950 dark:border-white shadow-[6px_6px_0_0_rgba(225,29,72,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(225,29,72,1)] transition-all duration-200 cursor-pointer w-[140px] sm:w-[150px] h-[140px] sm:h-[150px]"
                    >
                      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/30 border-[2px] border-gray-950 dark:border-white group-hover:bg-rose-600 transition-colors duration-300">
                        <Icon size={24} className="text-gray-950 dark:text-white group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-xs sm:text-sm font-black text-gray-900 dark:text-white text-center leading-tight">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#050505] transition-colors duration-300 border-t border-gray-100 dark:border-white/5 relative overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50 dark:bg-rose-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Section>
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              
              {/* Left Column: Image */}
              <motion.div 
                variants={fadeUp} 
                className="w-full lg:w-1/2 relative flex justify-center"
              >
                <div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/20 dark:to-rose-800/10 p-6 shadow-2xl shadow-rose-900/5">
                  <div className="absolute inset-0 border-2 border-white/60 dark:border-white/10 rounded-[2.5rem] m-2 pointer-events-none" />
                  
                  {/* Floating Elements Animation wrapper */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src="/how_it_works.png"
                      alt="HizmetBul Nasıl Çalışır 3D Tasarım"
                      fill
                      className="object-contain drop-shadow-2xl scale-[1.15] origin-center"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                    />
                  </motion.div>
                  
                  {/* Decorative Badges on Image */}
                  <div className="absolute -left-6 top-1/4 bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-white/5 hidden md:flex items-center gap-3 animate-float">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                      <Shield size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-900 dark:text-white">Güvenilir</div>
                      <div className="text-[10px] text-gray-500">Onaylı Uzmanlar</div>
                    </div>
                  </div>
                  
                  <div className="absolute -right-8 bottom-1/4 bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-white/5 hidden md:flex items-center gap-3 animate-float-delay">
                    <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
                      <Zap size={20} className="text-rose-600" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-900 dark:text-white">Hızlı</div>
                      <div className="text-[10px] text-gray-500">Komisyonsuz</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Right Column: Steps */}
              <div className="w-full lg:w-1/2">
                <motion.p variants={fadeUp} className="text-rose-600 font-black text-sm uppercase tracking-widest mb-3">
                  Kolay ve Hızlı
                </motion.p>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-12 max-w-lg leading-tight">
                  Sadece 3 Adımda <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">İhtiyacını Çöz.</span>
                </motion.h2>

                <motion.div variants={stagger} className="space-y-8 relative">
                  {/* Connecting Line for Timeline */}
                  <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-gradient-to-b from-rose-200 via-rose-100 to-transparent dark:from-rose-900/50 dark:via-rose-900/20" />
                  
                  {[
                    { n: '01', icon: Search, title: 'Hizmeti ve Şehri Seçin', desc: 'Arama çubuğuna ihtiyacınız olan hizmeti yazın. Kategoriye göre de göz atabilirsiniz.' },
                    { n: '02', icon: Star, title: 'Profilleri Karşılaştırın', desc: 'Gerçek müşteri yorumları, portföy görselleri ve fiyat aralıklarını yan yana inceleyin.' },
                    { n: '03', icon: Phone, title: 'Doğrudan Arayın', desc: 'Hiçbir aracı, mesajlaşma kuyruğu veya teklif bekleme süreci yok. Tek tıkla arayın.' },
                  ].map(({ n, icon: Icon, title, desc }, idx) => (
                    <motion.div
                      key={n}
                      variants={fadeUp}
                      className="relative flex gap-6 group"
                    >
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-14 h-14 bg-white dark:bg-[#0a0a0a] rounded-2xl flex items-center justify-center border-2 border-rose-100 dark:border-rose-900/30 group-hover:bg-rose-600 group-hover:border-rose-600 transition-all duration-300 shadow-lg shadow-rose-100/50 dark:shadow-none">
                          <Icon size={24} className="text-rose-600 dark:text-rose-400 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                      <div className="flex-1 pt-2 pb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-black text-rose-300 dark:text-rose-900/50 group-hover:text-rose-600 dark:group-hover:text-rose-500 transition-colors">{n}</span>
                          <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{title}</h3>
                        </div>
                        <p className="text-gray-500 dark:text-white/60 leading-relaxed font-medium">
                          {desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.div variants={fadeUp} className="mt-8 lg:ml-20">
                  <Link href="/arama" className="inline-flex items-center justify-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-full font-black hover:bg-rose-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-600/30 transition-all w-full sm:w-auto">
                    Hemen Hizmet Ara <ArrowRight size={18} />
                  </Link>
                </motion.div>

              </div>
              
            </div>
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
  const [isFlipped, setIsFlipped] = useState(false);
  const isNew = provider.reviewCount === 0;
  const isPromoted = provider.is_promoted || false;

  return (
    <div 
      className={`group relative [perspective:1000px] w-full ${isPromoted ? 'mt-6' : ''}`}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] [-webkit-transform-style:preserve-3d] cursor-pointer ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT SIDE */}
        <div className="[backface-visibility:hidden] [-webkit-backface-visibility:hidden] relative flex flex-col h-full bg-white dark:bg-black border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[10px_10px_0_0_rgba(3,7,18,1)] dark:group-hover:shadow-[10px_10px_0_0_rgba(255,255,255,1)] overflow-hidden">
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:1rem_1rem] z-0" />

      {isPromoted && (
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-center py-1.5 bg-rose-600 border-b-[3px] border-gray-950 text-white text-[10px] font-black uppercase tracking-[0.2em]">
          ⭐ Sponsorlu
        </div>
      )}

      {/* COVER IMAGE BANNER */}
      <div className={`relative w-full h-28 border-b-[3px] border-gray-950 dark:border-white shrink-0 overflow-hidden bg-rose-600 ${isPromoted ? 'mt-6' : ''}`}>
        {(provider.coverUrl || provider.previewImages?.[0]) ? (
          <Image
            src={provider.coverUrl || provider.previewImages[0]}
            alt="Cover"
            fill
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
            sizes="400px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-700 to-rose-500" />
        )}
        
        {/* Category Label */}
        {provider.category && (
          <div className="absolute top-3 left-3 bg-white dark:bg-black border-[2px] border-gray-950 dark:border-white text-gray-950 dark:text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)] z-10">
            {provider.category}
          </div>
        )}

        {/* Rating Star */}
        <div className="absolute top-3 right-3 bg-amber-400 border-[2px] border-gray-950 px-2 py-1 flex items-center gap-1 text-gray-950 font-black text-sm shadow-[2px_2px_0_0_rgba(3,7,18,1)] z-10">
          <Star size={14} className="fill-gray-950" />
          {isNew ? 'Yeni' : (provider.rating || 0).toFixed(1)}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 relative z-10">
        {/* Avatar and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full border-[3px] border-gray-950 dark:border-white shadow-[4px_4px_0_0_rgba(3,7,18,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] bg-rose-50 overflow-hidden shrink-0 flex items-center justify-center relative">
            <span className="text-xl font-black text-rose-600">{provider.name.charAt(0).toUpperCase()}</span>
            {provider.avatarUrl && (
              <Image 
                src={provider.avatarUrl} 
                alt="" 
                width={64}
                height={64}
                className="absolute inset-0 w-full h-full object-cover" 
                unoptimized={true}
              />
            )}
          </div>
          
          <div className="flex-1 min-w-0 pt-1">
            <h2 className="font-black text-gray-950 dark:text-white text-lg leading-tight truncate group-hover:text-rose-600 transition-colors">
              {provider.name}
            </h2>
            <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mt-1 truncate">
              {provider.jobTitle}
            </p>
          </div>
        </div>

        {/* Finished Jobs & Location */}
        <div className="flex items-center gap-3 mb-4 text-[11px] font-black uppercase text-gray-950 dark:text-white">
          <div className="flex items-center gap-1.5 bg-[#efe6dd] dark:bg-white/10 px-2 py-1.5 border-[2px] border-gray-950 dark:border-white shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)] rounded-md">
            <Users size={12} className="shrink-0" />
            <span>
              {provider.id?.toString().startsWith('db-') 
                ? `${provider.reviewCount || 0} Bitirilen İş` 
                : `${provider.connections?.toLocaleString('tr') || 0} Bağlantı`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-rose-600 shrink-0" />
            <span className="truncate">{[provider.district, provider.city].filter(Boolean).join(', ')}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs font-semibold text-gray-700 dark:text-white/70 line-clamp-2 mb-5 leading-relaxed">
          {provider.description || 'Bu uzman henüz açıklama eklememiş.'}
        </p>

        {/* Tags */}
        {(provider.tags?.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {provider.tags.slice(0, 2).map((t: string) => (
              <span key={t} className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-gray-100 dark:bg-white/10 text-gray-950 dark:text-white border-[2px] border-gray-950 dark:border-white rounded-md shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)]">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Profili İncele Button (Neo-brutalism) */}
        <div className="mt-auto">
          <Link
            href={`/esnaf/${provider.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="group/btn relative flex items-center justify-center w-full h-[46px] bg-rose-600 text-white font-black uppercase tracking-[0.2em] text-[11px] border-[3px] border-gray-950 dark:border-white shadow-[4px_4px_0_0_rgba(3,7,18,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:bg-gray-950 dark:hover:bg-white hover:text-white dark:hover:text-black hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] transition-all duration-200 rounded-md"
          >
            Profili İncele
          </Link>
        </div>
      </div>
      </div>

      {/* BACK SIDE */}
      <div className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col h-full bg-white dark:bg-black border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[10px_10px_0_0_rgba(3,7,18,1)] dark:group-hover:shadow-[10px_10px_0_0_rgba(255,255,255,1)] overflow-hidden p-5">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-10 bg-[linear-gradient(to_right,#e11d48_1px,transparent_1px),linear-gradient(to_bottom,#e11d48_1px,transparent_1px)] bg-[size:1rem_1rem] z-0" />
        
        <div className="relative z-10 flex flex-col h-full">
          {(!provider.reviews || provider.reviews.length === 0) && (!provider.previewImages || provider.previewImages.length === 0) ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center px-2">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950 border-[3px] border-gray-950 dark:border-white rounded-full flex items-center justify-center mb-4 shadow-[4px_4px_0_0_rgba(225,29,72,1)]">
                <Star className="text-rose-600" size={24} />
              </div>
              <h3 className="font-black text-gray-950 dark:text-white text-lg mb-2">Henüz Detay Yok</h3>
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-4">Bu uzmanın henüz bir yorumu veya portföy görseli bulunmuyor. İlk iletişime geçen siz olun!</p>
              <div className="bg-gray-100 dark:bg-white/5 border-[2px] border-gray-950 dark:border-white rounded-md p-3 w-full text-left">
                <p className="text-xs font-bold text-gray-950 dark:text-white line-clamp-3">
                  {provider.about || provider.description || 'Uzman profiline giderek doğrudan iletişime geçebilirsiniz.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {provider.reviews && provider.reviews.length > 0 ? (
                <div className="mb-4 flex-shrink-0">
                  <div className="flex items-center justify-between border-b-[3px] border-gray-950 dark:border-white pb-2 mb-3">
                    <h3 className="font-black text-rose-600 text-sm uppercase tracking-widest">Öne Çıkan Yorum</h3>
                    {provider.reviews[0].rating && (
                      <div className="flex items-center gap-1 bg-amber-400 border-[2px] border-gray-950 px-1.5 py-0.5 rounded shadow-[2px_2px_0_0_rgba(3,7,18,1)]">
                        <Star size={10} className="fill-gray-950 text-gray-950" />
                        <span className="text-[10px] font-black text-gray-950">{provider.reviews[0].rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed italic line-clamp-3">
                    "{provider.reviews[0].comment}"
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-6 h-6 rounded-full border-[2px] border-gray-950 dark:border-white overflow-hidden bg-rose-100 shrink-0">
                      {provider.reviews[0].avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={provider.reviews[0].avatar} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-[10px] font-black text-rose-600">{provider.reviews[0].author.charAt(0)}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-950 dark:text-white bg-gray-100 dark:bg-white/10 border-[2px] border-gray-950 dark:border-white rounded-md px-2 py-1">
                      {provider.reviews[0].author}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-4 flex-shrink-0">
                  <h3 className="font-black text-rose-600 text-sm uppercase tracking-widest border-b-[3px] border-gray-950 dark:border-white pb-2 mb-3">Hakkında</h3>
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed line-clamp-4">
                    {provider.about || provider.description || 'Bu uzman henüz hakkında detaylı bir bilgi girmemiş.'}
                  </p>
                </div>
              )}
              
              {provider.previewImages && provider.previewImages.length > 0 && (
                <div className="flex-1 mt-auto">
                  <h3 className="font-black text-rose-600 text-sm uppercase tracking-widest border-b-[3px] border-gray-950 dark:border-white pb-1 mb-2">Portföy</h3>
                  <div className="grid grid-cols-3 gap-2 h-16 sm:h-20">
                    {provider.previewImages.slice(0, 3).map((img: string, i: number) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={img} className="w-full h-full object-cover border-[2px] border-gray-950 dark:border-white rounded-md shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)]" alt="" />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <Link
            href={`/esnaf/${provider.slug}`}
            onClick={(e) => { e.stopPropagation(); }}
            className="mt-auto flex items-center justify-center w-full h-[46px] bg-gray-950 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-[11px] border-[3px] border-gray-950 dark:border-white shadow-[4px_4px_0_0_rgba(225,29,72,1)] hover:bg-rose-600 hover:text-white hover:border-gray-950 dark:hover:border-white hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0_0_rgba(225,29,72,1)] transition-all rounded-md"
          >
            Profili İncele
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
