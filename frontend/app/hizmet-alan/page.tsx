import Link from 'next/link';
import {
  Search,
  Phone,
  Star,
  Shield,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Truck,
  Wrench,
  Code2,
  GraduationCap,
  Car,
  Camera,
  Leaf,
  Heart,
  Scissors,
  PawPrint,
  PartyPopper,
  ChevronRight,
  Zap
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import FaqAccordion from '@/components/FaqAccordion';

export const metadata = {
  title: 'Hizmet Alan — HizmetBul',
  description: 'Güvenilir hizmet verenleri bulun, karşılaştırın ve doğrudan arayın. Teklif beklemeyin.',
};

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Hizmeti ve Şehri Seçin',
    desc: 'Arama çubuğuna ihtiyacınız olan hizmeti yazın. Kategoriye göre de göz atabilirsiniz.',
  },
  {
    icon: Star,
    step: '02',
    title: 'Profilleri Karşılaştırın',
    desc: 'Gerçek müşteri yorumları, portföy görselleri ve fiyat aralıklarını yan yana inceleyin.',
  },
  {
    icon: Phone,
    step: '03',
    title: 'Doğrudan Arayın',
    desc: 'Hiçbir aracı, mesajlaşma kuyruğu veya teklif bekleme süreci yok. Tek tıkla arayın.',
  },
];

const benefits = [
  {
    icon: Star,
    title: 'Gerçek Yorumlar',
    desc: 'Tüm yorumlar gerçek müşterilerden gelir. Sahte yorum ve satın alınmış puan yoktur.',
  },
  {
    icon: Clock,
    title: 'Teklif Beklemeyin',
    desc: 'Diğer platformlarda saatlerce teklif bekliyorsunuz. Burada hizmet vereni kendiniz seçip anında arıyorsunuz.',
  },
  {
    icon: Shield,
    title: 'Param Güvende Sistemi',
    desc: 'Paranız iş bitene kadar güvenli havuz hesabımızda bekler. İşlem sonrası şeffaf fiyat bilgisi ile puan bırakarak diğerlerine rehber olursunuz.',
  },
  {
    icon: Shield,
    title: 'Doğrulanmış Profiller',
    desc: '"Doğrulanmış Üye" rozetli hizmet verenler kimlik ve referans kontrolünden geçmiştir.',
  },
  {
    icon: Phone,
    title: 'Direkt İletişim',
    desc: 'Hizmet verenin telefon numarası profilinde açıkça görünür. Aracı firma veya komisyon yoktur.',
  },
  {
    icon: MapPin,
    title: 'Yerel Hizmet',
    desc: 'Yalnızca kendi şehrinizde ve ilçenizde hizmet veren profesyoneller listelenir.',
  },
];

const categories = [
  { name: 'Temizlik', icon: Sparkles, slug: 'temizlik', count: 284 },
  { name: 'Nakliyat', icon: Truck, slug: 'nakliyat', count: 156 },
  { name: 'Tamirat', icon: Wrench, slug: 'tamirat', count: 312 },
  { name: 'Yazılım & Tasarım', icon: Code2, slug: 'yazilim-tasarim', count: 198 },
  { name: 'Özel Ders', icon: GraduationCap, slug: 'ozel-ders', count: 421 },
  { name: 'Araç Kiralama', icon: Car, slug: 'arac-kiralama', count: 87 },
  { name: 'Fotoğrafçılık', icon: Camera, slug: 'fotografcilik', count: 143 },
  { name: 'Bahçe & Peyzaj', icon: Leaf, slug: 'bahce-peyzaj', count: 67 },
  { name: 'Sağlık & Yaşam', icon: Heart, slug: 'saglik-yasam', count: 112 },
  { name: 'Güzellik & Bakım', icon: Scissors, slug: 'guzellik-bakim', count: 94 },
  { name: 'Evcil Hayvan', icon: PawPrint, slug: 'evcil-hayvan', count: 54 },
  { name: 'Organizasyon & Etkinlik', icon: PartyPopper, slug: 'organizasyon-etkinlik', count: 78 },
];

const faqs = [
  {
    q: 'HizmetBul\'u kullanmak ücretsiz mi?',
    a: 'Evet, hizmet arayanlar için tamamen ücretsizdir. Arama, profil görüntüleme ve uzmanlarla doğrudan iletişime geçme işlemlerinin tamamı için hiçbir ücret veya komisyon ödemezsiniz.',
  },
  {
    q: 'Hizmet veren doğrulanmış mı nasıl anlarım?',
    a: 'Profil sayfasında yeşil renkli "Doğrulanmış Üye" rozeti olan hizmet verenler, sistemimiz tarafından referans kontrolünden geçirilmiş ve onaylanmış kullanıcılardır.',
  },
  {
    q: 'Hizmet veren beni hayal kırıklığına uğratırsa ne yapabilirim?',
    a: 'Hizmet aldıktan sonra uzmanın profiline detaylı bir yorum ve puan bırakabilirsiniz. Müşteri memnuniyetini sağlamayan uzmanların puanı düşer ve görünürlükleri azalır.',
  },
  {
    q: 'Aynı hizmet için birden fazla kişiyi karşılaştırabilir miyim?',
    a: 'Kesinlikle! Arama sonuçlarında tüm hizmet verenleri yan yana görebilir; fiyatlarını, puanlarını, müşteri yorumlarını ve portföylerini kolayca karşılaştırarak en iyi kararı verebilirsiniz.',
  },
  {
    q: 'Uzmanla nasıl iletişime geçeceğim?',
    a: 'Uzmanın profil sayfasına girdiğinizde direkt olarak telefon numarasını görebilir ve tek tuşla arayabilirsiniz. Herhangi bir mesajlaşma trafiği veya teklif süreci beklemenize gerek yoktur.',
  },
  {
    q: 'Ödeme işlemlerini nasıl yapacağım?',
    a: 'Ödemenizi direkt olarak hizmeti aldığınız uzmana, anlaştığınız şekilde (nakit, havale vb.) yaparsınız. HizmetBul sizden ödeme için hiçbir aşamada para veya kredi kartı bilgisi talep etmez.',
  },
  {
    q: 'Aradığım kategoride uzman bulamazsam ne olacak?',
    a: 'Sürekli büyüyen uzman ağımıza her gün yeni profesyoneller katılıyor. Eğer aradığınız özel bir hizmetse, ana sayfadaki arama çubuğunu kullanarak spesifik aramalar da yapabilirsiniz.',
  }
];

export default function HizmetAlanPage() {
  return (
    <div className="min-h-screen bg-[#efe6dd] dark:bg-[#050505] transition-colors duration-300">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pt-32 pb-24 noise bg-cover bg-center" style={{ backgroundImage: "url('/images/hizmet_alan_hero.png')" }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/40 dark:bg-[#050505]/60 bg-gradient-to-b from-white/30 via-transparent to-white dark:from-[#050505]/50 dark:to-[#050505] transition-colors duration-300" />

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff003c]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ff003c]/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff003c]/10 border border-[#ff003c]/20 text-[#ff003c] text-sm font-bold mb-8 backdrop-blur-md">
            <Search size={14} />
            Hizmet Arayanlar İçin
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight tracking-tight mb-8 transition-colors duration-300">
            İhtiyacınız olan hizmeti <br className="hidden md:block" />
            <span className="text-gradient">saniyeler içinde</span> bulun.
          </h1>

          <p className="text-lg md:text-xl text-gray-700 dark:text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-medium transition-colors duration-300">
            Teklif beklemeyin. Güvenilir, yorumlanmış ve doğrulanmış hizmet verenlerden istediğinizi seçin ve direkt arayın.
          </p>

          <div className="w-full max-w-3xl mx-auto mb-10 relative z-20">
            <div className="absolute -inset-1 sm:inset-0 bg-[#ff003c] rounded-full blur opacity-20 sm:opacity-0 transition duration-1000 pointer-events-none"></div>
            <div className="relative">
              <SearchBar />
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-10">
            {[
              { icon: Shield, text: '12K+ Doğrulanmış Uzman' },
              { icon: Star, text: '98K+ Müşteri Yorumu' },
              { icon: MapPin, text: '81 Şehirde Hizmet' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-bold text-gray-700 dark:text-white/70 bg-white/50 dark:bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-gray-200 dark:border-white/10 backdrop-blur-md transition-colors duration-300">
                <Icon size={14} className="text-[#ff003c] sm:w-4 sm:h-4" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#050505] transition-colors duration-300 border-t border-gray-100 dark:border-white/5 relative overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50 dark:bg-rose-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Left Column: Image */}
            <div className="w-full lg:w-1/2 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/20 dark:to-rose-800/10 p-6 shadow-2xl shadow-rose-900/5">
                <div className="absolute inset-0 border-2 border-white/60 dark:border-white/10 rounded-[2.5rem] m-2 pointer-events-none" />
                
                {/* Floating Elements Animation wrapper */}
                <div className="w-full h-full relative animate-[float_6s_ease-in-out_infinite]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/how_it_works.png"
                    alt="HizmetBul Nasıl Çalışır 3D Tasarım"
                    className="w-full h-full object-contain drop-shadow-2xl scale-[1.15] origin-center"
                  />
                </div>
                
                {/* Decorative Badges on Image */}
                <div className="absolute -left-6 top-1/4 bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-white/5 hidden md:flex items-center gap-3 animate-[float_4s_ease-in-out_infinite]">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <Shield size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-gray-900 dark:text-white">Güvenilir</div>
                    <div className="text-[10px] text-gray-500">Onaylı Uzmanlar</div>
                  </div>
                </div>
                
                <div className="absolute -right-8 bottom-1/4 bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-white/5 hidden md:flex items-center gap-3 animate-[float_5s_ease-in-out_infinite_reverse]">
                  <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
                    <Zap size={20} className="text-rose-600" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-gray-900 dark:text-white">Hızlı</div>
                    <div className="text-[10px] text-gray-500">Komisyonsuz</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Steps */}
            <div className="w-full lg:w-1/2">
              <p className="text-rose-600 font-black text-sm uppercase tracking-widest mb-3">
                Kolay ve Hızlı
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-12 max-w-lg leading-tight">
                Sadece 3 Adımda <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">İhtiyacını Çöz.</span>
              </h2>

              <div className="space-y-8 relative">
                {/* Connecting Line for Timeline */}
                <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-gradient-to-b from-rose-200 via-rose-100 to-transparent dark:from-rose-900/50 dark:via-rose-900/20" />
                
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.step} className="relative flex gap-6 group">
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-14 h-14 bg-white dark:bg-[#0a0a0a] rounded-2xl flex items-center justify-center border-2 border-rose-100 dark:border-rose-900/30 group-hover:bg-rose-600 group-hover:border-rose-600 transition-all duration-300 shadow-lg shadow-rose-100/50 dark:shadow-none">
                          <Icon size={24} className="text-rose-600 dark:text-rose-400 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                      <div className="flex-1 pt-2 pb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-black text-rose-300 dark:text-rose-900/50 group-hover:text-rose-600 dark:group-hover:text-rose-500 transition-colors">{step.step}</span>
                          <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{step.title}</h3>
                        </div>
                        <p className="text-gray-500 dark:text-white/60 leading-relaxed font-medium">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 lg:ml-20">
                <Link href="/arama" className="inline-flex items-center justify-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-full font-black hover:bg-rose-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-600/30 transition-all w-full sm:w-auto">
                  Hemen Hizmet Ara <ArrowRight size={18} />
                </Link>
              </div>

            </div>
            
          </div>
        </div>
      </section>

      {/* ─── Why HizmetBul ─── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#9a0002] dark:bg-[#050505] noise transition-colors duration-300 relative text-white">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 transition-colors">
              Neden HizmetBul?
            </h2>
            <p className="text-white/80 max-w-lg mx-auto text-lg transition-colors font-medium">
              Sıradan platformları unutun. Sizin için tasarlandık.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="group relative bg-[#fdfaf7] dark:bg-[#0a0a0a] backdrop-blur-sm border border-white/10 dark:border-white/10 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-white/40 hover:bg-white overflow-hidden shadow-lg"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/20 shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all duration-500">
                    <Icon size={28} className="text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-black text-[#9a0002] mb-3 transition-colors">{b.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed group-hover:text-black transition-colors font-medium">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── NEW SECTION: Security & Warranty ─── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#efe6dd] dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#ffffff] dark:bg-black/50 rounded-[3rem] p-10 md:p-16 border border-rose-900/10 dark:border-white/5 shadow-2xl flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex-1 space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-sm">
                <CheckCircle2 size={16} />
                %100 Memnuniyet Garantisi
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                İşinizi Şansa <br />Bırakmıyoruz.
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                Sistemimizdeki tüm ustalar, referans doğrulamasından geçmiştir. Doğrudan iletişim ve şeffaf müşteri yorumlarıyla en doğru kararı vermenizi sağlıyoruz.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex flex-col gap-2">
                  <Phone size={28} className="text-rose-600" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">7/24 Kesintisiz İletişim</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Ustalarla mesajlaşma sırası beklemeden doğrudan iletişim kurabilir, anında çözüm bulabilirsiniz.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Star size={28} className="text-amber-500" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">Müşteri Puanlı</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sadece işi yaptıranlar yorum yapabilir. Sahte yorum imkansızdır.</p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex justify-center relative z-10">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-tr from-rose-600 to-rose-400 rounded-full flex items-center justify-center p-8 shadow-[0_0_50px_rgba(225,29,72,0.3)] relative">
                <div className="absolute inset-2 border-2 border-white/20 rounded-full animate-[spin_10s_linear_infinite]" />
                <Shield size={120} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categories Browse ─── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#efe6dd] dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-rose-950 dark:text-white mb-4 transition-colors">
              Kategoriye Göre Keşfet
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/arama?kategori=${cat.slug}`}
                  className="group flex flex-col items-center p-8 bg-[#9a0002] dark:bg-white/5 shadow-lg shadow-[#9a0002]/20 border border-rose-500/20 dark:border-white/10 rounded-[2rem] hover:shadow-2xl hover:shadow-[#9a0002]/40 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-20 h-20 flex items-center justify-center rounded-[1.5rem] bg-white/10 backdrop-blur-sm shadow-sm group-hover:bg-white transition-all duration-500 mb-6 group-hover:scale-110 ring-1 ring-white/20 group-hover:ring-white">
                    <Icon size={32} className="text-white group-hover:text-[#9a0002] transition-colors duration-500" />
                  </div>
                  <div className="text-center relative z-10">
                    <div className="text-[15px] font-black text-white leading-tight transition-colors">
                      {cat.name}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#efe6dd] dark:bg-[#050505] noise transition-colors duration-300 border-t border-rose-900/10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-rose-950 dark:text-white mb-4 transition-colors">
              Sık Sorulan Sorular
            </h2>
          </div>
          
          <FaqAccordion faqs={faqs} />
          
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="bg-gradient-to-r from-rose-700 via-rose-600 to-rose-900 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'0.1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Hizmet arayanlar için <br />tamamen ücretsiz.
          </h2>
          <p className="text-white/80 mb-10 text-xl font-medium">
            Kayıt olmaya gerek yok. Arama yapın, profilleri inceleyin, doğrudan arayın.
          </p>
          <Link
            href="/arama"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#ffffff] text-rose-700 font-black text-lg rounded-full hover:bg-gray-100 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
          >
            <Search size={22} />
            Hemen Arama Yap
          </Link>

          <div className="mt-12 pt-12 border-t border-white/20">
            <p className="text-white/70 text-sm mb-4 font-bold">Siz de hizmet veriyor musunuz?</p>
            <Link
              href="/hizmet-veren"
              className="inline-flex items-center gap-2 text-white font-black text-sm hover:text-white/80 transition-colors underline underline-offset-8"
            >
              Hizmet Veren Sayfasına Git
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
