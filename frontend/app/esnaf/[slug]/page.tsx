import { providers } from '@/lib/data';
import ProviderDetailClient from './ProviderDetailClient';
import { API_BASE_URL } from '@/config';

interface PageProps {
  params: Promise<{ slug: string }>;
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
  
  if (norm.includes('web') || norm.includes('yazilim') || norm.includes('kodlama') || norm.includes('tasarim') || norm.includes('logo') || norm.includes('grafik') || norm.includes('seo') || norm.includes('dijital pazarlama') || norm.includes('sosyal medya') || norm.includes('developer') || norm.includes('programlama') || norm.includes('site') || norm.includes('uygulama') || norm.includes('internet') || norm.includes('e-ticaret') || norm.includes('eticaret')) return 'Yazılım & Tasarım';
  if (norm.includes('temizlik') || norm.includes('hali yikama') || norm.includes('hijyen') || norm.includes('koltuk yikama') || norm.includes('temizlikci') || norm.includes('steril') || norm.includes('yikama')) return 'Temizlik';
  if (norm.includes('nakliyat') || norm.includes('nakliye') || norm.includes('tasima') || norm.includes('lojistik') || norm.includes('kamyon') || norm.includes('kargo') || norm.includes('nakil')) return 'Nakliyat';
  if (norm.includes('matematik') || norm.includes('ingilizce') || norm.includes('fizik') || norm.includes('kimya') || norm.includes('turkce') || norm.includes('sinav') || norm.includes('yks') || norm.includes('lgs') || norm.includes('ogretmen') || norm.includes('egitmen') || norm.includes('kurs') || norm.includes('egitim') || norm.includes('ders') || norm.includes('okul')) return 'Özel Ders';
  if (norm.includes('tamir') || norm.includes('tadilat') || norm.includes('elektrik') || norm.includes('tesisat') || norm.includes('boya') || norm.includes('badana') || norm.includes('marangoz') || norm.includes('mobilya') || norm.includes('klima') || norm.includes('usta') || norm.includes('montaj') || norm.includes('onarim') || norm.includes('dekorasyon') || norm.includes('kombi') || norm.includes('parke') || norm.includes('fayans')) return 'Tamirat';
  if (norm.includes('fotograf') || norm.includes('video') || norm.includes('cekim') || norm.includes('kamera') || norm.includes('dugun') || norm.includes('klip') || norm.includes('kameraman') || norm.includes('kurgu') || norm.includes('edit')) return 'Fotoğrafçılık';
  if (norm.includes('araba') || norm.includes('arac') || norm.includes('kiralama') || norm.includes('oto') || norm.includes('rent')) return 'Araç Kiralama';
  if (norm.includes('bahce') || norm.includes('peyzaj') || norm.includes('cicek') || norm.includes('tarim') || norm.includes('bitki') || norm.includes('tarimsal') || norm.includes('fidan')) return 'Bahçe & Peyzaj';
  if (norm.includes('diyet') || norm.includes('diyetisyen') || norm.includes('psikolog') || norm.includes('danisman') || norm.includes('danismanlik') || norm.includes('saglik') || norm.includes('terapi') || norm.includes('pt') || norm.includes('antrenor') || norm.includes('spor') || norm.includes('klinik') || norm.includes('fizik tedavi') || norm.includes('fizyoterapist')) return 'Sağlık & Yaşam';
  if (norm.includes('guzellik') || norm.includes('bakim') || norm.includes('kuafor') || norm.includes('berber') || norm.includes('makyaj') || norm.includes('manikur') || norm.includes('pedikur') || norm.includes('agda') || norm.includes('epilasyon') || norm.includes('tirnak') || norm.includes('sac') || norm.includes('estetik')) return 'Güzellik & Bakım';
  if (norm.includes('pet') || norm.includes('sitter') || norm.includes('hayvan') || norm.includes('kopek') || norm.includes('kedi') || norm.includes('veteriner') || norm.includes('gezdirme') || norm.includes('mama')) return 'Evcil Hayvan';
  if (norm.includes('organizasyon') || norm.includes('davet') || norm.includes('catering') || norm.includes('yemek') || norm.includes('asci') || norm.includes('mutfak') || norm.includes('kinas') || norm.includes('kina') || norm.includes('nisan') || norm.includes('parti') || norm.includes('etkinlik') || norm.includes('dogum gunu')) return 'Organizasyon & Etkinlik';
  
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

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
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
    try {
      // Backend'den doğrudan SEO verisi çekiyoruz (Server-Side)
      const res = await fetch(`http://127.0.0.1:8000/api/listings/public/${listingIdStr}`, { next: { revalidate: 60 } });
      const data = await res.json();
      if (data.success && data.listing) {
        const p = mapDbListingToProvider(data.listing);
        return {
          title: `${p.name} - ${p.jobTitle} | HizmetBul`,
          description: p.about.substring(0, 160) + '...',
          openGraph: {
            title: `${p.name} - ${p.jobTitle}`,
            description: p.about.substring(0, 160) + '...',
            images: p.coverUrl ? [p.coverUrl] : [],
          }
        };
      }
    } catch (e) {
      console.error('Metadata fetch error:', e);
    }
  }

  // Fallback for static fake providers
  const provider = providers.find(p => p.slug === slug);
  if (!provider) {
    return {
      title: 'Uzman Profili | HizmetBul',
      description: 'Hizmet veren uzman profili ve müşteri değerlendirmeleri.',
    };
  }
  return {
    title: `${provider.name} — ${provider.category} | HizmetBul`,
    description: provider.description,
  };
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  let initialData = null;
  
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
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/listings/public/${listingIdStr}`, { next: { revalidate: 60 } });
      const data = await res.json();
      if (data.success && data.listing) {
        initialData = mapDbListingToProvider(data.listing);
      }
    } catch (e) {
      console.error('SSR fetch error:', e);
    }
  }

  return <ProviderDetailClient slug={slug} initialData={initialData} />;
}
