import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, CheckCircle2, Bookmark, Users, MapPin, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '@/config';

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function PeopleCard({
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
  const isPromoted = provider.is_promoted || false;

  const trackAction = (action: string) => {
    if (!provider.id.toString().startsWith('db-')) return;
    const dbId = provider.id.replace('db-', '');
    fetch(`${API_BASE_URL}/api/listings/${dbId}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    }).catch(() => {});
  };

  return (
    <motion.article
      variants={scaleIn}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.05 }}
      className={`w-full bg-gradient-to-br from-rose-400 to-rose-500 rounded-[2rem] p-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col group relative ${isPromoted ? 'ring-2 ring-white/50' : ''}`}
    >
      {/* Top Image (Cover Photo) */}
      <div className="relative w-full h-[140px] rounded-[1.5rem] shrink-0">
        <div className="w-full h-full overflow-hidden rounded-[1.5rem] bg-[#fcfaf8]">
          {provider.coverUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={provider.coverUrl} 
              alt={provider.name} 
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          ) : null}
        </div>
        
        {/* Category Label (Pill vertically centered on bottom edge of cover) */}
        <div className="absolute -bottom-3.5 right-4 bg-[#fcfaf8] text-gray-900 px-4 py-1.5 rounded-full text-[11px] font-black tracking-wide shadow-md flex items-center gap-1.5 z-10">
          {provider.category}
        </div>
        
        {isPromoted && (
          <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-[#fcfaf8] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm z-10">
            <Star size={10} className="fill-[#fcfaf8]" /> Sponsorlu
          </div>
        )}
        
        {aiMetrics && (
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-[#fcfaf8] px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm z-10">
            <Sparkles size={10} /> %{Math.round(aiMetrics.score * 100)} Uyum
          </div>
        )}

        {/* Avatar overlapping bottom left - OUTSIDE overflow-hidden so it's not clipped */}
        <div className="absolute -bottom-6 left-5 z-20">
          <div className="w-16 h-16 rounded-full border-[4px] border-rose-600 bg-rose-50 overflow-hidden shadow-sm flex items-center justify-center relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={provider.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(provider.name)}`} 
              alt={provider.name} 
              className="absolute inset-0 w-full h-full object-cover" 
              onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(provider.name)}`; }} 
            />
            {provider.verified && (
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-rose-600 flex items-center justify-center">
                <CheckCircle2 size={8} className="text-[#fcfaf8]" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 px-3 mt-8 relative z-10">
        {/* Name and Bookmark */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/esnaf/${provider.slug}`} onClick={() => trackAction('click')}>
              <h2 className="font-black text-[#fcfaf8] text-[19px] leading-tight truncate hover:text-rose-200 transition-colors">
                {provider.name}
              </h2>
            </Link>
            <p className="text-[13px] font-medium text-rose-200 mt-1 truncate">
              {provider.jobTitle}
            </p>
          </div>
          
          <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 hover:bg-white/20 transition-colors">
            <Bookmark size={16} className="text-[#fcfaf8]" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mt-5 mb-4 px-1">
          {/* Rating */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1.5 text-[15px] font-black text-[#fcfaf8]">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              {provider.rating > 0 ? provider.rating.toFixed(1) : 'Yeni'}
            </div>
            <span className="text-[11px] font-semibold text-rose-200">Rating</span>
          </div>
          
          {/* Jobs */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1.5 text-[15px] font-black text-[#fcfaf8]">
              <Users size={16} className="text-[#fcfaf8]" />
              {provider.reviewCount}
            </div>
            <span className="text-[11px] font-semibold text-rose-200">Bitirilen İş</span>
          </div>
          
          {/* Location */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1.5 text-[15px] font-black text-[#fcfaf8]">
              <MapPin size={16} className="text-[#fcfaf8]" />
              <span className="truncate max-w-[70px]">{provider.city || 'Belirtilmedi'}</span>
            </div>
            <span className="text-[11px] font-semibold text-rose-200">Konum</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-rose-100 line-clamp-2 leading-relaxed mb-5">
          {provider.description || provider.about || 'Bu uzman henüz açıklama eklememiş.'}
        </p>

        {/* Bottom Button (White) */}
        <div className="mt-auto">
          <Link
            href={`/esnaf/${provider.slug}`}
            onClick={(e) => { e.stopPropagation(); trackAction('click'); }}
            className="flex items-center justify-center w-full bg-[#fcfaf8] text-rose-600 py-3.5 rounded-full text-[15px] font-black shadow-lg shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] hover:bg-rose-50 transition-all"
          >
            Profili İncele
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
