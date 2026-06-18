import Link from 'next/link';
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
  Sparkles,
  Smartphone
} from 'lucide-react';
import HeroCTA from './HeroCTA';

const features = [
  {
    icon: Zap,
    title: '0 TL Komisyon Ücreti',
    desc: 'Başka platformlar yönlendirme ve teklif başı ₺1000+ alır. Biz hiç almıyoruz. Sürpriz ücret yok.',
    highlight: true,
  },
  {
    icon: Phone,
    title: 'Doğrudan Müşteri Araması',
    desc: 'Müşteriler size doğrudan telefonla ulaşır. Mesajlaşma kuyruğu yok, aracı yok, sizi filtreleyen algoritma yok.',
    highlight: false,
  },
  {
    icon: BadgeCheck,
    title: 'Güven Rozeti',
    desc: '"Doğrulanmış Üye" rozeti ile profiliniz öne çıkar. Müşteriler güvenli hisseder, siz daha fazla iş alırsınız.',
    highlight: false,
  },
  {
    icon: Star,
    title: 'İtibar Oluşturun',
    desc: 'Gerçek müşteri yorumları ve puanlarla organik itibar kazanın. İyi iş = daha fazla müşteri.',
    highlight: false,
  },
  {
    icon: BarChart3,
    title: 'Görünürlük & İstatistik',
    desc: 'Profiliniz kaç kez görüntülendi, kaç kez arandınız — tüm veriler şeffaf şekilde panelde.',
    highlight: false,
  },
  {
    icon: Users,
    title: 'Yerel Müşteri Kitlesi',
    desc: 'Şehrinizde hizmet arayan gerçek, niyetli müşterilere ulaşın. Yalnızca alakalı, kaliteli trafik.',
    highlight: false,
  },
];

const plans = [
  {
    name: 'Başlangıç',
    price: '₺299',
    period: '/ ay',
    desc: 'Küçük işletmeler için',
    features: [
      'Temel profil sayfası',
      '10 portföy görseli',
      'Doğrudan arama CTA',
      'Müşteri yorumları',
      'Aylık istatistik raporu',
    ],
    cta: 'Ücretsiz Dene',
    ctaStyle: 'border',
    popular: false,
  },
  {
    name: 'Profesyonel',
    price: '₺599',
    period: '/ ay',
    desc: 'Büyüyen işletmeler için',
    features: [
      'Öncelikli listeleme',
      'Sınırsız portföy görseli',
      '"Doğrulanmış Üye" rozeti',
      'Kategori başında görünürlük',
      'Haftalık detaylı analitik',
      'Öncelikli destek',
    ],
    cta: 'En Popüler Paket',
    ctaStyle: 'filled',
    popular: true,
  },
  {
    name: 'Kurumsal',
    price: '₺1.299',
    period: '/ ay',
    desc: 'Ajanslar ve çoklu şube',
    features: [
      'Her şey Profesyonel\'de +',
      'Çoklu konum profili',
      'API entegrasyonu',
      'Özel profil sayfası tasarımı',
      '7/24 VIP destek',
    ],
    cta: 'Teklif Al',
    ctaStyle: 'border',
    popular: false,
  },
];

const testimonials = [
  {
    name: 'Ahmet Koçak',
    job: 'Temizlik Firması Sahibi, Ankara',
    avatar: 'AK',
    text: 'Diğer platformlarda harcadığım teklif ücretleri ayda ₺2.000\'i geçiyordu. HizmetBul\'da sabit ödüyor ve 3 katı müşteri alıyorum.',
    rating: 5,
  },
  {
    name: 'Seda Yıldırım',
    job: 'Freelance Web Tasarımcı, İstanbul',
    avatar: 'SY',
    text: 'Profilimi oluşturduktan 2 gün sonra ilk müşterim beni aradı. Algoritma oyunu yok, gerçek müşteriler var.',
    rating: 5,
  },
  {
    name: 'Recep Taş',
    job: 'Nakliyat Firması, İzmir',
    avatar: 'RT',
    text: '"Doğrulanmış Üye" rozeti müşterilerimin güvenini çok artırdı. Artık rakiplerimden önce tercih ediliyorum.',
    rating: 5,
  },
];

const comparisonRows = [
  { feature: 'Komisyon & Teklif Ücreti', us: '0 TL', them: '₺1000+ / teklif' },
  { feature: 'Doğrudan müşteri araması', us: '✓', them: '✗ Mesajlaşma zorunlu' },
  { feature: 'Müşteri iletişim bilgileri', us: 'Direkt telefon', them: 'Gizli / Ücretli' },
  { feature: 'Algoritma rekabeti', us: 'Yok', them: 'Var (Ödedikçe öne çıkarsın)' },
  { feature: 'Güven & Şeffaflık', us: 'Güvenli Havuz & Gerçek Fiyatlı Yorumlar', them: 'Güvensiz & Sahte Puanlar' },
];

export const metadata = {
  title: 'Hizmet Veren — HizmetBul',
  description: 'Komisyon ücreti ödemekten sıkılmadınız mı? Doğrudan müşteriye ulaşın.',
};

export default function HizmetVerenPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-300">
      {/* ─── Hero ─── */}
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pt-32 pb-24 noise bg-cover bg-center transition-colors duration-300" style={{ backgroundImage: "url('/images/hizmet_veren_hero.png')" }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/40 dark:bg-[#050505]/60 bg-gradient-to-b from-white/30 via-transparent to-white dark:from-[#050505]/50 dark:to-[#050505] transition-colors duration-300" />
        
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff003c]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ff6b8b]/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ff003c]/5 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff003c]/10 border border-[#ff003c]/20 text-[#ff003c] text-sm font-bold mb-8 shadow-sm backdrop-blur-md">
            <Sparkles size={14} />
            Hizmet Verenler İçin
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight mb-6 tracking-tight transition-colors duration-300">
            Teklif ücreti ödemekten{' '}
            <span className="text-gradient">sıkılmadınız mı?</span>
          </h1>

          <p className="text-xl text-gray-700 dark:text-white/80 mb-4 max-w-3xl mx-auto leading-relaxed font-bold transition-colors duration-300">
            Sabit paket sistemiyle doğrudan müşteriye ulaşın.
          </p>
          <p className="text-base text-gray-500 dark:text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed font-medium transition-colors duration-300">
            Diğer platformlar her teklif için para alır. Siz kazandıkça onlar kazanır. Biz farklı düşünüyoruz: sabit ücret, sınırsız arama, sıfır komisyon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <HeroCTA />
          </div>

          <p className="mt-5 text-xs text-slate-500">
            14 günlük ücretsiz deneme · Kredi kartı gerekmez · İptal her zaman mümkün
          </p>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { value: '12,000+', label: 'Aktif Hizmet Veren', color: 'from-emerald-400 to-teal-500', glow: 'shadow-emerald-500/30', icon: Users },
              { value: '0 TL', label: 'Komisyon', color: 'from-[#ff003c] to-rose-400', glow: 'shadow-[#ff003c]/30', icon: Zap },
              { value: '%100', label: 'Güvenli Ödeme & Yorum', color: 'from-blue-400 to-indigo-500', glow: 'shadow-blue-500/30', icon: Shield },
            ].map((stat) => (
              <div key={stat.label} className="group relative">
                {/* Glow Background */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500 group-hover:duration-200`} />
                
                {/* Card Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-6 bg-white/60 dark:bg-[#050505]/60 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl hover:scale-105 transition-transform duration-300">
                  <div className={`w-10 h-10 mb-3 rounded-full flex items-center justify-center bg-gradient-to-br ${stat.color} shadow-lg ${stat.glow} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon size={18} className="text-white" />
                  </div>
                  <div className={`text-3xl font-black mb-1 bg-clip-text text-transparent bg-gradient-to-br ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-700 dark:text-gray-300 font-bold text-center leading-tight">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Wave Transition ─── */}
      <div className="w-full overflow-hidden leading-[0] bg-white dark:bg-[#050505]">
        <svg
          className="relative block w-[200%] sm:w-full h-[80px] sm:h-[120px] md:h-[150px] animate-[wave_15s_ease-in-out_infinite_alternate]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ transformOrigin: 'center' }}
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z"
            fill="#9a0002"
            opacity=".25"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V120H0Z"
            fill="#9a0002"
            opacity=".5"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V120H0Z"
            fill="#9a0002"
          />
        </svg>
      </div>

      <style>{`
        @keyframes wave {
          0% { transform: scaleX(1); }
          100% { transform: scaleX(1.1); }
        }
      `}</style>

      {/* ─── Features Grid ─── */}
      <section className="pb-24 pt-0 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#9a0002] to-[#c40003] transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 transition-colors duration-300">
              Neden HizmetBul?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto text-lg font-medium transition-colors duration-300">
              Diğer platformların sizi sömürdüğü dönem bitti. İşte fark:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className={`group relative bg-[#ffffff] border rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                    feat.highlight
                      ? 'border-[#ff003c] shadow-xl shadow-black/20 ring-2 ring-[#ff003c]'
                      : 'border-white/20 hover:border-[#ff003c] hover:shadow-lg hover:shadow-black/10'
                  }`}
                >
                  {feat.highlight && (
                    <span className="absolute -top-3 left-6 px-4 py-1 bg-[#ff003c] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md z-10">
                      En Büyük Fark
                    </span>
                  )}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                      feat.highlight
                        ? 'bg-[#9a0002] text-white shadow-lg shadow-[#9a0002]/30'
                        : 'bg-[#9a0002]/10 text-[#9a0002] group-hover:bg-[#9a0002] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#9a0002]/30 ring-1 ring-[#9a0002]/10'
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-black text-[#9a0002] mb-3 transition-colors">{feat.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed transition-colors font-bold">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Comparison Table ─── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 transition-colors">
              HizmetBul vs. Diğer Platformlar
            </h2>
            <p className="text-gray-500 dark:text-white/50 text-lg font-medium transition-colors">Rakamlar açıkça konuşuyor.</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-b from-[#ff003c]/20 dark:from-[#ff003c]/40 to-gray-200 dark:to-white/5 transition-colors duration-300">
            <div className="bg-white dark:bg-[#0a0a0a] rounded-[23px] overflow-hidden shadow-sm transition-colors duration-300">
              <table className="w-full">
                <thead>
                  <tr className="bg-red-50/50 dark:bg-[#ff003c]/10 border-b border-red-100 dark:border-[#ff003c]/20 transition-colors">
                    <th className="px-6 py-6 text-left text-xs font-black text-gray-500 dark:text-white/60 uppercase tracking-widest w-1/3 transition-colors">
                      Özellik
                    </th>
                    <th className="px-6 py-6 text-center text-sm font-black text-[#ff003c] tracking-widest uppercase relative w-1/3 bg-[#ff003c]/5">
                      HizmetBul ✓
                    </th>
                    <th className="px-6 py-6 text-center text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest w-1/3 transition-colors">
                      Diğerleri ✗
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 transition-colors">
                  {comparisonRows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-6 text-sm font-bold text-gray-800 dark:text-white/90 group-hover:dark:text-white transition-colors">{row.feature}</td>
                      <td className="px-6 py-6 text-center text-base font-black text-[#ff003c] bg-[#ff003c]/[0.02]">
                        {row.us}
                      </td>
                      <td className="px-6 py-6 text-center text-sm font-bold text-gray-400 dark:text-white/30 group-hover:dark:text-white/40 transition-colors">{row.them}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 transition-colors">
              Hizmet Verenler Ne Diyor?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white dark:bg-[#050505] border border-slate-100 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-white/70 leading-relaxed mb-4 italic transition-colors">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white transition-colors">{t.name}</div>
                    <div className="text-xs text-slate-500 dark:text-white/40 transition-colors">{t.job}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-500 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-sm font-semibold mb-6">
            <TrendingUp size={14} />
            İşinizi büyütün
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Kazanmaya bugün başlayın.
          </h2>
          <p className="text-emerald-100 mb-8 text-lg max-w-xl mx-auto">
            Uygulamayı indirin, 5 dakikada profilinizi oluşturun ve ilk müşterinizin sizi aramasını bekleyin.
          </p>
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            id="final-playstore-btn"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-emerald-700 font-extrabold text-lg rounded-xl hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl active:scale-95"
          >
            <Smartphone size={24} />
            Google Play Store&apos;dan İndir
            <ArrowRight size={20} />
          </a>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-sm text-emerald-100">
            <span className="flex items-center gap-1.5"><Shield size={14} /> Güvenli ödeme</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> İptal her zaman</span>
            <span className="flex items-center gap-1.5"><Zap size={14} /> 5 dakikada kurulum</span>
          </div>
        </div>
      </section>
    </div>
  );
}
