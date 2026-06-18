'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Briefcase, TrendingUp, DollarSign, Activity, 
  ArrowUpRight, ArrowDownRight, UserCheck, Search, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import PixarLoader from '@/components/PixarLoader';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Fake stats for Investor Demo
  const stats = [
    { name: 'Toplam Kullanıcı', value: '12,450', change: '+14%', trend: 'up', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Aktif İlanlar', value: '4,820', change: '+8%', trend: 'up', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Aylık İş Hacmi', value: '₺2.4M', change: '+22%', trend: 'up', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Platform Komisyonu (Tahmini)', value: '₺240K', change: '+12%', trend: 'up', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  useEffect(() => {
    // Sadece admin yetkisi kontrolü eklenebilir. Şimdilik MVP için doğrudan açıyoruz.
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) return (
    <div className="flex-1 flex flex-col pt-24 bg-white dark:bg-[#050505]">
      <PixarLoader fullScreen={false} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#0a0a0a] pt-20 pb-10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Yönetici Paneli</h1>
            <p className="text-gray-500 font-medium mt-1">Platformun genel durumunu ve büyüme metriklerini inceleyin.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Kullanıcı veya İlan Ara..." className="pl-10 pr-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/20 w-64" />
            </div>
            <button className="p-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-gray-600 hover:text-rose-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <button className="px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-sm rounded-xl hover:bg-black transition-colors">
              Rapor İndir
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} dark:bg-opacity-10 flex items-center justify-center`}>
                  <stat.icon size={24} className={stat.color} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-500 font-medium text-sm mb-1">{stat.name}</h3>
              <div className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area (Placeholder for Investors) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aylık Büyüme (Gelir & Kullanıcı)</h3>
              <select className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none">
                <option>Son 6 Ay</option>
                <option>Bu Yıl</option>
              </select>
            </div>
            
            <div className="h-72 w-full flex items-end gap-4 px-4 pb-4 border-b border-gray-100 dark:border-white/5">
              {/* Fake Bar Chart */}
              {[30, 45, 35, 60, 55, 80].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-2 group">
                  <div className="relative w-full bg-rose-100 dark:bg-rose-900/20 rounded-t-xl group-hover:bg-rose-200 transition-colors" style={{ height: `${h}%` }}>
                    <div className="absolute bottom-0 left-0 right-0 bg-rose-500 rounded-t-xl opacity-80" style={{ height: `${h * 0.7}%` }}></div>
                  </div>
                  <div className="text-center text-xs font-bold text-gray-400">Ay {i+1}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Son Aktiviteler</h3>
            </div>
            <div className="space-y-5">
              {[
                { text: 'Ahmet Y. ₺2.500 teklif gönderdi', time: '5 dk önce', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-100' },
                { text: 'Yeni esnaf kaydı: Usta Eller Boya', time: '12 dk önce', icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-100' },
                { text: 'Mehmet K. ₺1.200 ödeme yaptı', time: '1 saat önce', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-100' },
                { text: 'Sistem yedeklemesi tamamlandı', time: '3 saat önce', icon: Activity, color: 'text-gray-500', bg: 'bg-gray-100' },
              ].map((act, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${act.bg} dark:bg-opacity-10 flex items-center justify-center shrink-0`}>
                    <act.icon size={18} className={act.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{act.text}</div>
                    <div className="text-xs text-gray-400">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white font-bold text-sm rounded-xl transition-colors">
              Tümünü Gör
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
