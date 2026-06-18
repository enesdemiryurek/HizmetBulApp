'use client';
import { API_BASE_URL } from '@/config';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: number;
  onSuccess: (promotedUntil: string) => void;
}

export default function PaymentModal({ isOpen, onClose, listingId, onSuccess }: PaymentModalProps) {
  const [duration, setDuration] = useState('1_week');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const price = duration === '1_week' ? '299,00' : '899,00';

  // Format functions
  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.replace(/(.{4})/g, '$1 ').trim();
    if (val.length <= 19) setCardNumber(val);
  };

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    if (val.length <= 5) setExpiry(val);
  };

  const handleCvc = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length <= 3) setCvc(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 19 || expiry.length < 5 || cvc.length < 3) {
      setError('Lütfen tüm kart bilgilerini eksiksiz girin.');
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/listings/${listingId}/simulate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cardNumber, expiryDate: expiry, cvc, duration })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ödeme işlemi başarısız oldu.');

      setSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#050505', '#efe6dd', '#9a0002']
      });

      setTimeout(() => {
        onSuccess(data.promoted_until);
        onClose();
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-[#efe6dd] dark:bg-[#111] rounded-[2rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#9a0002]/10"
        >
          {/* Left Side: Checkout Details */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
            <div>
              <button
                onClick={onClose}
                className="absolute top-6 left-6 p-2 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors md:hidden"
              >
                <X size={16} className="text-[#050505] dark:text-[#efe6dd]" />
              </button>

              <div className="flex items-center gap-2 mb-8 mt-4 md:mt-0">
                <div className="w-8 h-8 rounded-full bg-[#9a0002] flex items-center justify-center">
                  <Sparkles size={16} className="text-[#efe6dd]" />
                </div>
                <span className="font-black text-[#050505] dark:text-[#efe6dd] tracking-tight font-celinda">HizmetBul <span className="font-medium text-[#9a0002] font-sans">Sponsorlu</span></span>
              </div>

              <h2 className="text-3xl font-black text-[#050505] dark:text-[#efe6dd] mb-2 tracking-tight">İlanını Öne Çıkar</h2>
              <p className="text-[#050505]/60 dark:text-[#efe6dd]/60 font-medium mb-8">
                Rakiplerinin önüne geçerek %300 daha fazla müşteri gösterimi al. 
              </p>

              {/* Package Selection */}
              <div className="space-y-3 mb-8">
                <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${duration === '1_week' ? 'border-[#9a0002] bg-[#9a0002]/5' : 'border-transparent bg-white dark:bg-white/5 hover:bg-black/5'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${duration === '1_week' ? 'border-[#9a0002]' : 'border-gray-300'}`}>
                      {duration === '1_week' && <div className="w-2.5 h-2.5 rounded-full bg-[#9a0002]" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#050505] dark:text-[#efe6dd]">1 Haftalık Sponsorluk</h4>
                      <p className="text-xs text-[#050505]/60 dark:text-[#efe6dd]/60 font-medium mt-0.5">7 gün boyunca aramalarda üst sıra</p>
                    </div>
                  </div>
                  <span className="font-black text-[#9a0002]">299 ₺</span>
                  <input type="radio" name="duration" value="1_week" checked={duration === '1_week'} onChange={(e) => setDuration(e.target.value)} className="hidden" />
                </label>

                <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${duration === '1_month' ? 'border-[#9a0002] bg-[#9a0002]/5' : 'border-transparent bg-white dark:bg-white/5 hover:bg-black/5'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${duration === '1_month' ? 'border-[#9a0002]' : 'border-gray-300'}`}>
                      {duration === '1_month' && <div className="w-2.5 h-2.5 rounded-full bg-[#9a0002]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#050505] dark:text-[#efe6dd]">1 Aylık Sponsorluk</h4>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#050505] text-[#efe6dd] px-2 py-0.5 rounded-full">POPÜLER</span>
                      </div>
                      <p className="text-xs text-[#050505]/60 dark:text-[#efe6dd]/60 font-medium mt-0.5">30 gün boyunca aramalarda üst sıra</p>
                    </div>
                  </div>
                  <span className="font-black text-[#9a0002]">899 ₺</span>
                  <input type="radio" name="duration" value="1_month" checked={duration === '1_month'} onChange={(e) => setDuration(e.target.value)} className="hidden" />
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-[#050505]/10 dark:border-[#efe6dd]/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#050505]/60 dark:text-[#efe6dd]/60 font-medium">Toplam Ödenecek Tutar</span>
                <span className="text-2xl font-black text-[#050505] dark:text-[#efe6dd]">{price} <span className="text-lg">TL</span></span>
              </div>
              <p className="text-[10px] text-[#050505]/40 dark:text-[#efe6dd]/40 font-medium text-right">Vergiler dâhildir.</p>
            </div>
          </div>

          {/* Right Side: Payment Form */}
          <div className="w-full md:w-[420px] bg-white dark:bg-[#0a0a0a] p-8 md:p-12 relative flex flex-col">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors hidden md:block"
            >
              <X size={16} className="text-[#050505] dark:text-[#efe6dd]" />
            </button>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-[#9a0002]/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-[#9a0002]" />
                </div>
                <h3 className="text-2xl font-black text-[#050505] dark:text-[#efe6dd] mb-2 tracking-tight">Ödeme Tamamlandı</h3>
                <p className="text-[#050505]/60 dark:text-[#efe6dd]/60 font-medium">Sponsorluk paketiniz aktif edildi.</p>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col justify-center mt-6 md:mt-0">
                <h3 className="font-bold text-[#050505] dark:text-[#efe6dd] mb-6">Kart Bilgileri</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-[#050505]/5 dark:bg-[#efe6dd]/5 p-3 rounded-xl flex gap-3 text-xs font-medium text-[#050505]/60 dark:text-[#efe6dd]/60 mb-2">
                    <Info size={16} className="shrink-0 text-[#9a0002]" />
                    <p>Sistem şu an <strong>test (sandbox)</strong> modundadır. Ödeme işlemi simüle edilecektir, rastgele kart bilgileri girebilirsiniz.</p>
                  </div>

                  {error && (
                    <div className="bg-[#9a0002]/10 text-[#9a0002] p-3 rounded-xl flex items-center gap-2 text-xs font-bold">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#050505]/60 dark:text-[#efe6dd]/60 mb-1.5">Kart Üzerindeki İsim</label>
                    <input 
                      type="text" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Ad Soyad"
                      className="w-full bg-white dark:bg-[#111] border border-[#050505]/10 dark:border-[#efe6dd]/10 rounded-xl px-4 py-3 text-sm font-bold text-[#050505] dark:text-[#efe6dd] outline-none focus:border-[#9a0002] focus:ring-2 focus:ring-[#9a0002]/20 transition-all placeholder-[#050505]/20 dark:placeholder-[#efe6dd]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#050505]/60 dark:text-[#efe6dd]/60 mb-1.5">Kart Numarası</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[#050505]/30 dark:text-[#efe6dd]/30" size={18} />
                      <input 
                        type="text" 
                        value={cardNumber} 
                        onChange={handleCardNumber}
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-white dark:bg-[#111] border border-[#050505]/10 dark:border-[#efe6dd]/10 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-[#050505] dark:text-[#efe6dd] outline-none focus:border-[#9a0002] focus:ring-2 focus:ring-[#9a0002]/20 transition-all placeholder-[#050505]/20 dark:placeholder-[#efe6dd]/20"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#050505]/60 dark:text-[#efe6dd]/60 mb-1.5">Son Kul. (AA/YY)</label>
                      <input 
                        type="text" 
                        value={expiry} 
                        onChange={handleExpiry}
                        placeholder="MM/YY"
                        className="w-full bg-white dark:bg-[#111] border border-[#050505]/10 dark:border-[#efe6dd]/10 rounded-xl px-4 py-3 text-sm font-bold text-[#050505] dark:text-[#efe6dd] outline-none focus:border-[#9a0002] focus:ring-2 focus:ring-[#9a0002]/20 transition-all placeholder-[#050505]/20 dark:placeholder-[#efe6dd]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#050505]/60 dark:text-[#efe6dd]/60 mb-1.5">CVC</label>
                      <input 
                        type="password" 
                        value={cvc} 
                        onChange={handleCvc}
                        placeholder="•••"
                        className="w-full bg-white dark:bg-[#111] border border-[#050505]/10 dark:border-[#efe6dd]/10 rounded-xl px-4 py-3 text-sm font-bold text-[#050505] dark:text-[#efe6dd] outline-none focus:border-[#9a0002] focus:ring-2 focus:ring-[#9a0002]/20 transition-all placeholder-[#050505]/20 dark:placeholder-[#efe6dd]/20"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#050505] dark:bg-[#efe6dd] hover:bg-[#9a0002] dark:hover:bg-[#9a0002] text-[#efe6dd] dark:text-[#050505] hover:text-white dark:hover:text-white font-black text-sm py-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-70 mt-6 group"
                  >
                    {loading ? 'İşleniyor...' : (
                      <>
                        <ShieldCheck size={16} className="mr-2 opacity-50" />
                        Güvenli Ödeme Yap
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] font-bold text-[#050505]/40 dark:text-[#efe6dd]/40 mt-3 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> 256-bit SSL ile korunmaktadır
                  </p>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
