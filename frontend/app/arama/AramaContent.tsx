'use client';
import { API_BASE_URL } from '@/config';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, MapPin, Shield, Phone, X, ChevronDown, Users, CheckCircle2, Info, MessageSquare } from 'lucide-react';
import { districts, categories } from '@/lib/data';
import PixarLoader from '@/components/PixarLoader';
import NeuralBackground from '@/components/ui/flow-field-background';

const ratingOptions = [
  { label: 'Tümü', value: 0 },
  { label: '4.0+', value: 4 },
  { label: '4.5+', value: 4.5 },
  { label: '5.0 Mükemmel', value: 5 },
];

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

/* ── Premium Provider Card ─────────────────────── */
function PeopleCard({
  provider,
  index,
  aiMetrics,
}: {
  provider: any;
  index: number;
  aiMetrics?: {
    score: number;
    sim: number;
    ratingScore: number;
    priceScore: number;
    locationScore: number;
  };
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // DOS saldırısına sebep olduğu için devre dışı bırakıldı.
  }, [provider.id]);

  const trackAction = (action: string) => {
    if (!provider.id.startsWith('db-')) return;
    const dbId = provider.id.replace('db-', '');
    fetch(`${API_BASE_URL}/api/listings/${dbId}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    }).catch(() => {});
  };

  const isNew = provider.reviewCount === 0;
  const isPromoted = provider.is_promoted || false;

  return (
    <motion.article
      variants={scaleIn}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.05 }}
      className={`group relative [perspective:1000px] w-full ${isPromoted ? 'mt-6' : ''}`}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] [-webkit-transform-style:preserve-3d] cursor-pointer ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT SIDE */}
        <div className="[backface-visibility:hidden] [-webkit-backface-visibility:hidden] relative flex flex-col h-full bg-white dark:bg-black border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[10px_10px_0_0_rgba(3,7,18,1)] dark:group-hover:shadow-[10px_10px_0_0_rgba(255,255,255,1)] overflow-hidden">
      {/* Decorative Grid Pattern (Neo-brutalism touch) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:1rem_1rem] z-0" />

      {isPromoted && (
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-center py-1.5 bg-rose-600 border-b-[3px] border-gray-950 text-white text-[10px] font-black uppercase tracking-[0.2em]">
          ⭐ Sponsorlu
        </div>
      )}

      {/* COVER IMAGE BANNER */}
      <div className={`relative w-full h-28 border-b-[3px] border-gray-950 dark:border-white shrink-0 overflow-hidden bg-rose-600 ${isPromoted ? 'mt-6' : ''}`}>
        {provider.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={provider.coverUrl} 
            alt="Cover" 
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-700 to-rose-500" />
        )}
        
        {/* Category Label */}
        <div className="absolute top-3 left-3 bg-white dark:bg-black border-[2px] border-gray-950 dark:border-white text-gray-950 dark:text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)] z-10">
          {provider.category}
        </div>

        {/* Rating Star (Prominent) */}
        <div className="absolute top-3 right-3 bg-amber-400 border-[2px] border-gray-950 px-2 py-1 flex items-center gap-1 text-gray-950 font-black text-sm shadow-[2px_2px_0_0_rgba(3,7,18,1)] z-10">
          <Star size={14} className="fill-gray-950" />
          {isNew ? 'Yeni' : provider.rating.toFixed(1)}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 relative z-10">
        {/* Avatar and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full border-[3px] border-gray-950 dark:border-white shadow-[4px_4px_0_0_rgba(3,7,18,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] bg-rose-50 overflow-hidden shrink-0 flex items-center justify-center relative">
            <span className="text-xl font-black text-rose-600">{provider.name.charAt(0).toUpperCase()}</span>
            {provider.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={provider.avatarUrl} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            )}
          </div>
          
          <div className="flex-1 min-w-0 pt-1">
            <Link href={`/esnaf/${provider.slug}`} onClick={() => trackAction('click')} className="block group/link">
              <h2 className="font-black text-gray-950 dark:text-white text-lg leading-tight truncate group-hover/link:text-rose-600 transition-colors">
                {provider.name}
              </h2>
            </Link>
            <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mt-1 truncate">
              {provider.jobTitle}
            </p>
          </div>
        </div>

        {/* Finished Jobs & Location */}
        <div className="flex items-center gap-3 mb-4 text-[11px] font-black uppercase text-gray-950 dark:text-white">
          <div className="flex items-center gap-1.5 bg-[#efe6dd] dark:bg-white/10 px-2 py-1.5 border-[2px] border-gray-950 dark:border-white shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)] rounded-md">
            <Users size={12} className="shrink-0" />
            <span>{provider.reviewCount} Bitirilen İş</span>
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
        {(provider.subServices?.length > 0 || provider.tags?.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {[...(provider.subServices?.slice(0, 2) || []), ...(provider.tags?.slice(0, 2) || [])].slice(0, 2).map((t: string) => (
              <span key={t} className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-gray-100 dark:bg-white/10 text-gray-950 dark:text-white border-[2px] border-gray-950 dark:border-white rounded-md shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)]">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* AI Score (arama yapılınca) */}
        {aiMetrics && (
          <div className="mb-6 p-2 bg-rose-50 dark:bg-rose-500/10 border-[2px] border-rose-600 rounded-md shadow-[2px_2px_0_0_#e11d48]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-1">
                Akıllı Eşleşme
              </span>
              <span className="text-[11px] font-black text-rose-600">%{Math.round(aiMetrics.score * 100)}</span>
            </div>
            <div className="w-full bg-white dark:bg-black border-[2px] border-rose-600 h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-600 h-full rounded-full"
                style={{ width: `${Math.round(aiMetrics.score * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Profili İncele Button (Neo-brutalism) */}
        <div className="mt-auto">
          <Link
            href={`/esnaf/${provider.slug}`}
            onClick={(e) => { e.stopPropagation(); trackAction('click'); }}
            id={`card-profile-${provider.id}`}
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
        
        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4 space-y-5">
            {(!provider.reviews || provider.reviews.length === 0) && (!provider.previewImages || provider.previewImages.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-2">
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
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-between border-b-[3px] border-gray-950 dark:border-white pb-2 mb-3 sticky top-0 bg-white dark:bg-black z-10">
                      <h3 className="font-black text-rose-600 text-sm uppercase tracking-widest">Yorumlar</h3>
                      <span className="text-[10px] font-black text-gray-950 dark:text-white bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md border-[2px] border-gray-950 dark:border-white">{provider.reviewCount || provider.reviews.length} Değerlendirme</span>
                    </div>
                    <div className="space-y-3">
                      {provider.reviews.slice(0, 3).map((review: any, i: number) => (
                        <div key={i} className="bg-gray-50 dark:bg-white/5 border-[2px] border-gray-950 dark:border-white p-3 rounded-lg shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)]">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full border-[2px] border-gray-950 dark:border-white overflow-hidden bg-rose-100 shrink-0">
                                {review.avatar ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={review.avatar} className="w-full h-full object-cover" alt="" />
                                ) : (
                                  <span className="flex items-center justify-center w-full h-full text-[10px] font-black text-rose-600">{review.author.charAt(0)}</span>
                                )}
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-gray-950 dark:text-white">
                                {review.author}
                              </span>
                            </div>
                            {review.rating && (
                              <div className="flex items-center gap-1 bg-amber-400 border-[2px] border-gray-950 px-1.5 py-0.5 rounded shadow-[2px_2px_0_0_rgba(3,7,18,1)]">
                                <Star size={10} className="fill-gray-950 text-gray-950" />
                                <span className="text-[10px] font-black text-gray-950">{review.rating}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white leading-relaxed italic">
                            "{review.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-shrink-0">
                    <h3 className="font-black text-rose-600 text-sm uppercase tracking-widest border-b-[3px] border-gray-950 dark:border-white pb-2 mb-3 sticky top-0 bg-white dark:bg-black z-10">Hakkında</h3>
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed">
                      {provider.about || provider.description || 'Bu uzman henüz hakkında detaylı bir bilgi girmemiş.'}
                    </p>
                  </div>
                )}
                
                {provider.previewImages && provider.previewImages.length > 0 && (
                  <div className="flex-shrink-0">
                    <h3 className="font-black text-rose-600 text-sm uppercase tracking-widest border-b-[3px] border-gray-950 dark:border-white pb-1 mb-3 sticky top-0 bg-white dark:bg-black z-10">Portföy</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {provider.previewImages.slice(0, 6).map((img: string, i: number) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={img} className="w-full aspect-square object-cover border-[2px] border-gray-950 dark:border-white rounded-md shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)]" alt="" />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <Link
            href={`/esnaf/${provider.slug}`}
            onClick={(e) => { e.stopPropagation(); trackAction('click'); }}
            className="shrink-0 mt-2 flex items-center justify-center w-full h-[46px] bg-gray-950 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-[11px] border-[3px] border-gray-950 dark:border-white shadow-[4px_4px_0_0_rgba(225,29,72,1)] hover:bg-rose-600 hover:text-white hover:border-gray-950 dark:hover:border-white hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0_0_rgba(225,29,72,1)] transition-all rounded-md"
          >
            Profili İncele
          </Link>
        </div>
      </div>
      </div>
    </motion.article>
  );
}

/* ────────────────────────────────── Arama & Algoritma Yardımları ────────────────────────────────── */
const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i');
};
const getMainCategory = (service: string): string => {
  const norm = normalizeText(service);
  
  if (norm.includes('web') || norm.includes('yazilim') || norm.includes('kodlama') || norm.includes('tasarim') || norm.includes('logo') || norm.includes('grafik') || norm.includes('seo') || norm.includes('dijital pazarlama') || norm.includes('sosyal medya') || norm.includes('developer') || norm.includes('programlama') || norm.includes('site') || norm.includes('uygulama') || norm.includes('internet') || norm.includes('e-ticaret') || norm.includes('eticaret')) {
    return 'Yazılım & Tasarım';
  }
  if (norm.includes('temizlik') || norm.includes('hali yikama') || norm.includes('hijyen') || norm.includes('koltuk yikama') || norm.includes('temizlikci') || norm.includes('steril') || norm.includes('yikama')) {
    return 'Temizlik';
  }
  if (norm.includes('nakliyat') || norm.includes('nakliye') || norm.includes('tasima') || norm.includes('lojistik') || norm.includes('kamyon') || norm.includes('kargo') || norm.includes('nakil')) {
    return 'Nakliyat';
  }
  if (norm.includes('matematik') || norm.includes('ingilizce') || norm.includes('fizik') || norm.includes('kimya') || norm.includes('turkce') || norm.includes('sinav') || norm.includes('yks') || norm.includes('lgs') || norm.includes('ogretmen') || norm.includes('egitmen') || norm.includes('kurs') || norm.includes('egitim') || norm.includes('ders') || norm.includes('okul')) {
    return 'Özel Ders';
  }
  if (norm.includes('tamir') || norm.includes('tadilat') || norm.includes('elektrik') || norm.includes('tesisat') || norm.includes('boya') || norm.includes('badana') || norm.includes('marangoz') || norm.includes('mobilya') || norm.includes('klima') || norm.includes('usta') || norm.includes('montaj') || norm.includes('onarim') || norm.includes('dekorasyon') || norm.includes('kombi') || norm.includes('parke') || norm.includes('fayans')) {
    return 'Tamirat';
  }
  if (norm.includes('fotograf') || norm.includes('video') || norm.includes('cekim') || norm.includes('kamera') || norm.includes('dugun') || norm.includes('klip') || norm.includes('kameraman') || norm.includes('kurgu') || norm.includes('edit')) {
    return 'Fotoğrafçılık';
  }
  if (norm.includes('araba') || norm.includes('arac') || norm.includes('kiralama') || norm.includes('oto') || norm.includes('rent')) {
    return 'Araç Kiralama';
  }
  if (norm.includes('bahce') || norm.includes('peyzaj') || norm.includes('cicek') || norm.includes('tarim') || norm.includes('bitki') || norm.includes('tarimsal') || norm.includes('fidan')) {
    return 'Bahçe & Peyzaj';
  }
  if (norm.includes('diyet') || norm.includes('diyetisyen') || norm.includes('psikolog') || norm.includes('danisman') || norm.includes('danismanlik') || norm.includes('saglik') || norm.includes('terapi') || norm.includes('pt') || norm.includes('antrenor') || norm.includes('spor') || norm.includes('klinik') || norm.includes('fizik tedavi') || norm.includes('fizyoterapist')) {
    return 'Sağlık & Yaşam';
  }
  if (norm.includes('guzellik') || norm.includes('bakim') || norm.includes('kuafor') || norm.includes('berber') || norm.includes('makyaj') || norm.includes('manikur') || norm.includes('pedikur') || norm.includes('agda') || norm.includes('epilasyon') || norm.includes('tirnak') || norm.includes('sac') || norm.includes('estetik')) {
    return 'Güzellik & Bakım';
  }
  if (norm.includes('pet') || norm.includes('sitter') || norm.includes('hayvan') || norm.includes('kopek') || norm.includes('kedi') || norm.includes('veteriner') || norm.includes('gezdirme') || norm.includes('mama')) {
    return 'Evcil Hayvan';
  }
  if (norm.includes('organizasyon') || norm.includes('davet') || norm.includes('catering') || norm.includes('yemek') || norm.includes('asci') || norm.includes('mutfak') || norm.includes('kinas') || norm.includes('kina') || norm.includes('nisan') || norm.includes('parti') || norm.includes('etkinlik') || norm.includes('dogum gunu')) {
    return 'Organizasyon & Etkinlik';
  }
  
  return 'Diğer';
};

const normalizeImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE_URL}/storage/${url}`;
};

const mapDbListingToProvider = (listing: any) => {
  const nameSlug = normalizeText(listing.user?.name || 'uzman').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return {
    id: `db-${listing.id}`,
    slug: `${nameSlug}-${listing.id}`,
    name: listing.user?.name || 'Anonim',
    category: getMainCategory(listing.service || 'Diğer'),
    categoryIcon: 'Sparkles',
    city: listing.city || listing.user?.city || 'Belirtilmemiş',
    district: listing.district || listing.user?.district || '',
    phone: listing.user?.phone || '',
    rating: listing.rating !== undefined ? Number(listing.rating) : 0.0,
    reviewCount: listing.reviewCount !== undefined ? Number(listing.reviewCount) : 0,
    avgPricePaid: listing.avg_price_paid || null,
    gamificationLevel: listing.gamification_level || 'Çırak',
    gamificationXp: listing.gamification_xp || 0,
    gamificationNextXp: listing.gamification_next_xp || null,
    verified: true,
    description: listing.description || '',
    about: listing.process || listing.description || '',
    previewImages: listing.cover_image ? [normalizeImageUrl(listing.cover_image)] : [],
    portfolioImages: (listing.portfolio_images && listing.portfolio_images.length > 0) 
      ? listing.portfolio_images.map(normalizeImageUrl) 
      : [],
    tags: listing.tags || [],
    subServices: listing.sub_services || [],
    priceRange: listing.price_range || 'Fiyat Belirtilmemiş',
    minPrice: listing.price_range ? Number(listing.price_range.replace(/\./g, '').match(/\d+/g)?.[0] || 0) : 0,
    maxPrice: listing.price_range ? Number(listing.price_range.replace(/\./g, '').match(/\d+/g)?.[1] || listing.price_range.replace(/\./g, '').match(/\d+/g)?.[0] || 0) : 0,
    experience: listing.experience || 'Yeni Başlayan',
    avatarUrl: normalizeImageUrl(listing.user?.avatar),
    coverUrl: normalizeImageUrl(listing.cover_image),
    jobTitle: listing.title || listing.service || '',
    connections: listing.reviewCount !== undefined ? Number(listing.reviewCount) : 0,
    reviews: listing.reviews || [],
    is_promoted: listing.is_promoted === true || listing.is_promoted === 1 || listing.is_promoted === '1',
  };
};

/* ── AI Ranking Engine Semantic Search Setup ── */
const SYNONYM_GROUPS: Record<string, string[]> = {
  yazilim: ['yazilim', 'programlama', 'kodlama', 'yazilimci', 'developer', 'bilisim', 'gelistirici'],
  web: ['web', 'site', 'tasarim', 'tasarimci', 'yazilim', 'internet', 'e-ticaret', 'eticaret', 'portfolyo'],
  yemek: ['restoran', 'lokanta', 'yemek', 'kafe', 'cafe', 'gida', 'mutfak', 'kebap', 'fastfood', 'asci', 'borek', 'lahmacun'],
  temizlik: ['temizlik', 'temizlikci', 'gundelikci', 'hijyen', 'steril', 'yikama', 'hali', 'koltuk'],
  arac: ['arac', 'oto', 'rent', 'car', 'araba', 'kiralama', 'kiralik', 'rentacar'],
  nakliyat: ['nakliyat', 'nakliye', 'tasima', 'tasimacilik', 'nakliyeci', 'lojistik', 'kamyon', 'nakil'],
  tadilat: ['tadilat', 'dekorasyon', 'boya', 'badana', 'usta', 'tesisat', 'elektrik', 'tesisatci', 'elektrikci', 'montaj', 'tamir', 'onarim', 'parke', 'fayans'],
  tasarim: ['grafik', 'logo', 'afis', 'brosur', 'tasarimci', 'designer', 'photoshop', 'ui', 'ux', 'cizim', 'illustrasyon', 'tasarim'],
  pazarlama: ['sosyal', 'medya', 'dijital', 'pazarlama', 'reklam', 'seo', 'google', 'ads', 'instagram', 'facebook', 'yonetim', 'danismanlik'],
  fotograf: ['fotograf', 'video', 'dugun', 'cekim', 'fotografci', 'kameraman', 'kurgu', 'edit', 'klip', 'kamera'],
  ders: ['ozel', 'ders', 'matematik', 'ingilizce', 'sinav', 'hazirlik', 'ogretmen', 'egitmen', 'kurs', 'egitim', 'fizik', 'kimya', 'turkce'],
  guzellik: ['guzellik', 'bakim', 'sac', 'makyaj', 'kuafor', 'berber', 'manikur', 'pedikur', 'estetik', 'epilasyon', 'tirnak']
};

interface Vector { [key: string]: number }

function getSemanticVector(text: string): Vector {
  const vec: Vector = {};
  const normalized = normalizeText(text);
  const words = normalized.split(/[^a-z0-9]+/i).filter(Boolean);

  words.forEach(w => {
    // 1. Add literal word if it's not a tiny stopword
    if (w.length >= 2) {
      vec[w] = (vec[w] || 0) + 1.0;
    }

    // 2. Check synonym mapping
    if (w.length >= 3) {
      for (const [groupKey, synonyms] of Object.entries(SYNONYM_GROUPS)) {
        const isExactSynonym = synonyms.includes(w);
        
        // Check prefix overlap (e.g. "temizligi" starts with "temiz" / groupKey "temizlik" starts with w "temizli")
        // Minimum length 4 for prefix matching to prevent short root overlap
        const isPrefixMatch = w.length >= 4 && (
          groupKey.startsWith(w) || w.startsWith(groupKey) ||
          synonyms.some(syn => syn.length >= 4 && (syn.startsWith(w) || w.startsWith(syn)))
        );

        if (isExactSynonym || isPrefixMatch) {
          vec[groupKey] = (vec[groupKey] || 0) + 1.5;
        }
      }
    }
  });

  return vec;
}

function getProviderVector(p: any): Vector {
  const categoryVec = getSemanticVector(p.category || '');
  const jobTitleVec = getSemanticVector(p.jobTitle || '');
  const descriptionVec = getSemanticVector(p.description || '');
  const aboutVec = getSemanticVector(p.about || '');
  const tagsVec = getSemanticVector((p.tags || []).join(' '));
  const locationVec = getSemanticVector(`${p.city || ''} ${p.district || ''}`);

  const vec: Vector = {};
  const addWeighted = (subVec: Vector, weight: number) => {
    for (const [k, v] of Object.entries(subVec)) {
      vec[k] = (vec[k] || 0) + v * weight;
    }
  };

  addWeighted(categoryVec, 3.0);
  addWeighted(jobTitleVec, 2.5);
  addWeighted(tagsVec, 1.5);
  addWeighted(locationVec, 3.0);
  addWeighted(descriptionVec, 0.8);
  addWeighted(aboutVec, 0.6);

  return vec;
}

function cosineSimilarity(vecA: Vector, vecB: Vector, searchTerm?: string, providerFullText?: string): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const key in vecA) {
    dotProduct += vecA[key] * (vecB[key] || 0);
    normA += vecA[key] * vecA[key];
  }
  for (const key in vecB) {
    normB += vecB[key] * vecB[key];
  }

  if (normA === 0 || normB === 0) return 0;
  
  // Use a modified cosine similarity that penalizes long texts much less, 
  // but use Math.max(15, normB) to prevent tiny texts from getting 100% artificially
  let rawSim = dotProduct / (Math.sqrt(normA) * Math.pow(Math.max(15, normB), 0.4));
  rawSim = Math.min(1.0, rawSim);

  // Exact word match penalty
  if (searchTerm && providerFullText) {
    const originalWords = normalizeText(searchTerm).split(/[^a-z0-9]+/i).filter(w => w.length >= 3);
    if (originalWords.length > 0) {
      let matches = 0;
      originalWords.forEach(w => {
        if (providerFullText.includes(w)) matches++;
      });
      const matchRatio = matches / originalWords.length;
      // If 0 matches, drops to 50%. If 100% matches, stays 100%.
      rawSim = rawSim * (0.5 + (0.5 * matchRatio));
    }
  }

  return rawSim;
}

/* ── AI Price Suitability & Category Averages ── */
const parsePrice = (p: any): number => {
  if (p.avg_price_paid && Number(p.avg_price_paid) > 0) return Number(p.avg_price_paid);
  return 0;
};

const getCategoryAveragePrices = (providersList: any[]): Record<string, number> => {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  providersList.forEach(p => {
    const category = p.category || p.service || 'Diğer';
    const price = parsePrice(p);
    if (price > 0) {
      sums[category] = (sums[category] || 0) + price;
      counts[category] = (counts[category] || 0) + 1;
    }
  });

  const averages: Record<string, number> = {};
  for (const cat in sums) {
    averages[cat] = sums[cat] / counts[cat];
  }
  return averages;
};

const getCategoryAverage = (averages: Record<string, number>, category: string): number => {
  if (averages[category] && averages[category] > 0) {
    return averages[category];
  }
  const fallbacks: Record<string, number> = {
    'Temizlik': 525,
    'Yazılım & Tasarım': 13750,
    'Nakliyat': 2000,
    'Tamirat': 675,
    'Özel Ders': 300,
    'Fotoğrafçılık': 2900,
  };
  return fallbacks[category] || 1000;
};

const getPriceSuitability = (price: number, avgPrice: number): number => {
  if (price <= 0 || avgPrice <= 0) return 0.5; // If no data, neutral score
  if (price <= avgPrice) return 1.0; // Cheaper than or equal to average is perfect
  return Math.max(0.1, avgPrice / price); // Higher price drops linearly
};

/* ── Location Closeness Score ── */
const getLocationScore = (
  p: any,
  filterCity: string,
  filterDistrict: string,
  userCity: string,
  userDistrict: string,
  searchTerm: string
): number => {
  if (filterCity) {
    const cityMatch = normalizeText(p.city) === normalizeText(filterCity);
    if (!cityMatch) return 0;
    if (filterDistrict) {
      return normalizeText(p.district) === normalizeText(filterDistrict) ? 1.0 : 0.6;
    }
    return 0.8;
  }
  
  if (userCity) {
    const cityMatch = normalizeText(p.city) === normalizeText(userCity);
    if (cityMatch) {
      if (userDistrict && normalizeText(p.district) === normalizeText(userDistrict)) {
        return 1.0;
      }
      return 0.8;
    }
  }

  return 0.5;
};

/* ── Hybrid Score Matrix ── */
const getHybridScore = (
  p: any,
  queryVec: Vector | null,
  avgPrice: number,
  filterCity: string,
  filterDistrict: string,
  userCity: string,
  userDistrict: string,
  searchTerm: string
): { score: number; sim: number; ratingScore: number; priceScore: number; locationScore: number } => {
  let sim = 1.0;
  if (queryVec) {
    const providerVec = getProviderVector(p);
    const fullText = normalizeText(`${p.jobTitle} ${p.category} ${p.description} ${p.about} ${(p.tags||[]).join(' ')}`);
    sim = cosineSimilarity(queryVec, providerVec, searchTerm, fullText);
  }

  const ratingScore = p.rating ? p.rating / 5.0 : 0.8;
  const price = parsePrice(p);
  const priceScore = getPriceSuitability(price, avgPrice);
  const locationScore = getLocationScore(p, filterCity, filterDistrict, userCity, userDistrict, searchTerm);

  let gamificationScore = 0;
  if (p.gamificationLevel === 'Efsane Usta') gamificationScore = 0.4;
  else if (p.gamificationLevel === 'Usta') gamificationScore = 0.25;
  else if (p.gamificationLevel === 'Kalfa') gamificationScore = 0.1;

  // Score = (Sim * 0.6) + (Puan * 0.15) + (FiyatUygunlugu * 0.15) + (KonumYakinligi * 0.10) + (Oyunlaştırma Bonusu)
  let score = (sim * 0.6) + (ratingScore * 0.15) + (priceScore * 0.15) + (locationScore * 0.1) + gamificationScore;
  score = Math.min(1.0, score);

  return { score, sim, ratingScore, priceScore, locationScore };
};

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */
export default function AramaContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get('sehir') || '';
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const [minRating, setMinRating] = useState(0);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchMinPrice, setSearchMinPrice] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dbProviders, setDbProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCity, setUserCity] = useState('');
  const [userDistrict, setUserDistrict] = useState('');

  // Fetch logged in user details to personalize sorting by location closeness
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.city) setUserCity(u.city);
        if (u.district) setUserDistrict(u.district);
      }
    } catch (e) {
      console.error('Error fetching user location context:', e);
    }
  }, []);

  useEffect(() => {
    // Hizli gosterim (Cache)
    const cachedListings = localStorage.getItem('arama_cached_listings');
    if (cachedListings) {
      const parsed = JSON.parse(cachedListings);
      setDbProviders(parsed.map(mapDbListingToProvider));
      setIsLoading(false);
    }

    fetch(`${API_BASE_URL}/api/listings/public?t=${Date.now()}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
      .then(async res => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("API response parsing failed:", e);
          return { success: false, listings: [] };
        }
      })
      .then(data => {
        if (data && data.success && data.listings) {
          localStorage.setItem('arama_cached_listings', JSON.stringify(data.listings));
          const mapped = data.listings.map(mapDbListingToProvider);
          setDbProviders(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const allProviders = dbProviders;

  const categoryAverages = useMemo(() => {
    return getCategoryAveragePrices(allProviders);
  }, [allProviders]);

  const cityDistricts = city ? (districts[city] || []) : [];

  const filtered = useMemo(() => {
    const baseFiltered = allProviders.filter(p => {
      if (minRating > 0 && p.rating < minRating) return false;
      if (city && city !== 'Tüm Şehirler' && normalizeText(p.city) !== normalizeText(city)) return false;
      if (selectedDistrict && selectedDistrict !== 'Tüm İlçeler' && normalizeText(p.district) !== normalizeText(selectedDistrict)) return false;
      if (selectedCategory && selectedCategory !== 'Tüm Kategoriler' && p.category !== selectedCategory) return false;
      
      const sMin = Number(searchMinPrice) || 0;
      const sMax = Number(searchMaxPrice) || 0;
      if (sMin > 0 && p.maxPrice > 0 && p.maxPrice < sMin) return false;
      if (sMax > 0 && p.minPrice > 0 && p.minPrice > sMax) return false;
      
      return true;
    });

    const queryVec = query.trim() !== '' ? getSemanticVector(query) : null;

    const scored = baseFiltered.map(p => {
      const avgPrice = getCategoryAverage(categoryAverages, p.category);
      const metrics = getHybridScore(
        p,
        queryVec,
        avgPrice,
        city,
        selectedDistrict,
        userCity,
        userDistrict,
        query
      );
      return {
        provider: p,
        metrics
      };
    });

    let result = scored;
    if (queryVec) {
      // Filter out providers with very low semantic similarity or very low total score
      result = scored.filter(item => item.metrics.sim > 0.15 && item.metrics.score >= 0.50);
    }

    // Sort descending: Promoted items ALWAYS on top
    if (query.trim() === '') {
      result.sort((a, b) => {
        if (a.provider.is_promoted !== b.provider.is_promoted) {
          return a.provider.is_promoted ? -1 : 1;
        }
        if (b.provider.reviewCount !== a.provider.reviewCount) {
          return b.provider.reviewCount - a.provider.reviewCount;
        }
        return b.provider.rating - a.provider.rating;
      });
    } else {
      result.sort((a, b) => {
        if (a.provider.is_promoted !== b.provider.is_promoted) {
          return a.provider.is_promoted ? -1 : 1;
        }
        return b.metrics.score - a.metrics.score;
      });
    }

    return result;
  }, [allProviders, minRating, city, selectedDistrict, selectedCategory, query, categoryAverages, userCity, userDistrict, searchMinPrice, searchMaxPrice]);

  const activeFilters = [minRating > 0, city !== '', selectedDistrict !== '', searchMinPrice !== '', searchMaxPrice !== ''].filter(Boolean).length;
  const clearFilters = () => { setMinRating(0); setCity(''); setSelectedDistrict(''); setSelectedCategory(''); setSearchMinPrice(''); setSearchMaxPrice(''); };

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-[#050505] overflow-hidden">
      
      <NeuralBackground 
        className="!fixed !inset-0 !h-screen !w-screen"
        color="#e11d48"
        trailOpacity={0.15}
        particleCount={800}
        speed={1.0}
      />

      <div className="relative z-10 flex flex-col h-full">
      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 pt-24 pb-8">
        
        {/* Search & Filters */}
        <div className="bg-white dark:bg-[#111] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mb-8 flex flex-col lg:flex-row gap-4 relative z-20">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Hizmet veya uzman ara... (Örn: Boya Badana, İngilizce Özel Ders)" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/50 transition-all border border-transparent focus:border-rose-500/30 dark:text-white"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 sm:flex-none">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500" size={16} />
              <select 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                className="w-full sm:w-auto pl-10 pr-8 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/50 transition-all border border-transparent text-gray-700 dark:text-gray-300 min-w-[150px] appearance-none"
              >
                <option value="">Tüm Şehirler</option>
                {Object.keys(districts).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
            
            <div className="relative flex-1 sm:flex-none">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto pl-10 pr-8 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/50 transition-all border border-transparent text-gray-700 dark:text-gray-300 min-w-[170px] appearance-none"
              >
                <option value="">Tüm Kategoriler</option>
                <option value="Temizlik">Temizlik</option>
                <option value="Nakliyat">Nakliyat</option>
                <option value="Tamirat">Tamirat & İnşaat</option>
                <option value="Yazılım & Tasarım">Yazılım & Tasarım</option>
                <option value="Özel Ders">Özel Ders</option>
                <option value="Fotoğrafçılık">Fotoğrafçılık</option>
                <option value="Araç Kiralama">Araç Kiralama</option>
                <option value="Bahçe & Peyzaj">Bahçe & Peyzaj</option>
                <option value="Sağlık & Yaşam">Sağlık & Yaşam</option>
                <option value="Güzellik & Bakım">Güzellik & Bakım</option>
                <option value="Evcil Hayvan">Evcil Hayvan</option>
                <option value="Organizasyon & Etkinlik">Organizasyon & Etkinlik</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
            
            <div className="relative flex-1 sm:flex-none">
              <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500" size={16} />
              <select 
                value={minRating} 
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full sm:w-auto pl-10 pr-8 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/50 transition-all border border-transparent text-gray-700 dark:text-gray-300 min-w-[140px] appearance-none"
              >
                <option value={0}>Tüm Puanlar</option>
                <option value={4.5}>4.5+ Puan</option>
                <option value={4.0}>4.0+ Puan</option>
                <option value={3.0}>3.0+ Puan</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-rose-950 dark:text-white transition-colors">
              {query ? `"${query}"` : 'Tüm Uzmanlar'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/50 mt-0.5 transition-colors">
              <span className="font-bold text-rose-600">{filtered.length}</span> uzman bulundu
              {city && <span className="ml-1">· {city}</span>}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-rose-900/60 dark:text-white/50 transition-colors font-bold">
            <span>Sıralama:</span>
            {query.trim() !== '' ? (
              <div className="font-black text-rose-700 dark:text-rose-400 flex items-center gap-1 bg-[#ffffff] dark:bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-900/10 shadow-sm text-xs select-none">
                🤖 Yapay Zeka (AI Engine)
              </div>
            ) : (
              <div className="font-black text-amber-700 dark:text-amber-400 flex items-center gap-1 bg-[#ffffff] dark:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-rose-900/10 shadow-sm text-xs select-none">
                🔥 En Çok İş Yapanlar
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="py-24">
            <PixarLoader fullScreen={false} />
          </div>
        ) : filtered.length > 0 ? (
        <div className="flex-1 w-full max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map(({ provider, metrics }, i) => (
                <PeopleCard key={provider.id} provider={provider} index={i} aiMetrics={query.trim() !== '' ? metrics : undefined} />
              ))}
            </AnimatePresence>
          </div>
        </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-5 transition-colors">
              <Users size={32} className="text-gray-300 dark:text-white/20" />
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2 transition-colors">Uzman bulunamadı</h3>
            <p className="text-sm text-gray-500 dark:text-white/50 mb-6 max-w-xs transition-colors">
              Farklı bir arama terimi deneyin veya filtreleri sıfırlayın.
            </p>
            <button
              onClick={() => { clearFilters(); setQuery(''); }}
              className="px-6 py-3 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 transition-colors active:scale-95"
            >
              Tümünü Göster
            </button>
          </motion.div>
        )}

        {/* Bottom CTA */}
        {filtered.length > 0 && (
          <div className="mt-12 p-8 bg-[#050505] rounded-3xl text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckCircle2 size={18} className="text-rose-400" />
              <p className="text-white font-bold">Siz de hizmet veriyor musunuz?</p>
            </div>
            <p className="text-white/40 text-sm mb-5">Profilinizi oluşturun, müşteriler sizi doğrudan arasın.</p>
            <Link
              href="/hizmet-veren"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-sm transition-all active:scale-95"
            >
              Ücretsiz Profil Oluştur
            </Link>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
