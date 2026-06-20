'use client';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import {
  TrendingUp,
  Phone,
  Star,
  Shield,
  Zap,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  Smartphone,
  Check,
  Heart,
  Activity,
  Award
} from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function HizmetVerenPage() {
  return (
    <div className="min-h-screen bg-[#fcfaf8] dark:bg-[#050505] overflow-hidden font-sans selection:bg-rose-500/30">
      
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 text-sm font-black mb-8 shadow-sm">
              <Heart size={14} className="fill-rose-600 text-rose-600" />
              Sıfır Komisyon. Doğrudan Müşteri. Bizim Önceliğimiz.
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
              Teklif ücreti <br />
              ödemekten <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">
                sıkılmadınız mı?
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-white/70 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              HizmetBul, işinizi büyütmeniz için tasarlanmış hepsi bir arada bir araçtır. 
              Müşteriler doğrudan sizi arar, siz sadece işinize odaklanırsınız.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
              <Link
                href="/kayit-ol"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-black text-lg transition-all shadow-xl shadow-rose-600/30 hover:shadow-rose-600/50 hover:-translate-y-1"
              >
                Hemen Ücretsiz Katıl
              </Link>
              <Link
                href="#ozellikler"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 text-gray-900 dark:text-white rounded-full font-black text-lg hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-white/10 transition-all"
              >
                Özellikleri Keşfet
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                {[
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet&clothing=blazerAndShirt',
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayşe&clothing=collarAndSweater',
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet&clothing=overall',
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatma&top=hijab',
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=Can&clothing=blazerAndSweater',
                ].map((src, i) => (
                  <img key={i} src={src} alt="user" className="w-10 h-10 rounded-full border-2 border-[#fcfaf8] dark:border-[#050505] bg-rose-50 shadow-sm" />
                ))}
              </div>
              <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
                <span className="text-gray-900 dark:text-white font-black">12,000+</span> mutlu <br />
                hizmet veren katıldı
              </div>
            </div>
          </motion.div>

          {/* Right Phone Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="flex-1 relative z-10 perspective-1000 flex justify-center lg:justify-end"
          >
            {/* The Phone (Realistic) */}
            <div className="w-[320px] sm:w-[350px] bg-black rounded-[3.5rem] p-2.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_2px_rgba(255,255,255,0.1)_inset] relative rotate-[-2deg] hover:rotate-0 transition-transform duration-500 border-4 border-gray-800">
              
              {/* Dynamic Island */}
              <div className="absolute top-5 inset-x-0 flex justify-center z-50 pointer-events-none">
                <div className="w-28 h-8 bg-black rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset] flex items-center justify-between px-2.5">
                  <div className="w-2 h-2 rounded-full bg-gray-800/80" />
                  <div className="w-3 h-3 rounded-full bg-blue-900/30 flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-blue-400" /></div>
                </div>
              </div>

              {/* Side Buttons */}
              <div className="absolute top-32 -left-[6px] w-1 h-12 bg-gray-800 rounded-l-md shadow-inner" />
              <div className="absolute top-48 -left-[6px] w-1 h-12 bg-gray-800 rounded-l-md shadow-inner" />
              <div className="absolute top-20 -left-[6px] w-1 h-6 bg-gray-800 rounded-l-md shadow-inner" />
              <div className="absolute top-36 -right-[6px] w-1 h-16 bg-gray-800 rounded-r-md shadow-inner" />
              
              {/* Screen Content */}
              <div className="h-full w-full bg-[#fcfaf8] dark:bg-[#111] rounded-[2.8rem] overflow-hidden p-5 pt-12 flex flex-col gap-4 relative">
                
                <div className="flex items-center justify-between mb-2 mt-2">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">Günaydın,</h3>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Ahmet 👋</h3>
                  </div>
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet" className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-rose-50" alt="" />
                </div>

                {/* Big Green/Red Card */}
                <div className="bg-gradient-to-br from-rose-600 to-rose-700 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <p className="text-sm font-bold opacity-90 mb-4">Aylık Kota Kullanımı</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="12" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="12" strokeLinecap="round" strokeDasharray="251" strokeDashoffset="62" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-xl">Sınırsız</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><Phone size={12} /></div>
                        <div>
                          <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Doğrudan Arama</div>
                          <div className="font-black">124</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><Zap size={12} /></div>
                        <div>
                          <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Komisyon</div>
                          <div className="font-black">0 TL</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <h4 className="font-black text-gray-900 dark:text-white text-sm">Haftalık İstatistik</h4>
                  <span className="text-xs font-bold text-rose-600">Detay</span>
                </div>

                {/* Progress bars */}
                <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 shadow-sm space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="flex items-center gap-1.5"><Users size={12} className="text-emerald-500" /> Profil Ziyareti</span>
                      <span className="text-gray-900 dark:text-white">1,245</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[85%] h-full bg-rose-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="flex items-center gap-1.5"><Star size={12} className="text-amber-500" /> Ortalama Puan</span>
                      <span className="text-gray-900 dark:text-white">4.8</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[96%] h-full bg-amber-500 rounded-full" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Floating Leaves / Badges */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -left-6 top-20 bg-white dark:bg-[#111] p-3 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center"><Star size={20} className="text-amber-500 fill-amber-500" /></div>
              <div>
                <div className="text-xs font-bold text-gray-500">Müşteri Puanı</div>
                <div className="font-black text-gray-900 dark:text-white">4.9 / 5.0</div>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute -right-12 bottom-32 bg-white dark:bg-[#111] p-3 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"><Phone size={20} className="text-emerald-600" /></div>
              <div>
                <div className="text-xs font-bold text-gray-500">Yeni Arama</div>
                <div className="font-black text-gray-900 dark:text-white">+24 Bugün</div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ─── FEATURES GRID (Bento Style) ─── */}
      <section id="ozellikler" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Cream */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#f0eadd] rounded-[2rem] p-10 border-2 border-gray-900 shadow-sm relative overflow-hidden group hover:shadow-xl transition-shadow flex flex-col justify-between min-h-[280px]">
            <div className="relative z-10">
              <div className="inline-block bg-[#ffcdd2] text-gray-900 font-black px-3 py-1.5 text-lg rounded-lg mb-4">
                0 TL Komisyon
              </div>
              <p className="text-gray-600 font-medium">Teklif başı ücret veya gizli kesintiler yok. Ne kazanırsanız sizindir.</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-100 transition-opacity">
               <Zap size={100} className="text-gray-900" />
            </div>
            <div className="flex items-center gap-3 mt-8 text-gray-900 font-black relative z-10">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-[#f0eadd] group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </div>
              Daha fazla bilgi
            </div>
          </motion.div>

          {/* Card 2: Black */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#151a25] text-white rounded-[2rem] p-10 shadow-sm relative overflow-hidden group hover:shadow-xl transition-shadow flex flex-col justify-between min-h-[280px]">
            <div className="relative z-10">
              <div className="inline-block bg-white/10 text-white font-black px-3 py-1.5 text-lg rounded-lg mb-4">
                Doğrudan İletişim
              </div>
              <p className="text-gray-400 font-medium">Müşteriler mesajlaşma beklemeden sizi doğrudan telefonunuzdan arar.</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-100 transition-opacity">
               <Phone size={100} className="text-white" />
            </div>
            <div className="flex items-center gap-3 mt-8 text-white font-black relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#f0eadd] flex items-center justify-center text-gray-900 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </div>
              Daha fazla bilgi
            </div>
          </motion.div>

          {/* Card 3: Black */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#151a25] text-white rounded-[2rem] p-10 shadow-sm relative overflow-hidden group hover:shadow-xl transition-shadow flex flex-col justify-between min-h-[280px]">
            <div className="relative z-10">
              <div className="inline-block bg-white/10 text-white font-black px-3 py-1.5 text-lg rounded-lg mb-4">
                Güven Rozeti
              </div>
              <p className="text-gray-400 font-medium">Sertifikalı uzman rozeti ile müşterilere güven verin, işleri kapın.</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-100 transition-opacity">
               <Shield size={100} className="text-white" />
            </div>
            <div className="flex items-center gap-3 mt-8 text-white font-black relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#f0eadd] flex items-center justify-center text-gray-900 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </div>
              Daha fazla bilgi
            </div>
          </motion.div>

          {/* Card 4: Cream */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#f0eadd] rounded-[2rem] p-10 border-2 border-gray-900 shadow-sm relative overflow-hidden group hover:shadow-xl transition-shadow flex flex-col justify-between min-h-[280px]">
            <div className="relative z-10">
              <div className="inline-block bg-[#ffcdd2] text-gray-900 font-black px-3 py-1.5 text-lg rounded-lg mb-4">
                Analitik ve Takip
              </div>
              <p className="text-gray-600 font-medium">Profiliniz kaç kez görüntülendi, kaç tık aldı? Hepsini panoda görün.</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-100 transition-opacity">
               <BarChart3 size={100} className="text-gray-900" />
            </div>
            <div className="flex items-center gap-3 mt-8 text-gray-900 font-black relative z-10">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-[#f0eadd] group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </div>
              Daha fazla bilgi
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─── BENTO GRID / ALL IN ONE ─── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="text-rose-600 dark:text-rose-400 text-sm font-black uppercase tracking-widest mb-4">Size İhtiyacınız Olan Her Şey</div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              İşinizi Büyütmenin <br /> En Akıllı Yolu
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/60 font-medium mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              HizmetBul, potansiyel müşterilerinize görünürlüğünüzü artırır ve gereksiz maliyetleri ortadan kaldırarak kârınızı maksimize eder.
            </p>

            <ul className="space-y-4 mb-10 text-left max-w-md mx-auto lg:mx-0">
              {[
                'Aylık sabit ve şeffaf fiyatlandırma',
                'Bilimselliğe dayalı algoritma ile öne çıkma',
                'Gerçek müşterilerden organik yorumlar',
                '7/24 Kesintisiz destek ekibi'
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-rose-600 stroke-[3]" />
                  </div>
                  <span className="font-bold text-gray-700 dark:text-white/80">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/kayit-ol" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-black text-lg transition-all shadow-lg shadow-rose-600/30 hover:-translate-y-1">
              Özellikleri İncele <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right Bento Grid */}
          <div className="flex-1 w-full relative">
            <div className="grid grid-cols-2 gap-4 auto-rows-[140px]">
              
              {/* Box 1: Circular stat */}
              <div className="col-span-1 row-span-2 bg-white dark:bg-[#0a0a0a] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-xl flex flex-col items-center justify-center text-center">
                <h4 className="text-sm font-black text-gray-500 mb-6 uppercase tracking-wider">Aylık Görüntülenme</h4>
                <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e11d48" strokeWidth="12" strokeLinecap="round" strokeDasharray="251" strokeDashoffset="75" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">12K</span>
                    <span className="text-xs font-bold text-gray-400">Profil Tıklaması</span>
                  </div>
                </div>
                <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold">Düne göre +%12</div>
              </div>

              {/* Box 2: Line chart / number */}
              <div className="bg-white dark:bg-[#0a0a0a] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-lg flex flex-col justify-between">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider">Aktif Müşteriler</h4>
                <div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">320 <span className="text-sm text-gray-400">kişi</span></div>
                  <div className="flex items-end gap-1 h-8">
                    {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                      <div key={i} className="w-full bg-rose-500 rounded-t-sm transition-all" style={{ height: `${h}%`, opacity: i === 6 ? 1 : 0.4 }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Box 3: Small stat */}
              <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[2rem] p-6 text-white shadow-lg shadow-rose-500/20 flex flex-col justify-center">
                <h4 className="text-xs font-black text-white/70 uppercase tracking-wider mb-2">Komisyon Kesintisi</h4>
                <div className="text-4xl font-black mb-1">0 TL</div>
                <div className="w-12 h-1.5 bg-white/30 rounded-full" />
              </div>

              {/* Box 4: Bar chart horizontally */}
              <div className="col-span-2 bg-white dark:bg-[#0a0a0a] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-lg flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Sıralama Puanı</h4>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">98 / 100</div>
                </div>
                <div className="flex gap-2">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center"><TrendingUp size={20} className="text-rose-600" /></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── TRUSTED BY ─── */}
      <section className="border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#050505] py-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
          
          <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
            <div>
              <div className="text-lg font-black text-gray-900 dark:text-white leading-tight">Uzmanlar Tarafından<br/>Güveniliyor</div>
            </div>
            <div className="w-px h-12 bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-gray-900 dark:text-white">4.8</div>
              <div>
                <div className="flex text-amber-400 mb-1"><Star size={12} className="fill-amber-400" /><Star size={12} className="fill-amber-400" /><Star size={12} className="fill-amber-400" /><Star size={12} className="fill-amber-400" /><Star size={12} className="fill-amber-400" /></div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">App Store</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-gray-900 dark:text-white">4.7</div>
              <div>
                <div className="flex text-amber-400 mb-1"><Star size={12} className="fill-amber-400" /><Star size={12} className="fill-amber-400" /><Star size={12} className="fill-amber-400" /><Star size={12} className="fill-amber-400" /><Star size={12} className="fill-amber-400" /></div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Google Play</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pl-0 md:pl-8 md:border-l border-gray-200 dark:border-white/10">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800 dark:text-white italic">"HizmetBul müşteri potansiyelimi değiştirdi!"</p>
              <p className="text-xs font-medium text-gray-500">— Ayşe Yılmaz, Temizlik Firması</p>
            </div>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ayşe&clothing=collarAndSweater" className="w-12 h-12 rounded-full border-2 border-gray-100 bg-rose-50" alt="" />
          </div>

        </div>
      </section>

    </div>
  );
}
