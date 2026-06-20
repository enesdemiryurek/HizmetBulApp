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
import PeopleCard from '@/components/PeopleCard';

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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white dark:to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <Section className="">
            <div className="flex items-end justify-between mb-10">
              <div>
                <motion.p variants={fadeUp} className="text-rose-600 dark:text-rose-400 font-bold text-sm uppercase tracking-widest mb-2">
                  Öne Çıkan Uzmanlar
                </motion.p>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white leading-tight transition-colors">
                  Sizin için<br />seçtiklerimiz
                </motion.h2>
              </div>
              <motion.div variants={fadeUp}>
                <Link
                  href="/arama"
                  className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors group"
                >
                  Tümünü Gör
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Provider grid — LinkedIn style */}
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayProviders.map((p, i) => (
                <motion.div key={p.id} variants={scaleIn}>
                  <PeopleCard provider={p} index={i} />
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
                <Link href="/arama" className="flex items-center gap-2 text-sm font-black text-white hover:text-rose-100 transition-colors group px-6 py-3 bg-rose-600 rounded-full shadow-lg hover:shadow-rose-600/30 hover:-translate-y-0.5">
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
                      className="group flex flex-col items-center justify-center gap-3 p-4 rounded-[2rem] bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-600/20 transition-all duration-300 cursor-pointer w-[140px] sm:w-[150px] h-[140px] sm:h-[150px]"
                    >
                      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-900/20 group-hover:bg-rose-600 transition-colors duration-300">
                        <Icon size={24} className="text-rose-600 dark:text-rose-400 group-hover:text-white transition-colors" />
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

