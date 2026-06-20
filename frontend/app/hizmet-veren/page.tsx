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
  Award,
  Eye,
  MessageCircle,
  MessageSquare,
  Plus,
  User,
  Home
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
            className="flex-1 relative z-10 flex justify-center lg:justify-end"
          >
            {/* The Phone (3D Realistic) */}
            <div 
              className="w-[320px] sm:w-[340px] h-[680px] bg-[#d4d4d8] rounded-[3.5rem] p-[6px] shadow-[-20px_20px_30px_0px_rgba(0,0,0,0.3),-10px_10px_0px_0px_#9ca3af] relative transition-transform duration-700 ease-out group hover:scale-[1.02]" 
              style={{ transform: 'perspective(1200px) rotateY(20deg) rotateX(10deg) rotateZ(-2deg)', transformStyle: 'preserve-3d' }}
            >
              {/* Outer Bezel Buttons */}
              <div className="absolute top-32 -left-[4px] w-1 h-12 bg-[#71717a] rounded-l-md shadow-inner" style={{ transform: 'translateZ(-1px)' }} />
              <div className="absolute top-48 -left-[4px] w-1 h-12 bg-[#71717a] rounded-l-md shadow-inner" style={{ transform: 'translateZ(-1px)' }} />
              <div className="absolute top-20 -left-[4px] w-1 h-6 bg-[#71717a] rounded-l-md shadow-inner" style={{ transform: 'translateZ(-1px)' }} />

              {/* Black Bezel & Screen Wrapper */}
              <div className="w-full h-full bg-black rounded-[3.2rem] p-2 relative shadow-[inset_0_0_0_2px_#3f3f46]">
                
                {/* Dynamic Island */}
                <div className="absolute top-4 inset-x-0 flex justify-center z-50 pointer-events-none">
                  <div className="w-28 h-8 bg-black rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset] flex items-center justify-between px-2.5">
                    <div className="w-2 h-2 rounded-full bg-gray-800/80" />
                    <div className="w-3 h-3 rounded-full bg-blue-900/30 flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-blue-400" /></div>
                  </div>
                </div>
                
                {/* Screen Content */}
                <div className="h-full w-full bg-[#fcfaf8] dark:bg-[#111] rounded-[2.8rem] overflow-hidden px-5 pt-14 pb-0 flex flex-col relative">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 mt-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-500 leading-none mb-1">Günaydın,</h3>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">Ahmet 👋</h3>
                    </div>
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet" className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-rose-50" alt="" />
                  </div>

                  {/* Big Red Card */}
                  <div className="bg-gradient-to-br from-rose-500 to-rose-700 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <p className="text-sm font-bold opacity-90 mb-4">Bugünkü Performans</p>
                    
                    <div className="flex items-center gap-6">
                      {/* Circular Progress */}
                      <div className="relative w-24 h-24 shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                          <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="10" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="66" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">75%</div>
                      </div>

                      {/* Stats List */}
                      <div className="flex flex-col gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          <Eye size={14} className="text-rose-200" />
                          <div>
                            <div className="font-black text-sm leading-none">1,245</div>
                            <div className="text-[9px] text-rose-200 font-bold uppercase tracking-wider">Tık</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle size={14} className="text-rose-200" />
                          <div>
                            <div className="font-black text-sm leading-none">24</div>
                            <div className="text-[9px] text-rose-200 font-bold uppercase tracking-wider">Mesaj</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star size={14} className="text-rose-200" />
                          <div>
                            <div className="font-black text-sm leading-none">4.9</div>
                            <div className="text-[9px] text-rose-200 font-bold uppercase tracking-wider">Puan</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Goals Header */}
                  <div className="flex items-center justify-between mt-6 mb-3">
                    <h4 className="font-black text-gray-900 text-sm">Aylık Hedefler</h4>
                    <span className="text-xs font-bold text-rose-600 cursor-pointer">Düzenle</span>
                  </div>

                  {/* Goals List */}
                  <div className="flex flex-col gap-3 pb-24 overflow-y-auto hide-scrollbar">
                    {/* Goal 1 */}
                    <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <TrendingUp size={18} className="text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-end mb-1.5">
                          <div>
                            <div className="text-xs font-black text-gray-900">Aylık Ciro</div>
                            <div className="text-[10px] font-bold text-gray-400">85B ₺ / 100B ₺</div>
                          </div>
                          <span className="text-xs font-black text-emerald-500">85%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Goal 2 */}
                    <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={18} className="text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-end mb-1.5">
                          <div>
                            <div className="text-xs font-black text-gray-900">Tamamlanan İş</div>
                            <div className="text-[10px] font-bold text-gray-400">15 / 20 İş</div>
                          </div>
                          <span className="text-xs font-black text-blue-500">75%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="w-[75%] h-full bg-blue-500 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Goal 3 */}
                    <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                        <Star size={18} className="text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-end mb-1.5">
                          <div>
                            <div className="text-xs font-black text-gray-900">Müşteri Puanı</div>
                            <div className="text-[10px] font-bold text-gray-400">4.8 / 5.0</div>
                          </div>
                          <span className="text-xs font-black text-amber-500">96%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="w-[96%] h-full bg-amber-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="absolute bottom-0 inset-x-0 h-20 bg-white border-t border-gray-100 flex items-center justify-between px-6 z-20 rounded-b-[2.8rem] shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                    <div className="flex flex-col items-center gap-1 text-rose-600">
                      <Home size={20} className="fill-rose-600" />
                      <span className="text-[9px] font-bold">Ana Sayfa</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <BarChart3 size={20} />
                      <span className="text-[9px] font-bold">Analitik</span>
                    </div>
                    <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-600/40 -translate-y-4 border-4 border-[#fcfaf8]">
                      <Plus size={24} />
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <MessageSquare size={20} />
                      <span className="text-[9px] font-bold">Mesajlar</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <User size={20} />
                      <span className="text-[9px] font-bold">Profil</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─── FEATURES GRID (Bento Style) ─── */}
      <section id="ozellikler" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Red (was Cream) */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-gradient-to-br from-rose-500 to-rose-700 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden group hover:-translate-y-1 hover:shadow-rose-600/20 transition-all flex flex-col justify-between min-h-[280px]">
            <div className="relative z-10">
              <div className="inline-block bg-white/20 text-white font-black px-3 py-1.5 text-lg rounded-lg mb-4 backdrop-blur-sm">
                0 TL Komisyon
              </div>
              <p className="text-white/80 font-medium">Teklif başı ücret veya gizli kesintiler yok. Ne kazanırsanız sizindir.</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
               <Zap size={100} className="text-white" />
            </div>
            <div className="flex items-center gap-3 mt-8 text-white font-black relative z-10">
              <div className="w-10 h-10 rounded-full bg-white text-rose-600 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </div>
              Daha fazla bilgi
            </div>
          </motion.div>

          {/* Card 2: Black */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#0a0a0a] text-white rounded-[2rem] p-8 shadow-xl border border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[280px]">
            <div className="relative z-10">
              <div className="inline-block bg-white/10 text-white font-black px-3 py-1.5 text-lg rounded-lg mb-4">
                Doğrudan İletişim
              </div>
              <p className="text-gray-400 font-medium">Müşteriler mesajlaşma beklemeden sizi doğrudan telefonunuzdan arar.</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
               <Phone size={100} className="text-white" />
            </div>
            <div className="flex items-center gap-3 mt-8 text-white font-black relative z-10">
              <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform shadow-lg shadow-rose-600/20">
                <ArrowRight size={18} />
              </div>
              Daha fazla bilgi
            </div>
          </motion.div>

          {/* Card 3: Black */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#0a0a0a] text-white rounded-[2rem] p-8 shadow-xl border border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[280px]">
            <div className="relative z-10">
              <div className="inline-block bg-white/10 text-white font-black px-3 py-1.5 text-lg rounded-lg mb-4">
                Güven Rozeti
              </div>
              <p className="text-gray-400 font-medium">Sertifikalı uzman rozeti ile müşterilere güven verin, işleri kapın.</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
               <Shield size={100} className="text-white" />
            </div>
            <div className="flex items-center gap-3 mt-8 text-white font-black relative z-10">
              <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform shadow-lg shadow-rose-600/20">
                <ArrowRight size={18} />
              </div>
              Daha fazla bilgi
            </div>
          </motion.div>

          {/* Card 4: Red (was Cream) */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-gradient-to-br from-rose-500 to-rose-700 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden group hover:-translate-y-1 hover:shadow-rose-600/20 transition-all flex flex-col justify-between min-h-[280px]">
            <div className="relative z-10">
              <div className="inline-block bg-white/20 text-white font-black px-3 py-1.5 text-lg rounded-lg mb-4 backdrop-blur-sm">
                Analitik ve Takip
              </div>
              <p className="text-white/80 font-medium">Profiliniz kaç kez görüntülendi, kaç tık aldı? Hepsini panoda görün.</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
               <BarChart3 size={100} className="text-white" />
            </div>
            <div className="flex items-center gap-3 mt-8 text-white font-black relative z-10">
              <div className="w-10 h-10 rounded-full bg-white text-rose-600 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </div>
              Daha fazla bilgi
            </div>
          </motion.div>

          {/* Card 5: New Black */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-[#0a0a0a] text-white rounded-[2rem] p-8 shadow-xl border border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[280px]">
            <div className="relative z-10">
              <div className="inline-block bg-white/10 text-white font-black px-3 py-1.5 text-lg rounded-lg mb-4">
                Özel Profil Sayfası
              </div>
              <p className="text-gray-400 font-medium">Hizmetlerinizi, portföyünüzü ve yeteneklerinizi sergileyebileceğiniz premium vitrin.</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
               <User size={100} className="text-white" />
            </div>
            <div className="flex items-center gap-3 mt-8 text-white font-black relative z-10">
              <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform shadow-lg shadow-rose-600/20">
                <ArrowRight size={18} />
              </div>
              Daha fazla bilgi
            </div>
          </motion.div>

          {/* Card 6: New Red */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-gradient-to-br from-rose-500 to-rose-700 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden group hover:-translate-y-1 hover:shadow-rose-600/20 transition-all flex flex-col justify-between min-h-[280px]">
            <div className="relative z-10">
              <div className="inline-block bg-white/20 text-white font-black px-3 py-1.5 text-lg rounded-lg mb-4 backdrop-blur-sm">
                7/24 Akıllı Destek
              </div>
              <p className="text-white/80 font-medium">Müşterilerinizle aranızda pürüz çıkarsa, anında müdahale eden akıllı asistan yanınızda.</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
               <MessageSquare size={100} className="text-white" />
            </div>
            <div className="flex items-center gap-3 mt-8 text-white font-black relative z-10">
              <div className="w-10 h-10 rounded-full bg-white text-rose-600 flex items-center justify-center group-hover:translate-x-1 transition-transform">
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
