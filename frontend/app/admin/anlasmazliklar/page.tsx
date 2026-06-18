'use client';
import { API_BASE_URL } from '@/config';

import { useState, useEffect } from 'react';
import { Shield, Check, X } from 'lucide-react';
import PixarLoader from '@/components/PixarLoader';

const API = `${API_BASE_URL}/api`;

interface Dispute {
  id: number;
  customer_id: number;
  provider_id: number;
  reason: string;
  status: string;
  created_at: string;
  customer: { name: string };
  provider: { name: string };
}

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const res = await fetch(`${API}/admin/disputes`, {
        // In a real app, send admin token here
        headers: { Accept: 'application/json' }
      });
      const data = await res.json();
      if (data.disputes) {
        setDisputes(data.disputes);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API}/admin/disputes/${id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchDisputes(); // Refresh
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-[72px] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-xl flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Anlaşmazlık Çözüm Merkezi</h1>
            <p className="text-sm text-gray-500">Müşteri ve Hizmet Veren arasındaki uyuşmazlıkları yönetin.</p>
          </div>
        </div>

        {loading ? (
          <div className="pt-24 flex justify-center"><PixarLoader fullScreen={false} /></div>
        ) : (
          <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Müşteri</th>
                  <th className="px-6 py-4">Hizmet Veren</th>
                  <th className="px-6 py-4">Sebep</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {disputes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                      Aktif bir anlaşmazlık bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  disputes.map(dispute => (
                    <tr key={dispute.id} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">#{dispute.id}</td>
                      <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">{dispute.customer?.name}</td>
                      <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">{dispute.provider?.name}</td>
                      <td className="px-6 py-4 text-gray-500">{dispute.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          dispute.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          dispute.status === 'resolved_customer' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {dispute.status === 'pending' ? 'Bekliyor' :
                           dispute.status === 'resolved_customer' ? 'Müşteri Haklı' : 'Uzman Haklı'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {dispute.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => resolveDispute(dispute.id, 'resolved_customer')} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Müşteri Lehine Çöz">
                              <Check size={16} />
                            </button>
                            <button onClick={() => resolveDispute(dispute.id, 'resolved_provider')} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Uzman Lehine Çöz">
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
