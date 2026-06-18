'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown, AlertCircle } from 'lucide-react';

const cities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
  'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
  'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
  'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
  'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
].sort((a, b) => a.localeCompare(b, 'tr'));
interface SearchBarProps {
  compact?: boolean;
  defaultQuery?: string;
  defaultCity?: string;
}

export default function SearchBar({ compact = false, defaultQuery = '', defaultCity = '' }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [city, setCity] = useState(defaultCity);
  const [cityOpen, setCityOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const cityRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setCityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset city query when dropdown opens
  useEffect(() => {
    if (cityOpen) {
      setCityQuery('');
    }
  }, [cityOpen]);

  const filteredCities = cities.filter(c => c.toLocaleLowerCase('tr').includes(cityQuery.toLocaleLowerCase('tr')));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || city.trim() === '') {
      setError('Lütfen arama yapmak için bir şehir seçin veya "Tüm Şehirler" seçeneğini belirleyin.');
      return;
    }
    setError(null);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (city && city !== 'Tüm Şehirler') params.set('sehir', city);
    router.push(`/arama?${params.toString()}`);
  };

  return (
    <div className="w-full relative">
      <form
        onSubmit={handleSearch}
        className={`relative flex items-stretch w-full bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-100/50 transition-all duration-200 focus-within:border-emerald-300 focus-within:shadow-emerald-100/60 focus-within:shadow-xl ${
          compact ? 'h-12 rounded-xl' : 'h-16'
        }`}
      >
        {/* Service Input */}
        <div className={`flex-1 flex items-center gap-3 px-5 border-r border-slate-100 ${compact ? 'rounded-l-xl' : 'rounded-l-2xl'}`}>
          <Search
            size={compact ? 16 : 18}
            className="text-slate-400 shrink-0"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hangi hizmeti arıyorsunuz? (Ev Temizliği, Web Tasarım...)"
            className={`w-full bg-transparent outline-none text-slate-900 placeholder-slate-400 font-medium ${
              compact ? 'text-sm' : 'text-base'
            }`}
            id="search-query-input"
          />
        </div>

        {/* City Selector */}
        <div ref={cityRef} className="relative shrink-0 flex items-stretch">
          <button
            type="button"
            onClick={() => setCityOpen(!cityOpen)}
            className={`flex items-center gap-2 h-full border-r border-slate-100 text-slate-700 font-medium hover:bg-slate-50 transition-colors ${
              compact ? 'px-3 text-sm gap-1.5' : 'px-5'
            }`}
            id="city-selector-btn"
          >
            <MapPin size={compact ? 14 : 16} className="text-emerald-500 shrink-0" />
            <span className={compact ? 'hidden sm:block' : ''}>
              {city || 'Şehir Seçin'}
            </span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform ${cityOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {cityOpen && (
            <div className="absolute top-full right-0 sm:left-0 mt-2 w-52 sm:w-60 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 z-50 overflow-hidden">
              <div className="p-2 border-b border-slate-100">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Şehir ara..." 
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-300 transition-colors"
                />
              </div>
              <div className="py-1 max-h-60 overflow-y-auto">
                {cityQuery === '' && (
                  <button
                    type="button"
                    onClick={() => { setCity('Tüm Şehirler'); setCityOpen(false); setError(null); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${
                      city === 'Tüm Şehirler' || city === '' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700'
                    }`}
                  >
                    Tüm Şehirler
                  </button>
                )}
                {filteredCities.length === 0 && (
                  <div className="px-4 py-3 text-sm text-slate-500 text-center">Şehir bulunamadı</div>
                )}
                {filteredCities.map((c) => (
                  <button
                    key={c}
                    id={`city-btn-${c}`}
                    type="button"
                    onClick={() => { setCity(c); setCityOpen(false); setError(null); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700 outline-none transition-colors ${
                      city === c ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          id="search-submit-btn"
          className={`shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white font-black tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] active:scale-95 ${
            compact ? 'px-6 text-sm rounded-r-xl' : 'px-10 text-lg rounded-r-2xl'
          }`}
        >
          <span>Bul</span>
          <Search size={compact ? 16 : 18} className="text-white" />
        </button>
      </form>

      {error && (
        <div className="absolute top-full left-0 right-0 mt-3 flex items-center justify-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-sm bg-rose-50 dark:bg-[#1a060b] border border-rose-200 dark:border-rose-900/30 py-2.5 px-4 rounded-xl shadow-lg backdrop-blur-md z-40">
          <AlertCircle size={16} className="shrink-0 text-[#ff003c]" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
