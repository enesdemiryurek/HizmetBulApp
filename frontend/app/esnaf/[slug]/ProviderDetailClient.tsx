'use client';
import { API_BASE_URL } from '@/config';

import { useState, useEffect, useRef } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star, MapPin, Shield, Phone, Clock, Award, ChevronLeft, ChevronRight, ChevronDown,
  CheckCircle2, Calendar, Users, Share2, Bookmark, Send, MessageSquare, Camera, X, Sparkles
} from 'lucide-react';
import { providers } from '@/lib/data';
import PixarLoader from '@/components/PixarLoader';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

function Stars({ rating, size = 14, onClick }: { rating: number; size?: number; onClick?: (r: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          onClick={() => onClick && onClick(i + 1)}
          className={`${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
            i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}
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
    rawId: listing.id,
    userId: listing.user?.id || null,
    slug: `${nameSlug}-${listing.id}`,
    name: listing.user?.name || 'Anonim',
    category: getMainCategory(listing.service || 'Diğer'),
    categoryIcon: 'Sparkles',
    city: listing.city || listing.user?.city || 'Belirtilmemiş',
    district: listing.district || listing.user?.district || '',
    phone: listing.user?.phone || '',
    avgPricePaid: listing.avg_price_paid || null,
    gamificationLevel: listing.gamification_level || 'Çırak',
    gamificationXp: listing.gamification_xp || 0,
    gamificationNextXp: listing.gamification_next_xp || null,
    rating: listing.rating !== undefined ? Number(listing.rating) : 0,
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
    experience: listing.experience || 'Yeni Başlayan',
    avatarUrl: normalizeImageUrl(listing.user?.avatar),
    coverUrl: normalizeImageUrl(listing.cover_image),
    jobTitle: listing.title || listing.service || '',
    connections: listing.reviewCount !== undefined ? Number(listing.reviewCount) : 0,
    reviewCount: listing.reviewCount !== undefined ? Number(listing.reviewCount) : (listing.reviews ? listing.reviews.length : 0),
    reviews: listing.reviews || [],
  };
};

export default function ProviderDetailClient({ slug }: { slug: string }) {
  const staticProvider = providers.find(p => p.slug === slug);
  const [provider, setProvider] = useState<any | null>(staticProvider || null);
  const [loading, setLoading] = useState(!staticProvider);
  const [error, setError] = useState('');
  const [similarProviders, setSimilarProviders] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  
  // Review form states
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', price_paid: '' });
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [reviewImagePreviews, setReviewImagePreviews] = useState<string[]>([]);
  const reviewFileInputRef = useRef<HTMLInputElement>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isMobileLeftSidebarOpen, setIsMobileLeftSidebarOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [offerForm, setOfferForm] = useState({ detail: '', price: '' });
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('auth_token'));
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setCurrentUser(JSON.parse(userStr));
        }
      } catch (e) {
        console.error('Error parsing current user:', e);
      }
    }
  }, []);

  useEffect(() => {
    let listingIdStr: string | null = null;
    if (slug.startsWith('db-')) {
      listingIdStr = slug.replace('db-', '');
    } else {
      const match = slug.match(/-(\d+)$/);
      if (match) {
        listingIdStr = match[1];
      } else if (/^\d+$/.test(slug)) {
        listingIdStr = slug;
      }
    }

    if (listingIdStr) {
      fetch(`${API_BASE_URL}/api/listings/public/${listingIdStr}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.listing) {
            const mappedProvider = mapDbListingToProvider(data.listing);
            setProvider(mappedProvider);
            
            // Profil görüntülenmesini arka plana bildir
            fetch(`${API_BASE_URL}/api/listings/${data.listing.id}/track`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'view' })
            }).catch(() => {}); // Hata olursa yut

            // Fetch similar providers
            fetch(`${API_BASE_URL}/api/listings/public`)
              .then(res => res.json())
              .then(allData => {
                if (allData.success && allData.listings) {
                  const similar = allData.listings
                    .filter((l: any) => l.id !== data.listing.id && getMainCategory(l.service) === mappedProvider.category)
                    .slice(0, 4)
                    .map(mapDbListingToProvider);
                  setSimilarProviders(similar);
                }
              })
              .catch(console.error);

            // Fetch AI Summary if there are reviews
            if (data.listing.reviews && data.listing.reviews.length > 0) {
              setAiSummaryLoading(true);
              fetch(`${API_BASE_URL}/api/ai/summarize-reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviews: data.listing.reviews })
              })
                .then(res => res.json())
                .then(summaryData => {
                  if (summaryData.success && summaryData.summary) {
                    setAiSummary(summaryData.summary);
                  }
                })
                .catch(console.error)
                .finally(() => setAiSummaryLoading(false));
            }
          } else {
            setError('Hizmet ilanı bulunamadı.');
          }
        })
        .catch((e) => {
          console.error("Provider fetch error:", e);
          setError('Sunucuya bağlanılamadı: ' + e.message);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [slug]);

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push('/giris-yap');
      return;
    }
    setSubmittingOffer(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver_id: provider.userId,
          body: `OFFER|${offerForm.price}|${offerForm.detail}`
        })
      });

      if (res.ok) {
        setIsOfferModalOpen(false);
        router.push(`/mesajlar?to=${provider.userId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingOffer(false);
    }
  };

  if (loading) return (
    <div className="flex-1 flex flex-col pt-24 bg-white dark:bg-[#050505]">
      <PixarLoader fullScreen={false} />
    </div>
  );

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-[#f9f8f6] dark:bg-[#050505] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-2">{error || 'Profil bulunamadı.'}</h2>
        <Link href="/arama" className="mt-4 px-5 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors">
          Aramaya Dön
        </Link>
      </div>
    );
  }

  const handleReviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setReviewImages(prev => [...prev, ...files]);
      const newPreviews = files.map(f => URL.createObjectURL(f));
      setReviewImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeReviewImage = (index: number) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
    setReviewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (reviewForm.comment.trim().length < 3) {
      setReviewError('Yorum en az 3 karakter olmalıdır.');
      return;
    }
    if (!reviewForm.price_paid || Number(reviewForm.price_paid) <= 0) {
      setReviewError('Lütfen ödediğiniz tutarı geçerli bir sayı olarak girin.');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');

    try {
      const fd = new FormData();
      fd.append('rating', reviewForm.rating.toString());
      fd.append('comment', reviewForm.comment);
      if (reviewForm.price_paid) {
        fd.append('price_paid', reviewForm.price_paid);
      }
      reviewImages.forEach(file => {
        fd.append('images[]', file);
      });

      const res = await fetch(`${API_BASE_URL}/api/listings/${provider.rawId}/reviews`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: fd
      });

      const data = await res.json();
      if (!res.ok) {
        setReviewError(data.message || 'Yorum gönderilirken hata oluştu.');
        setSubmittingReview(false);
        return;
      }

      // Append new review, recalculate rating and count dynamically on client side
      const newReview = data.review;
      setProvider((prev: any) => {
        const updatedReviews = [newReview, ...prev.reviews];
        const newCount = updatedReviews.length;
        const newRating = updatedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / newCount;
        return {
          ...prev,
          reviews: updatedReviews,
          reviewCount: newCount,
          rating: newRating,
          connections: newCount
        };
      });

      // Clear form
      setReviewForm({ rating: 5, comment: '', price_paid: '' });
      setReviewImages([]);
      setReviewImagePreviews([]);
    } catch {
      setReviewError('Sunucuya bağlanılamadı.');
    }
    setSubmittingReview(false);
  };

  let listingIdStrCheck: string | null = null;
  if (slug.startsWith('db-')) {
    listingIdStrCheck = slug.replace('db-', '');
  } else {
    const match = slug.match(/-(\d+)$/);
    if (match) listingIdStrCheck = match[1];
  }
  const isDb = listingIdStrCheck !== null;
  const isOwner = currentUser && provider && Number(currentUser.id) === Number(provider.userId);

  return (
    <div className="min-h-screen bg-[#f9f8f6] dark:bg-[#050505] transition-colors duration-300">
      {/* Cover */}
      <div className="relative h-56 md:h-72 bg-gradient-to-br from-rose-900 to-[#1a0010] overflow-hidden">
        {provider.coverUrl && (
          <img
            src={provider.coverUrl}
            alt="Cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <div className="absolute top-20 left-4 sm:left-8">
          <Link
            href="/arama"
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-semibold bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all"
          >
            <ChevronLeft size={15} /> Geri
          </Link>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20">
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">

          {/* Left Sidebar */}
          <aside className="w-full lg:w-[280px] xl:w-[320px] shrink-0 order-2 lg:order-1">
            <div className="lg:hidden mb-4">
              <button 
                onClick={() => setIsMobileLeftSidebarOpen(!isMobileLeftSidebarOpen)}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-white/10 font-bold shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Award className="text-rose-500" size={20} />
                  <span>Seviye ve Hakkında</span>
                </div>
                <ChevronDown className={`transition-transform duration-300 ${isMobileLeftSidebarOpen ? 'rotate-180' : ''}`} size={20} />
              </button>
            </div>
            
            <div className={`sticky top-24 space-y-5 ${!isMobileLeftSidebarOpen ? 'hidden lg:block' : ''}`}>
              {/* Gamification Card */}
              {provider.id.startsWith('db-') && provider.gamificationLevel && (
                <motion.div custom={0.5} variants={fadeUp} initial="hidden" animate="show" className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl border border-amber-200/50 dark:border-amber-700/30 p-6 shadow-sm overflow-hidden relative">
                  <div className="absolute -right-4 -top-4 text-8xl opacity-10 filter blur-sm">
                    {provider.gamificationLevel === 'Çırak' ? '🛠️' : provider.gamificationLevel === 'Kalfa' ? '⚒️' : provider.gamificationLevel === 'Usta' ? '🔨' : '👑'}
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30 border-2 border-white dark:border-black shrink-0">
                        {provider.gamificationLevel === 'Çırak' ? '🛠️' : provider.gamificationLevel === 'Kalfa' ? '⚒️' : provider.gamificationLevel === 'Usta' ? '🔨' : '👑'}
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-0.5">Hizmet Seviyesi</div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">{provider.gamificationLevel}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-amber-600/70 dark:text-amber-400/70 uppercase tracking-widest mb-0.5">Mevcut Deneyim Puanı</div>
                      <div className="text-xl font-black text-amber-600 dark:text-amber-400">{provider.gamificationXp} XP</div>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 dark:text-white/40 mb-1.5">
                      <span>{provider.gamificationXp} XP</span>
                      <span>{provider.gamificationNextXp ? `${provider.gamificationNextXp} XP (Sonraki Seviye)` : 'Maksimum Seviye'}</span>
                    </div>
                    <div className="h-2.5 w-full bg-amber-100 dark:bg-black/40 rounded-full overflow-hidden border border-amber-200/50 dark:border-amber-900/50">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${provider.gamificationNextXp ? Math.min(100, Math.round((provider.gamificationXp / provider.gamificationNextXp) * 100)) : 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Hakkında */}
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className="bg-white dark:bg-black border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] p-6 lg:p-8">
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4">Hakkında</h2>
                <p className="text-gray-600 dark:text-white/70 leading-relaxed">{provider.about}</p>
                <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-gray-100 dark:border-white/10">
                  {[
                    { label: 'Deneyim', value: provider.experience },
                    provider.avgPricePaid ? { label: 'Ortalama Fiyat', value: `₺${provider.avgPricePaid}` } : null,
                    { label: 'Konum', value: [provider.district, provider.city].filter(Boolean).join(', ') },
                  ].filter(Boolean).map((item: any) => (
                    <div key={item.label}>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-white/30 mb-1">{item.label}</div>
                      <div className="text-sm font-bold text-gray-800 dark:text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-5 order-1 lg:order-2">

            {/* Profile header */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className="bg-white dark:bg-black border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] p-6 lg:p-8">
              <div className="flex items-end justify-between mb-4">
                <div className="relative">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-black shadow-xl bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white font-black text-3xl relative">
                    {provider.name.charAt(0).toUpperCase()}
                    {provider.avatarUrl && (
                      <img 
                        src={provider.avatarUrl} 
                        alt={provider.name} 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        className="absolute inset-0 w-full h-full object-cover" 
                      />
                    )}
                  </div>
                  {provider.verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-rose-600 rounded-xl flex items-center justify-center ring-2 ring-white dark:ring-black shadow-md">
                      <Shield size={14} className="text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <button className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-white/70 transition-colors"><Bookmark size={16} /></button>
                  <button className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-white/70 transition-colors"><Share2 size={16} /></button>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight mb-1">{provider.name}</h1>
              <p className="text-base text-gray-600 dark:text-white/60 font-semibold mb-3">{provider.jobTitle}</p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-white/40 mb-5 pb-5 border-b border-gray-100 dark:border-white/10">
                <span className="flex items-center gap-1.5"><MapPin size={13} className="text-rose-500" />{[provider.district, provider.city].filter(Boolean).join(', ')}</span>
                <span className="flex items-center gap-1.5">
                  <Users size={13} />
                  {isDb ? `${provider.reviewCount} bitirilen iş` : `${provider.connections.toLocaleString('tr')} bağlantı`}
                </span>
                <span className="flex items-center gap-1.5"><Award size={13} />{provider.avgPricePaid ? `Ort. ₺${provider.avgPricePaid}` : 'Belirtilmemiş'}</span>
              </div>

              {provider.avgPricePaid && (
                <div className="mb-5 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 border border-emerald-100 dark:border-emerald-800/30 p-3 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Award size={16} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Gerçekleşen Ortalama İşlem Ücreti</div>
                    <div className="text-lg font-black text-emerald-900 dark:text-emerald-100">{provider.avgPricePaid} TL</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-5">
                <Stars rating={provider.rating} size={16} />
                <span className="font-black text-xl text-gray-900 dark:text-white">
                  {provider.rating > 0 ? provider.rating.toFixed(1) : 'Yeni'}
                </span>
                {provider.rating > 0 && (
                  <span className="text-sm text-gray-400">({provider.reviewCount} değerlendirme)</span>
                )}
                {provider.verified && (
                  <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 px-3 py-1.5 rounded-full">
                    <Shield size={11} className="fill-rose-500 text-rose-500" /> Doğrulanmış Üye
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {provider.subServices?.map((t: string) => (
                  <span key={t} className="px-3 py-1.5 text-xs font-bold bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-full hover:bg-rose-100 dark:hover:bg-rose-500/30 transition-colors cursor-default">{t}</span>
                ))}
                {provider.tags?.map((t: string) => (
                  <span key={t} className="px-3 py-1.5 text-xs font-bold bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white/70 rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-400 transition-colors cursor-default">{t}</span>
                ))}
              </div>
            </motion.div>

            {/* Mobile CTA Buttons (Visible only on mobile) */}
            <div className="lg:hidden bg-white dark:bg-black border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] p-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-2 mb-1">
                  {provider.rating > 0 ? provider.rating.toFixed(1) : 'Yeni'} <Star size={24} className="fill-amber-400 text-amber-400" />
                </div>
                <p className="text-sm text-gray-500">{provider.reviewCount} müşteri değerlendirmesi</p>
              </div>

              <a
                href={`tel:${provider.phone}`}
                id="detail-call-btn-mobile"
                className="w-full flex items-center justify-center gap-3 py-4 bg-rose-600 text-white font-black text-lg border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] transition-all mb-3"
              >
                <Phone size={22} /> Doğrudan Ara
              </a>

              {provider.userId && (
                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-white dark:bg-black text-gray-950 dark:text-white font-black text-lg border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] hover:bg-gray-100 dark:hover:bg-gray-900 hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] transition-all mb-3"
                >
                  <MessageSquare size={22} /> Teklif Ver
                </button>
              )}
              <p className="text-center text-xs text-gray-400 mb-5">
                <span className="font-bold text-gray-600 dark:text-white/60">{provider.phone}</span>
              </p>

              <div className="space-y-2.5">
                {['Komisyon yok, direkt iletişim', 'Doğrulanmış hizmet veren', 'Teklif beklemenize gerek yok', 'Gerçek müşteri yorumları'].map(b => (
                  <div key={b} className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                    <CheckCircle2 size={14} className="text-rose-500 shrink-0" /> {b}
                  </div>
                ))}
              </div>
            </div>


            {/* Portfolio */}
            {provider.portfolioImages && provider.portfolioImages.length > 0 && (
              <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show" className="bg-white dark:bg-black border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] p-6 lg:p-8">
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4">Portföy</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {provider.portfolioImages.map((src: string, i: number) => (
                    <div key={i} onClick={() => setLightboxImage(src)} className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer bg-gray-100 dark:bg-white/5">
                      <Image src={src} alt={`Çalışma ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="30vw" unoptimized={true} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-opacity">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/><path d="M11 8v6"/></svg>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="bg-white dark:bg-black border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-gray-900 dark:text-white">Müşteri Değerlendirmeleri</h2>
                <span className="text-sm text-gray-400 font-bold">{provider.reviewCount} yorum</span>
              </div>

              {/* AI Summary Banner */}
              {provider.reviewCount > 0 && (aiSummaryLoading || aiSummary) && (
                <div className="mb-6 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/10 dark:to-fuchsia-900/10 border-[2px] border-violet-200 dark:border-violet-500/20 rounded-2xl p-5 shadow-[4px_4px_0_0_rgba(139,92,246,0.15)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-violet-600 dark:text-violet-400" />
                    <h3 className="text-sm font-black text-violet-900 dark:text-violet-300">Yapay Zeka Müşteri Özeti</h3>
                  </div>
                  {aiSummaryLoading ? (
                    <div className="space-y-2 animate-pulse">
                      <div className="h-3 bg-violet-200/50 dark:bg-violet-800/30 rounded w-full"></div>
                      <div className="h-3 bg-violet-200/50 dark:bg-violet-800/30 rounded w-5/6"></div>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-violet-800 dark:text-violet-200/80 leading-relaxed">
                      {aiSummary}
                    </p>
                  )}
                </div>
              )}

              {provider.reviewCount > 0 ? (
                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 mb-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center shrink-0">
                      <div className="text-5xl font-black text-gray-900 dark:text-white leading-none">{(provider.rating || 0).toFixed(1)}</div>
                      <Stars rating={provider.rating || 0} size={13} />
                      <div className="text-xs text-gray-400 mt-1">{provider.reviewCount} yorum</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map(s => {
                        const count = provider.reviews.filter((r: any) => r.rating === s).length;
                        const pct = provider.reviewCount > 0 ? Math.round((count / provider.reviewCount) * 100) : 0;
                        return (
                          <div key={s} className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-2">{s}</span>
                            <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ delay: 0.5 + s * 0.08, duration: 0.8, ease: 'easeOut' }}
                                className="h-full bg-amber-400 rounded-full"
                              />
                            </div>
                            <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 text-center text-gray-500 dark:text-white/40 mb-6">
                  Henüz müşteri değerlendirmesi yapılmamış. İlk yorumu siz yapın!
                </div>
              )}

              {/* Review Input Form for logged in users on DB Listings */}
              {isDb && (
                <div className="mb-6 p-5 bg-white dark:bg-black border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[4px_4px_0_0_rgba(3,7,18,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)]">
                  <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest border-b-[2px] border-gray-950 dark:border-white pb-2 mb-4">Değerlendirme Yazın</h3>
                  {token ? (
                    isOwner ? (
                      <div className="text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-500/5 dark:bg-rose-500/10 p-3 rounded-xl border border-rose-500/10 dark:border-rose-500/20">
                        Kendi hizmet ilanınıza yorum yapamazsınız.
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        {reviewError && (
                          <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30 p-3 rounded-xl text-xs font-bold">
                            {reviewError}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500 dark:text-white/40">Puanınız:</span>
                          <Stars rating={reviewForm.rating} size={18} onClick={r => setReviewForm({ ...reviewForm, rating: r })} />
                        </div>

                        <div className="relative">
                          <label className="block text-xs font-bold text-gray-500 dark:text-white/40 mb-1">Ne Kadar Ödediniz?</label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              value={reviewForm.price_paid}
                              onChange={e => setReviewForm({ ...reviewForm, price_paid: e.target.value })}
                              placeholder="Örn: 500"
                              className="w-full px-4 py-3 rounded-md border-[2px] border-gray-950 dark:border-white bg-white dark:bg-black/50 text-sm text-gray-900 dark:text-white outline-none focus:border-rose-600 shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)] transition-all"
                              required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">TL</div>
                          </div>
                        </div>

                        <div className="relative">
                          <textarea
                            value={reviewForm.comment}
                            onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            rows={3}
                            placeholder="Hizmet kalitesi, süreç ve iletişim nasıldı?"
                            className="w-full px-4 py-3 rounded-md border-[2px] border-gray-950 dark:border-white bg-gray-50 dark:bg-black/50 text-sm text-gray-900 dark:text-white outline-none focus:border-rose-600 shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)] transition-all resize-none"
                            required
                          />
                        </div>

                        {/* Image Upload for Reviews */}
                        <div className="space-y-2 mt-2">
                          <label className="block text-xs font-bold text-gray-500 dark:text-white/40 mb-1">Fotoğraflar (İsteğe Bağlı)</label>
                          <div className="flex flex-wrap gap-3">
                            {reviewImagePreviews.map((preview, index) => (
                              <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 group">
                                <img src={preview} alt="Review" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeReviewImage(index)}
                                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => reviewFileInputRef.current?.click()}
                              className="w-16 h-16 rounded-md border-[2px] border-dashed border-gray-950 dark:border-white flex flex-col items-center justify-center text-gray-950 dark:text-white hover:bg-rose-600 hover:text-white hover:border-solid hover:shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] transition-all"
                            >
                              <Camera size={20} />
                            </button>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              ref={reviewFileInputRef}
                              onChange={handleReviewImageChange}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-950 dark:bg-white text-white dark:text-gray-950 font-black text-xs uppercase tracking-wider rounded-md border-[2px] border-gray-950 dark:border-white shadow-[4px_4px_0_0_rgba(225,29,72,1)] hover:bg-rose-600 hover:text-white hover:border-gray-950 dark:hover:border-white hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0_0_rgba(225,29,72,1)] disabled:opacity-60 transition-all mt-2"
                        >
                          {submittingReview ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Send size={12} />
                          )}
                          Yorumu Gönder
                        </button>
                      </form>
                    )
                  ) : (
                    <div className="text-xs text-gray-500 dark:text-white/40">
                      Değerlendirme yazmak için lütfen{' '}
                      <Link href="/giris-yap" className="text-rose-600 font-bold hover:underline">
                        Giriş Yapın
                      </Link>
                      .
                    </div>
                  )}
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {provider.reviews && provider.reviews.map((review: any) => (
                  <div key={review.id} className="p-5 rounded-xl bg-gray-50 dark:bg-white/5 border-[2px] border-gray-950 dark:border-white shadow-[4px_4px_0_0_rgba(3,7,18,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full border-[2px] border-gray-950 dark:border-white overflow-hidden shrink-0 bg-rose-600 flex items-center justify-center text-white font-black text-sm">
                        {review.avatar ? (
                          <Image src={review.avatar} alt={review.author} width={40} height={40} className="object-cover" unoptimized={true} />
                        ) : (
                          review.author.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div>
                            <span className="font-bold text-sm text-gray-900 dark:text-white">{review.author}</span>
                            <span className="text-xs text-gray-400 dark:text-white/40 ml-2">· {review.service}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Stars rating={review.rating} size={12} />
                            <span className="text-xs text-gray-400 dark:text-white/40 flex items-center gap-1"><Calendar size={10} /> {review.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">{review.comment}</p>
                        {review.images && review.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {review.images.map((img: string, i: number) => (
                              <div key={i} onClick={() => setLightboxImage(img)} className="relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer group border border-gray-100 dark:border-white/10">
                                <Image src={img} alt={`Review ${i}`} fill className="object-cover group-hover:scale-110 transition-transform" unoptimized={true} />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sticky Sidebar */}
          <aside className="w-full lg:w-[280px] xl:w-[320px] shrink-0 order-3">
            <div className="sticky top-24 space-y-4">

              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className="hidden lg:block bg-white dark:bg-black border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] p-6 lg:p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-2 mb-1">
                    {provider.rating > 0 ? provider.rating.toFixed(1) : 'Yeni'} <Star size={24} className="fill-amber-400 text-amber-400" />
                  </div>
                  <p className="text-sm text-gray-500">{provider.reviewCount} müşteri değerlendirmesi</p>
                </div>

                <a
                  href={`tel:${provider.phone}`}
                  id="detail-call-btn"
                  className="w-full flex items-center justify-center gap-3 py-4 bg-rose-600 text-white font-black text-lg border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] transition-all mb-3"
                >
                  <Phone size={22} /> Doğrudan Ara
                </a>

                {provider.userId && (
                  <button
                    onClick={() => setIsOfferModalOpen(true)}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-white dark:bg-black text-gray-950 dark:text-white font-black text-lg border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] hover:bg-gray-100 dark:hover:bg-gray-900 hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] transition-all mb-3"
                  >
                    <MessageSquare size={22} /> Teklif Ver
                  </button>
                )}
                <p className="text-center text-xs text-gray-400 mb-5">
                  <span className="font-bold text-gray-600 dark:text-white/60">{provider.phone}</span>
                </p>

                <div className="space-y-2.5">
                  {['Komisyon yok, direkt iletişim', 'Doğrulanmış hizmet veren', 'Teklif beklemenize gerek yok', 'Gerçek müşteri yorumları'].map(b => (
                    <div key={b} className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                      <CheckCircle2 size={14} className="text-rose-500 shrink-0" /> {b}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className="bg-white dark:bg-black border-[3px] border-gray-950 dark:border-white rounded-xl shadow-[6px_6px_0_0_rgba(3,7,18,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] p-5">
                <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest border-b-[3px] border-gray-950 dark:border-white pb-2 mb-4">Hızlı Bilgi</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Kategori', value: provider.category },
                    { label: 'Konum', value: [provider.district, provider.city].filter(Boolean).join(', ') },
                    { label: 'Deneyim', value: provider.experience },
                    provider.avgPricePaid ? { label: 'Fiyat', value: `Ort. ₺${provider.avgPricePaid}` } : null,
                    { label: 'Bitirilen İş', value: `${provider.reviewCount}` },
                  ].filter(Boolean).map((i: any) => (
                    <div key={i.label} className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-white/40 font-bold">{i.label}</span>
                      <span className="text-xs font-black text-gray-900 dark:text-white">{i.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <p className="text-center text-xs text-gray-400">
                <button className="underline hover:text-gray-600 dark:hover:text-white/60 transition-colors">Profili şikayet et</button>
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Similar Providers Section */}
      {similarProviders.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <Users className="text-rose-600" size={28} />
              Benzer Uzmanlar
            </h2>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={scrollLeft} className="w-10 h-10 rounded-xl bg-white dark:bg-[#111] border-[2px] border-gray-950 dark:border-white shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)] flex items-center justify-center hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all">
                <ChevronLeft size={20} className="text-gray-900 dark:text-white" />
              </button>
              <button onClick={scrollRight} className="w-10 h-10 rounded-xl bg-white dark:bg-[#111] border-[2px] border-gray-950 dark:border-white shadow-[2px_2px_0_0_rgba(3,7,18,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)] flex items-center justify-center hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all">
                <ChevronRight size={20} className="text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar gap-6 md:mx-0 md:px-2 scroll-smooth"
            >
              {similarProviders.map((simProvider: any) => (
                <div key={simProvider.id} className="snap-center shrink-0 w-[300px] md:w-[320px]">
                  <div className="w-full h-full bg-white dark:bg-[#0a0a0a] rounded-[2rem] p-3 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all flex flex-col group">
                    {/* Top Image (Cover Photo) */}
                    <div className="relative w-full h-24 rounded-t-[1.5rem] rounded-b-xl overflow-hidden shrink-0">
                      {simProvider.coverUrl || simProvider.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={simProvider.coverUrl || simProvider.avatarUrl} 
                          alt={simProvider.name} 
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-rose-500 via-purple-500 to-orange-400" />
                      )}
                      
                      {/* Category Label (Pill overlapping bottom right) */}
                      <div className="absolute bottom-2 right-2 bg-white dark:bg-[#2d303a] text-gray-900 dark:text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide shadow-md flex items-center gap-1.5 z-10">
                        <CheckCircle2 size={10} className="text-blue-500" /> {simProvider.category}
                      </div>

                      {/* Rating Star */}
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 flex items-center gap-1 rounded-full text-gray-900 font-bold text-[10px] shadow-sm z-10">
                        <Star size={10} className="fill-amber-500 text-amber-500" />
                        {simProvider.rating > 0 ? simProvider.rating.toFixed(1) : 'Yeni'}
                      </div>
                      
                      {/* Avatar overlapping bottom left */}
                      <div className="absolute -bottom-5 left-4 z-20">
                        <div className="w-12 h-12 rounded-full border-[3px] border-white dark:border-[#0a0a0a] bg-white overflow-hidden shadow-sm flex items-center justify-center relative">
                          {simProvider.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={simProvider.avatarUrl} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          ) : (
                            <span className="text-xl font-black text-rose-600">{simProvider.name.charAt(0)}</span>
                          )}
                          {simProvider.verified && (
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0a0a0a] flex items-center justify-center">
                              <CheckCircle2 size={8} className="text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 px-2 mt-6 relative z-10">
                      {/* Name and Bookmark */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Link href={`/esnaf/${simProvider.slug}`}>
                            <h2 className="font-black text-gray-900 dark:text-white text-[16px] leading-tight truncate hover:text-rose-600 transition-colors">
                              {simProvider.name}
                            </h2>
                          </Link>
                          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            {simProvider.jobTitle}
                          </p>
                        </div>
                        
                        <button className="w-7 h-7 rounded-full bg-gray-100 dark:bg-[#1f2128] flex items-center justify-center shrink-0 hover:bg-gray-200 dark:hover:bg-[#2d303a] transition-colors">
                          <Bookmark size={12} className="text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between mt-4 mb-4 px-1">
                        {/* Rating */}
                        <div className="flex flex-col items-start gap-0.5">
                          <div className="flex items-center gap-1 text-[13px] font-black text-gray-900 dark:text-white">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            {simProvider.rating > 0 ? simProvider.rating.toFixed(1) : 'Yeni'}
                          </div>
                          <span className="text-[9px] font-semibold text-gray-500">Rating</span>
                        </div>
                        
                        {/* Jobs */}
                        <div className="flex flex-col items-start gap-0.5">
                          <div className="flex items-center gap-1 text-[13px] font-black text-gray-900 dark:text-white">
                            <Users size={12} className="text-blue-500" />
                            {simProvider.reviewCount}
                          </div>
                          <span className="text-[9px] font-semibold text-gray-500">Bitirilen İş</span>
                        </div>
                        
                        {/* Location */}
                        <div className="flex flex-col items-start gap-0.5">
                          <div className="flex items-center gap-1 text-[13px] font-black text-gray-900 dark:text-white">
                            <MapPin size={12} className="text-purple-500" />
                            <span className="truncate max-w-[50px]">{simProvider.city || 'Belirtilmedi'}</span>
                          </div>
                          <span className="text-[9px] font-semibold text-gray-500">Konum</span>
                        </div>
                      </div>

                      {/* Bottom Button (Gradient Red) */}
                      <div className="mt-auto">
                        <Link
                          href={`/esnaf/${simProvider.slug}`}
                          className="flex items-center justify-center w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-2.5 rounded-full text-xs font-black shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-[1.02] transition-all"
                        >
                          Profili İncele
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white dark:bg-[#111] rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsOfferModalOpen(false)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-500 transition-colors">
              <ChevronLeft size={20} className="rotate-180" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-500/20 text-rose-600 flex items-center justify-center font-bold">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">Teklif Gönder</h3>
                <p className="text-xs text-gray-500 font-medium">İşi ve fiyatını belirt, anlaşmaya başla.</p>
              </div>
            </div>
            
            <form onSubmit={handleSendOffer} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">İş Detayı</label>
                <textarea 
                  required
                  value={offerForm.detail}
                  onChange={e => setOfferForm({ ...offerForm, detail: e.target.value })}
                  placeholder="Hangi hizmete ihtiyacın var? Detayları yaz..."
                  className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none h-28 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Teklif Ettiğin Fiyat (TL)</label>
                <div className="relative">
                  <input 
                    type="number"
                    required
                    value={offerForm.price}
                    onChange={e => setOfferForm({ ...offerForm, price: e.target.value })}
                    placeholder="Örn: 1500"
                    className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 font-bold text-lg outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-gray-900 dark:text-white"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">TL</div>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={submittingOffer}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-black text-[15px] rounded-xl shadow-lg shadow-rose-500/30 transition-all active:scale-95 disabled:opacity-70"
              >
                {submittingOffer ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} />}
                Teklifi Gönder
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setLightboxImage(null)}>
          <button className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors" onClick={() => setLightboxImage(null)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <div className="relative w-full max-w-5xl h-full max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <Image src={lightboxImage} alt="Büyük Görsel" fill className="object-contain" sizes="100vw" quality={100} unoptimized={true} />
          </div>
        </div>
      )}
    </div>
  );
}
