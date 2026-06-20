'use client';
import { API_BASE_URL } from '@/config';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Camera, Search, Check, MapPin, Clock, Tag, FileText, Layers, Sparkles, ChevronDown } from 'lucide-react';
import { ALL_CATEGORIES } from '@/lib/data';
import citiesData from '@/lib/cities.json';

interface ListingFormModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSaved?: (savedListing?: any) => void;
  onSave?: () => void;
  listing?: any;
  initialData?: any;
  user?: any;
  token?: string;
  isMandatory?: boolean;
}

export default function ListingFormModal({ isOpen = true, onClose, onSaved, onSave, listing, initialData, user, token, isMandatory = false }: ListingFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subServiceSearch, setSubServiceSearch] = useState('');
  
  // AI Assistant states
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExpanded, setAiExpanded] = useState(false);

  const data = listing || initialData;
  const parsedPrice = (data?.price_range || '').split('-');

  const MAIN_GROUPS = Array.from(new Set(ALL_CATEGORIES.map(c => c.group)));
  const initialCategory = data?.service || user?.services?.[0] || MAIN_GROUPS[0];

  const [formData, setFormData] = useState({
    title: data?.title || '',
    service: initialCategory,
    description: data?.description || '',
    experience: data?.experience || '',
    city: data?.city || user?.city || 'İstanbul',
    district: data?.district || user?.district || '',
    tags: data?.tags?.join(', ') || '',
    price_min: parsedPrice[0]?.replace(/[^0-9]/g, '') || '',
    price_max: parsedPrice[1]?.replace(/[^0-9]/g, '') || '',
  });

  const [subServices, setSubServices] = useState<string[]>(data?.sub_services || []);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    data?.cover_image ? (data.cover_image.startsWith('http') ? data.cover_image : `${API_BASE_URL}/storage/${data.cover_image}`) : null
  );

  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>(data?.portfolio_images || []);
  const [existingPortfolio, setExistingPortfolio] = useState<string[]>(
    (data?.portfolio_images || []).map((url: string) => url.replace(`${API_BASE_URL}/storage/`, ''))
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'service') {
      setSubServices([]);
      setSubServiceSearch('');
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    const cityData = citiesData.find(c => c.city === newCity) || citiesData[0];
    setFormData(prev => ({ ...prev, city: newCity, district: cityData.districts[0] }));
  };

  const selectedCityData = citiesData.find(c => c.city === formData.city) || citiesData[0];
  const districts = selectedCityData.districts;

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/generate-listing`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const result = await res.json();
      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          title: result.data.title || prev.title,
          description: result.data.description || prev.description,
          tags: result.data.tags ? result.data.tags.join(', ') : prev.tags,
          service: result.data.category || prev.service,
        }));
        setAiExpanded(false);
        setAiPrompt('');
      }
    } catch (err) {
      console.error("AI Generate Error", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubServiceToggle = (subName: string) => {
    setSubServices(prev => {
      const isSelected = prev.includes(subName);
      const next = isSelected ? prev.filter(s => s !== subName) : [...prev, subName];
      
      // Auto-detect group from first selected sub-service
      if (next.length > 0) {
        const matched = ALL_CATEGORIES.find(c => c.name === next[0]);
        if (matched) {
          setFormData(f => ({ ...f, service: matched.group }));
        }
      }
      return next;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPortfolioImages(prev => [...prev, ...files]);
      const newPreviews = files.map(f => URL.createObjectURL(f));
      setPortfolioPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removePortfolioImage = (index: number) => {
    const isExisting = index < existingPortfolio.length;
    if (isExisting) {
      setExistingPortfolio(prev => prev.filter((_, i) => i !== index));
      setPortfolioPreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      const fileIndex = index - existingPortfolio.length;
      setPortfolioImages(prev => prev.filter((_, i) => i !== fileIndex));
      setPortfolioPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') {
          const tagsArray = (value as string).split(',').map((t: string) => t.trim()).filter(Boolean);
          fd.append('tags', JSON.stringify(tagsArray));
        } else if (key === 'price_min' || key === 'price_max') {
          // Skip individual price fields — we'll build price_range below
        } else {
          fd.append(key, value);
        }
      });
      // Build price_range string
      const min = formData.price_min?.trim();
      const max = formData.price_max?.trim();
      if (min || max) {
        const priceRange = min && max ? `₺${min} - ₺${max}` : min ? `₺${min}+` : `₺${max} altı`;
        fd.append('price_range', priceRange);
      }
      fd.append('sub_services', JSON.stringify(subServices));

      if (coverImage) fd.append('cover_image', coverImage);
      portfolioImages.forEach(file => fd.append('portfolio_images[]', file));
      if (data) fd.append('existing_portfolio', JSON.stringify(existingPortfolio));

      const url = data ? `${API_BASE_URL}/api/listings/${data.id}` : `${API_BASE_URL}/api/listings`;
      const authToken = token || localStorage.getItem('auth_token');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: fd
      });

      const responseData = await res.json();

      if (!res.ok) {
        if (responseData.errors) {
          const firstError = Object.values(responseData.errors)[0] as string[];
          throw new Error(firstError[0] || 'Lütfen formu eksiksiz doldurun.');
        }
        throw new Error(responseData.message || 'İlan kaydedilirken hata oluştu.');
      }

      if (onSaved) onSaved(responseData.listing);
      if (onSave) onSave();
      onClose();

    } catch (err: any) {
      setError(err.message || 'Bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filter and group sub-services
  const filteredSubs = subServiceSearch.trim()
    ? ALL_CATEGORIES.filter(s => s.name.toLowerCase().includes(subServiceSearch.toLowerCase()))
    : ALL_CATEGORIES;

  const groupedCategories = MAIN_GROUPS.map(groupName => {
    const items = filteredSubs.filter(c => c.group === groupName);
    return { groupName, items };
  }).filter(g => g.items.length > 0);

  const InputLabel = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
    <div className="flex items-center gap-1.5 mb-1.5">
      <Icon size={13} className="text-[#9a0002]" />
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">{children}</label>
    </div>
  );

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1a1a1a] border-2 border-gray-200 dark:border-white/10 focus:border-[#9a0002] focus:shadow-[0_0_0_3px_rgba(154,0,2,0.08)] outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm font-medium";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={isMandatory ? undefined : onClose}
        />
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="bg-[#fafafa] dark:bg-[#111] rounded-3xl shadow-2xl shadow-black/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 border border-gray-200 dark:border-white/8"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-[#111]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/8 rounded-t-3xl">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">
                {data ? '✏️ İlanı Düzenle' : (isMandatory ? '🚀 Profilinizi Tamamlayın' : '➕ Yeni İlan Ekle')}
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Tüm alanları eksiksiz doldurun</p>
            </div>
            {!isMandatory && (
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/8 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 flex items-center justify-center transition-all">
                <X size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {error && (
              <div className="p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm font-semibold flex items-center gap-2">
                <X size={15} className="shrink-0" /> {error}
              </div>
            )}



            {/* İlan Başlığı */}
            <div>
              <InputLabel icon={FileText}>İlan Başlığı</InputLabel>
              <input required name="title" value={formData.title} onChange={handleChange} className={inputCls} placeholder="Örn: Profesyonel Web Tasarım" />
            </div>

            {/* Hizmet Seçimi */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <InputLabel icon={Check}>Verdiğiniz Hizmetler / Uzmanlık Alanları</InputLabel>
                {subServices.length > 0 && (
                  <span className="text-xs font-bold text-white bg-[#9a0002] px-2.5 py-1 rounded-full">
                    {subServices.length} seçildi
                  </span>
                )}
              </div>

              {/* Search inside service list */}
              <div className="relative mb-2.5">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Verdiğiniz hizmetleri arayın (örn: Web Tasarım, Ev Temizliği...)"
                  value={subServiceSearch}
                  onChange={e => setSubServiceSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-[#9a0002] outline-none transition-all font-medium"
                />
              </div>

              {/* Selected chips */}
              {subServices.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2.5 p-2.5 bg-[#9a0002]/5 border border-[#9a0002]/20 rounded-xl">
                  {subServices.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSubServiceToggle(s)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#9a0002] text-white rounded-lg text-xs font-bold hover:bg-[#c40003] transition-colors"
                    >
                      {s}
                      <X size={10} />
                    </button>
                  ))}
                </div>
              )}

              {/* Grouped Services List */}
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1 rounded-xl bg-gray-50/50 dark:bg-black/20 p-3 border border-gray-100 dark:border-white/5">
                {groupedCategories.length === 0 ? (
                  <div className="col-span-3 text-center py-6 text-gray-400 dark:text-gray-600 text-sm font-medium">
                    Arama sonucu bulunamadı
                  </div>
                ) : (
                  groupedCategories.map(group => (
                    <div key={group.groupName} className="space-y-2">
                      <h4 className="text-xs font-black text-[#9a0002] dark:text-rose-500 uppercase tracking-widest px-1 flex items-center gap-1.5 mt-2 first:mt-0">
                        <Layers size={11} /> {group.groupName}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {group.items.map(sub => {
                          const isSelected = subServices.includes(sub.name);
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleSubServiceToggle(sub.name)}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border-2 text-left transition-all text-xs font-bold w-full ${
                                isSelected
                                  ? 'bg-[#9a0002] border-[#9a0002] text-white shadow-md shadow-[#9a0002]/15'
                                  : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-[#9a0002]/50 hover:bg-[#9a0002]/5 dark:hover:border-[#9a0002]/50'
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center shrink-0 border-2 transition-all ${
                                isSelected ? 'bg-white border-white' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20'
                              }`}>
                                {isSelected && <Check size={10} className="text-[#9a0002]" strokeWidth={4} />}
                              </div>
                              <span className="truncate leading-tight">{sub.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Experience + City + District */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <InputLabel icon={Clock}>Deneyim Süresi</InputLabel>
                <input name="experience" value={formData.experience} onChange={handleChange} className={inputCls} placeholder="Örn: 5 Yıl" />
              </div>
              <div>
                <InputLabel icon={MapPin}>Şehir</InputLabel>
                <select name="city" value={formData.city} onChange={handleCityChange} className={inputCls + " cursor-pointer"}>
                  {citiesData.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
                </select>
              </div>
              <div>
                <InputLabel icon={MapPin}>İlçe</InputLabel>
                <select name="district" value={formData.district} onChange={handleChange} className={inputCls + " cursor-pointer"}>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <InputLabel icon={FileText}>Detaylı Açıklama</InputLabel>
              
              {/* AI Assistant Banner */}
              <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/10 dark:to-fuchsia-900/10 border-2 border-violet-100 dark:border-violet-500/20 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  type="button" 
                  onClick={() => setAiExpanded(!aiExpanded)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20 shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                        ✨ Yapay Zeka ile Otomatik Doldur
                      </h3>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">Kısaca ne iş yaptığınızı söyleyin, açıklama ve etiketleri saniyeler içinde o yazsın.</p>
                    </div>
                  </div>
                  <ChevronDown size={18} className={`text-gray-400 shrink-0 transition-transform duration-300 ${aiExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {aiExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 pt-1"
                    >
                      <div className="relative">
                        <textarea 
                          value={aiPrompt}
                          onChange={e => setAiPrompt(e.target.value)}
                          placeholder="Örn: İzmir Karşıyaka'da nakliyeciyim, asansörlü taşımacılık yapıyorum..."
                          className="w-full px-3 py-2.5 pb-10 rounded-xl bg-white dark:bg-[#1a1a1a] border border-violet-200 dark:border-violet-500/30 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 text-sm font-medium resize-none h-20"
                        />
                        <button 
                          type="button"
                          onClick={handleAiGenerate}
                          disabled={isAiLoading || !aiPrompt.trim()}
                          className="absolute bottom-1.5 right-1.5 px-3 py-1.5 rounded-lg font-bold text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 transition-all disabled:opacity-50 text-xs flex items-center gap-1.5 shadow-md shadow-violet-500/20"
                        >
                          {isAiLoading ? (
                            <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Yazılıyor...</>
                          ) : (
                            <><Sparkles size={12} /> Doldur</>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className={inputCls + " resize-none"} placeholder="Verdiğiniz hizmetten detaylıca bahsedin..." />
              <p className="text-xs text-[#9a0002]/85 dark:text-rose-400/85 mt-1.5 font-semibold flex items-center gap-1.5">
                <Sparkles size={12} className="animate-pulse text-[#9a0002] dark:text-rose-400" />
                <span>Aramalarda yapay zeka (semantik eşleşme) bu açıklamayı analiz eder. Ne kadar detaylı yazarsanız, o kadar çok eşleşip üst sıralarda çıkarsınız.</span>
              </p>
            </div>

            {/* Price Range */}
            <div>
              <InputLabel icon={Tag}>Fiyat Aralığı (₺)</InputLabel>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₺</span>
                  <input
                    type="number"
                    name="price_min"
                    value={formData.price_min}
                    onChange={handleChange}
                    className={inputCls + " pl-7"}
                    placeholder="Min (örn: 500)"
                    min="0"
                  />
                </div>
                <span className="text-gray-400 font-bold text-lg">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₺</span>
                  <input
                    type="number"
                    name="price_max"
                    value={formData.price_max}
                    onChange={handleChange}
                    className={inputCls + " pl-7"}
                    placeholder="Max (örn: 5000)"
                    min="0"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-medium">
                Fiyat aralığı kart üzerinde müşterilere gösterilir ve filtrelemelere dahil edilir.
              </p>
            </div>

            {/* Tags */}
            <div>
              <InputLabel icon={Tag}>Etiketler (virgülle ayırın)</InputLabel>
              <input name="tags" value={formData.tags} onChange={handleChange} className={inputCls} placeholder="web tasarım, seo, kurumsal..." />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-medium flex items-center gap-1.5">
                <Tag size={12} className="text-gray-400 dark:text-gray-500" />
                <span>Anahtar kelimeler yapay zeka skorunuza katkı sağlar. Virgül ile ayırarak yazın.</span>
              </p>
            </div>

            {/* Cover Image */}
            <div>
              <InputLabel icon={Camera}>Kapak Fotoğrafı</InputLabel>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-36 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#9a0002] hover:bg-[#9a0002]/5 transition-all relative overflow-hidden group"
              >
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                      <Camera className="text-white" size={28} />
                      <span className="text-white font-bold text-sm">Değiştir</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <UploadCloud size={30} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">Kapak fotoğrafı yüklemek için tıkla</span>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">JPG, PNG — Maks 5MB</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <InputLabel icon={Layers}>Portföy Görselleri</InputLabel>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {portfolioPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 dark:border-white/10 group">
                    <img src={preview} alt="Portfolio" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button type="button" onClick={() => removePortfolioImage(index)} className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all">
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                <div
                  onClick={() => portfolioInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#9a0002] hover:bg-[#9a0002]/5 transition-all group"
                >
                  <UploadCloud size={22} className="text-gray-300 dark:text-gray-600 group-hover:text-[#9a0002] transition-colors mb-1" />
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 group-hover:text-[#9a0002] transition-colors">Ekle</span>
                  <input type="file" ref={portfolioInputRef} hidden accept="image/*" multiple onChange={handlePortfolioChange} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
              {!isMandatory && (
                <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/8 hover:bg-gray-200 dark:hover:bg-white/12 transition-colors text-sm">
                  İptal
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 rounded-xl font-black text-white bg-gradient-to-r from-[#9a0002] to-[#c40003] hover:from-[#7a0001] hover:to-[#9a0002] transition-all disabled:opacity-50 shadow-lg shadow-[#9a0002]/30 text-sm flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Kaydediliyor...</>
                ) : (
                  <><Check size={16} /> {data ? 'Güncelle' : 'İlanı Oluştur'}</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

