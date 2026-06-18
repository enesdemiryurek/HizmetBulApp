import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Shield, ArrowRight, Phone } from 'lucide-react';
import { Provider } from '@/lib/types';

interface ProviderCardProps {
  provider: Provider;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(rating));
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {stars.map((filled, i) => (
          <Star
            key={i}
            size={13}
            className={filled ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-slate-800">{rating.toFixed(1)}</span>
      <span className="text-xs text-slate-500">({count} Yorum)</span>
    </div>
  );
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <article className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300">
      {/* Preview Images */}
      <div className="flex h-40 overflow-hidden">
        {provider.previewImages.slice(0, 3).map((src, i) => (
          <div
            key={i}
            className="flex-1 relative overflow-hidden"
          >
            <Image
              src={src}
              alt={`${provider.name} çalışma ${i + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 33vw, 20vw"
            />
            {i < 2 && (
              <div className="absolute inset-y-0 right-0 w-px bg-white/40 z-10" />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-base font-bold text-slate-900 truncate">
                {provider.name}
              </h2>
              {provider.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  <Shield size={10} className="fill-emerald-500 text-emerald-500" />
                  Doğrulanmış Üye
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                {provider.category}
              </span>
              <span>·</span>
              <MapPin size={11} className="text-slate-400" />
              <span>{provider.district}, {provider.city}</span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-xs text-slate-400 font-medium">{provider.priceRange}</div>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={provider.rating} count={provider.reviewCount} />
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {provider.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {provider.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-xs font-medium bg-slate-50 text-slate-600 rounded-full border border-slate-100"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <Link
            href={`/esnaf/${provider.slug}`}
            id={`provider-profile-btn-${provider.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all duration-200 hover:shadow-md hover:shadow-emerald-100 active:scale-95"
          >
            Profili İncele
            <ArrowRight size={14} />
          </Link>
          <a
            href={`tel:${provider.phone}`}
            id={`provider-call-btn-${provider.id}`}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-all duration-200 border border-transparent hover:border-emerald-200"
            title="Doğrudan Ara"
          >
            <Phone size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}
