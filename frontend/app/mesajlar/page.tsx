'use client';
import { API_BASE_URL } from '@/config';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Search, Check, CheckCheck, CheckCircle2, MessageSquare, Paperclip, X, Shield } from 'lucide-react';
import PixarLoader from '@/components/PixarLoader';

const API = `${API_BASE_URL}/api`;

interface UserData {
  id: number;
  name: string;
  avatar?: string | null;
  last_seen_at?: string | null;
}

interface MessageData {
  id: number;
  body: string;
  sender_id: number;
  is_read: boolean;
  created_at: string;
  attachment_url?: string | null;
}

interface ConversationData {
  id: number;
  other_user: UserData;
  last_message: {
    body: string;
    created_at: string;
    is_read: boolean;
    sender_id: number;
  } | null;
  updated_at: string;
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0a0a0a] flex items-center justify-center"><PixarLoader fullScreen={false} /></div>}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoOpenId = searchParams?.get('to'); // e.g. ?to=5

  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [selectedConv, setSelectedConv] = useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [spamError, setSpamError] = useState('');
  const [loading, setLoading] = useState(true);

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerDetail, setOfferDetail] = useState('');

  const [paymentOfferId, setPaymentOfferId] = useState<number | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedConvRef = useRef<ConversationData | null>(null);

  useEffect(() => {
    selectedConvRef.current = selectedConv;
  }, [selectedConv]);

  const fetchConversations = async (showLoading = true) => {
    const token = localStorage.getItem('auth_token');
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`${API}/conversations`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        
        // If there's an auto-open user ID and no conversation is selected
        if (autoOpenId && showLoading) {
           const existing = data.conversations.find((c: any) => c.other_user.id.toString() === autoOpenId);
           if (existing) {
             selectConversation(existing);
           } else {
             // Create a dummy conversation visually until first message is sent
             fetch(`${API}/user/${autoOpenId}`) // Optionally fetch user details if needed
             // For MVP, if they don't exist in conversations, we just send a message directly to autoOpenId
           }
        }
      }
    } catch (e) {
      console.error('Error fetching convos:', e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchMessages = async (convId: number, scrollToBottom = true) => {
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`${API}/conversations/${convId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      const data = await res.json();
      if (data.messages) {
        setMessages(prev => {
          if (prev.length !== data.messages.length) return data.messages;
          const lastPrev = prev[prev.length - 1];
          const lastNew = data.messages[data.messages.length - 1];
          if (lastPrev && lastNew && (lastPrev.id !== lastNew.id || lastPrev.is_read !== lastNew.is_read)) return data.messages;
          return prev;
        });
        if (scrollToBottom) {
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      }
    } catch (e) {}
  };

    // Initial load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.push('/giris-yap');
      return;
    }
    const u = JSON.parse(userStr);
    setCurrentUser(u);

    fetchConversations();
    
    // Polling every 5 seconds for new messages (Real-time MVP)
    const interval = setInterval(() => {
      fetchConversations(false);
      if (selectedConvRef.current) {
        fetchMessages(selectedConvRef.current.id, false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoOpenId, router]);

  const selectConversation = (conv: ConversationData) => {
    setSelectedConv(conv);
    fetchMessages(conv.id, true);
  };

  const handleSendMessage = async (e?: React.FormEvent, overrideBody?: string) => {
    if (e) e.preventDefault();
    
    const bodyToSend = overrideBody !== undefined ? overrideBody : newMessage;
    
    if (!bodyToSend.trim() && !attachment) return;
    setSpamError('');

    const token = localStorage.getItem('auth_token');
    const currentAttachment = attachment;
    
    if (overrideBody === undefined) {
      setNewMessage('');
    }
    setAttachment(null);
    
    // optimistic UI (only for text)
    if (bodyToSend && !currentAttachment) {
      const tempMsg: MessageData = {
        id: Date.now(),
        body: bodyToSend,
        sender_id: currentUser!.id,
        is_read: false,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMsg]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }

    const formData = new FormData();
    if (bodyToSend) formData.append('body', bodyToSend);
    if (currentAttachment) formData.append('attachment', currentAttachment);

    if (selectedConv) {
       formData.append('conversation_id', selectedConv.id.toString());
       formData.append('receiver_id', selectedConv.other_user.id.toString());
    } else if (autoOpenId) {
       formData.append('receiver_id', autoOpenId);
    }

    try {
      const res = await fetch(`${API}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) {
         if (data.error) {
             setSpamError(data.error);
             // Revert optimistic clear if it failed due to spam
             if (overrideBody === undefined) {
               setNewMessage(bodyToSend);
             }
         }
         return;
      }

      if (data.message === 'Mesaj gönderildi') {
        if (!selectedConv && autoOpenId) {
           fetchConversations();
        } else {
           fetchMessages(selectedConv!.id, false);
           fetchConversations(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOfferAction = async (msgId: number, action: 'accept' | 'reject' | 'complete') => {
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`${API}/messages/${msgId}/handle-offer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok && data.success && selectedConv) {
        // Refresh messages after action
        fetchMessages(selectedConv.id, false);
      }
    } catch (e) {
      console.error('Error handling offer:', e);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const getLastSeenStatus = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const lastSeen = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 5) return 'Çevrimiçi';
    if (diffMins < 60) return `Son görülme: ${diffMins} dakika önce`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Son görülme: ${diffHours} saat önce`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return `Son görülme: Dün`;
    return `Son görülme: ${diffDays} gün önce`;
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0a0a0a] flex flex-col pt-[72px]">
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex md:py-6 md:px-4 lg:px-8 h-[calc(100vh-72px)]">
        
        <div className="w-full flex bg-white dark:bg-[#111] md:rounded-3xl shadow-xl border border-gray-200/60 dark:border-white/10 overflow-hidden">
          {/* Left Sidebar (Conversations) */}
          <div className={`w-full md:w-[380px] lg:w-[420px] flex-shrink-0 border-r border-gray-200 dark:border-white/10 flex flex-col bg-white dark:bg-[#111] z-20 ${selectedConv || autoOpenId ? 'hidden md:flex' : 'flex'}`}>
            <div className="h-[72px] px-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0">
              <h1 className="font-black text-gray-900 dark:text-white text-2xl tracking-tight">Sohbetler</h1>
            </div>
            
            <div className="p-4 shrink-0">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                <input type="text" placeholder="Sohbet veya kişi ara..." className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white dark:focus:bg-[#1a1a1a] transition-all border border-transparent focus:border-rose-200 dark:focus:border-rose-500/30 text-gray-800 dark:text-gray-200" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1 custom-scrollbar">
              {loading ? (
                <div className="flex-1 flex flex-col pt-24 bg-white dark:bg-[#050505]">
                  <PixarLoader fullScreen={false} />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center gap-3 opacity-60">
                  <MessageSquare size={40} className="text-gray-300" />
                  <div className="text-sm font-bold text-gray-500">Henüz hiç mesajınız yok.</div>
                </div>
              ) : (
                conversations.map(conv => {
                  const isActive = selectedConv?.id === conv.id;
                  const isUnread = conv.last_message && !conv.last_message.is_read && conv.last_message.sender_id !== currentUser.id;
                  
                  return (
                    <button 
                      key={conv.id} 
                      onClick={() => selectConversation(conv)}
                      className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group ${isActive ? 'bg-rose-50 dark:bg-rose-500/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold text-xl shadow-sm overflow-hidden">
                          {conv.other_user.avatar ? <img src={conv.other_user.avatar} className="w-full h-full object-cover" /> : conv.other_user.name.charAt(0)}
                        </div>
                        {isUnread && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#111] rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-bold text-[15px] truncate ${isUnread ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>{conv.other_user.name}</span>
                          {conv.last_message && (
                            <span className={`text-[11px] font-semibold shrink-0 ${isUnread ? 'text-emerald-500' : 'text-gray-400'}`}>{formatTime(conv.last_message.created_at)}</span>
                          )}
                        </div>
                        {conv.last_message && (
                          <div className="flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400">
                            {conv.last_message.sender_id === currentUser.id && (
                              conv.last_message.is_read ? <CheckCheck size={16} className="text-blue-500 shrink-0" /> : <Check size={16} className="shrink-0" />
                            )}
                            <span className={`truncate ${isUnread ? 'font-bold text-gray-900 dark:text-white' : ''}`}>
                              {conv.last_message.body.startsWith('OFFER|') ? 'Teklif Gönderildi' :
                               conv.last_message.body.startsWith('OFFER_ACCEPTED|') ? 'Ödeme Yapıldı - İş Başladı' :
                               conv.last_message.body.startsWith('OFFER_COMPLETED|') ? 'İş Tamamlandı' :
                               conv.last_message.body.startsWith('OFFER_REJECTED|') ? 'Teklif Reddedildi' :
                               conv.last_message.body}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Chat Area */}
          <div className={`flex-1 flex flex-col relative ${!selectedConv && !autoOpenId ? 'hidden md:flex' : 'flex'} bg-amber-50/30 dark:bg-[#0a0a0a]`}>
            {selectedConv || autoOpenId ? (
               <>
                 {/* Chat Header */}
                 <div className="h-[72px] px-6 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md border-b border-gray-200/60 dark:border-white/10 flex items-center justify-between shrink-0 z-10 absolute top-0 left-0 right-0">
                   <div className="flex items-center gap-4">
                     <button className="md:hidden p-2 -ml-3 text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => { setSelectedConv(null); router.push('/mesajlar'); }}>
                       <ArrowLeft size={22} />
                     </button>
                     <div className="flex items-center gap-3 cursor-pointer">
                       <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white font-bold shadow-sm overflow-hidden">
                         {selectedConv ? (selectedConv.other_user.avatar ? <img src={selectedConv.other_user.avatar} className="w-full h-full object-cover" /> : selectedConv.other_user.name.charAt(0)) : '?'}
                       </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-[15px]">{selectedConv?.other_user.name || 'Yeni Mesaj'}</div>
                          {selectedConv?.other_user.last_seen_at && getLastSeenStatus(selectedConv.other_user.last_seen_at) === 'Çevrimiçi' ? (
                            <div className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Çevrimiçi
                            </div>
                          ) : selectedConv?.other_user.last_seen_at ? (
                            <div className="text-[11px] font-medium text-gray-500">
                              {getLastSeenStatus(selectedConv.other_user.last_seen_at)}
                            </div>
                          ) : null}
                        </div>
                     </div>
                   </div>
                 </div>

                 {/* Messages Area */}
                 <div className="flex-1 overflow-y-auto p-6 space-y-4 pt-24 custom-scrollbar" style={{ backgroundImage: "url('https://i.pinimg.com/originals/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')", backgroundSize: '400px', backgroundRepeat: 'repeat', backgroundBlendMode: 'soft-light', opacity: 0.9 }}>
                    {messages.map((msg, i) => {
                      const isMe = Number(msg.sender_id) === Number(currentUser.id);
                      return (
                        <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] md:max-w-[65%] px-4 py-2.5 shadow-sm text-[15px] relative group ${isMe ? 'bg-emerald-50 dark:bg-emerald-900/30 text-gray-900 dark:text-gray-100 rounded-2xl rounded-br-sm border border-emerald-100 dark:border-emerald-800/30' : 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-sm border border-gray-100 dark:border-white/5'}`}>
                            <div className="leading-relaxed">
                              {msg.body && (
                                (msg.body.startsWith('OFFER|') || msg.body.startsWith('OFFER_ACCEPTED|') || msg.body.startsWith('OFFER_COMPLETED|') || msg.body.startsWith('OFFER_REJECTED|')) ? (() => {
                                  const parts = msg.body.split('|');
                                  const type = parts[0]; // OFFER, OFFER_ACCEPTED, OFFER_COMPLETED, OFFER_REJECTED
                                  const price = parts[1];
                                  const detail = parts.slice(2).join('|');
                                  
                                  const isAccepted = type === 'OFFER_ACCEPTED';
                                  const isCompleted = type === 'OFFER_COMPLETED';
                                  const isRejected = type === 'OFFER_REJECTED';
                                  const isPending = type === 'OFFER';

                                  return (
                                    <div className={`rounded-xl p-4 border shadow-sm mt-1 mb-1 min-w-[240px] transition-colors ${isCompleted ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30' : isAccepted ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30' : isRejected ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30' : 'bg-white dark:bg-black/40 border-rose-100 dark:border-rose-900/30'}`}>
                                      <div className={`flex items-center gap-2 font-black mb-3 text-lg ${isCompleted ? 'text-blue-600' : isAccepted ? 'text-emerald-600' : isRejected ? 'text-red-600' : 'text-rose-600'}`}>
                                        {isCompleted ? <CheckCheck size={20} /> : isAccepted ? <CheckCircle2 size={20} /> : isRejected ? <X size={20} /> : <CheckCircle2 size={20} />} 
                                        {isCompleted ? 'İş Tamamlandı' : isAccepted ? 'Ödeme Güvende - İş Başladı' : isRejected ? 'Teklif Reddedildi' : 'Yeni Teklif'}
                                      </div>
                                      <div className="text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-4">{detail}</div>
                                      <div className="text-3xl font-black text-gray-900 dark:text-white mb-5">{price} <span className="text-lg text-gray-500">TL</span></div>
                                      
                                      {isPending && !isMe && (
                                        <div className="flex gap-2">
                                          <button onClick={() => setPaymentOfferId(msg.id)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95 shadow-md shadow-emerald-500/20">Kabul Et ve Öde</button>
                                          <button onClick={() => handleOfferAction(msg.id, 'reject')} className="flex-1 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95">Reddet</button>
                                        </div>
                                      )}
                                      
                                      {isPending && isMe && (
                                        <div className="text-center text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-500/10 py-2 rounded-lg">Cevap Bekleniyor</div>
                                      )}

                                      {isAccepted && !isMe && (
                                        <div className="mt-2">
                                          <button onClick={() => handleOfferAction(msg.id, 'complete')} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95 shadow-md shadow-blue-500/20">İşi Teslim Aldım</button>
                                          <p className="text-[10px] text-center text-gray-500 mt-2 font-medium">Bu butona bastığınızda ödeme esnafa aktarılır.</p>
                                        </div>
                                      )}

                                      {isAccepted && isMe && (
                                        <div className="text-center text-xs font-bold text-emerald-700 bg-emerald-100/50 py-2 rounded-lg border border-emerald-200/50">Müşteri işi onayladığında paranız IBAN'ınıza aktarılacak.</div>
                                      )}

                                      {isCompleted && (
                                        <div className="text-center text-xs font-bold text-blue-700 bg-blue-100/50 py-2 rounded-lg border border-blue-200/50">Tutar esnafa aktarıldı. Artık profiline yorum yapabilirsiniz.</div>
                                      )}

                                      {isRejected && (
                                        <div className="mt-3">
                                          <button 
                                            onClick={() => {
                                               setShowOfferModal(true);
                                            }} 
                                            className="w-full bg-white dark:bg-[#111] border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-rose-500 hover:text-rose-600 text-gray-600 dark:text-gray-400 font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95"
                                          >
                                            Karşı Teklif Ver
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })() : msg.body
                              )}
                              
                              {msg.attachment_url && (
                                <div className="mt-2 mb-1">
                                  {msg.attachment_url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                    <a href={msg.attachment_url} target="_blank" rel="noreferrer">
                                      <img src={msg.attachment_url} alt="Ek" className="rounded-xl max-w-full h-auto max-h-[200px] object-cover cursor-zoom-in" />
                                    </a>
                                  ) : (
                                    <a href={msg.attachment_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-3 bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-white/80 transition-colors text-sm">
                                      <Paperclip size={16} />
                                      <span className="font-medium underline">Dosyayı Görüntüle</span>
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-[10px] mt-1 text-right flex items-center justify-end gap-1 text-gray-400 font-medium">
                              {formatTime(msg.created_at)}
                              {isMe && (msg.is_read ? <CheckCheck size={15} className="text-blue-500" /> : <Check size={15} className="text-gray-400" />)}
                            </div>
                          </div>
                        </div>
                      );
                   })}
                   <div ref={messagesEndRef} className="h-4" />
                 </div>

                 {/* Message Input */}
                 <div className="p-4 bg-white dark:bg-[#111] border-t border-gray-200/60 dark:border-white/10 shrink-0">
                   {spamError && (
                     <div className="max-w-4xl mx-auto mb-3 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold border border-rose-100 flex items-center justify-between">
                       <span>{spamError}</span>
                       <button onClick={() => setSpamError('')}><X size={16} /></button>
                     </div>
                   )}
                   {attachment && (
                     <div className="max-w-4xl mx-auto mb-3 flex items-center gap-2">
                       <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                         <Paperclip size={14} />
                         <span className="truncate max-w-[200px]">{attachment.name}</span>
                         <button onClick={() => setAttachment(null)} className="text-gray-500 hover:text-rose-500 ml-2">
                           <X size={14} />
                         </button>
                       </div>
                     </div>
                   )}
                   <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto items-end">
                     <button
                       type="button"
                       onClick={() => setShowOfferModal(true)}
                       className="px-4 h-[52px] rounded-2xl text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center justify-center gap-2 transition-all dark:text-rose-400 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 font-bold shrink-0 shadow-sm"
                       title="Teklif Gönder"
                     >
                       <span className="font-black text-xl">₺</span>
                       <span className="hidden sm:inline">Teklif Gönder</span>
                     </button>
                     <button
                       type="button"
                       onClick={() => fileInputRef.current?.click()}
                       className="w-12 h-[52px] rounded-2xl text-gray-500 bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-all dark:bg-[#1a1a1a] dark:text-gray-400 dark:hover:bg-white/5"
                       title="Dosya Ekle"
                     >
                       <Paperclip size={20} />
                     </button>
                     <input 
                       type="file" 
                       className="hidden" 
                       ref={fileInputRef}
                       onChange={(e) => {
                         if (e.target.files && e.target.files[0]) {
                           setAttachment(e.target.files[0]);
                         }
                       }}
                     />
                     <div className="flex-1 relative">
                       <textarea
                         value={newMessage}
                         onChange={(e) => setNewMessage(e.target.value)}
                         onKeyDown={(e) => {
                           if (e.key === 'Enter' && !e.shiftKey) {
                             e.preventDefault();
                             handleSendMessage();
                           }
                         }}
                         placeholder="Bir mesaj yazın..."
                         rows={1}
                         className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl pl-5 pr-12 py-3.5 text-[15px] outline-none focus:border-rose-500 focus:bg-white transition-all resize-none max-h-32 custom-scrollbar dark:text-white"
                         style={{ minHeight: '52px' }}
                       />
                     </div>
                     <button 
                       type="submit" 
                       disabled={(!newMessage.trim() && !attachment)}
                       className="w-[52px] h-[52px] rounded-2xl bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 disabled:opacity-50 disabled:bg-gray-300 transition-all shrink-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                     >
                       <Send size={22} className="ml-1" />
                     </button>
                   </form>
                 </div>
               </>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-[#0a0a0a]">
                 <div className="w-24 h-24 bg-white dark:bg-[#111] shadow-sm border border-gray-100 dark:border-white/5 rounded-full flex items-center justify-center mb-6">
                   <MessageSquare size={40} className="text-rose-500 ml-1" />
                 </div>
                 <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2 tracking-tight">HizmetBul Web Web</h3>
                 <p className="text-gray-500 font-medium max-w-sm">
                   Sohbet başlatmak veya mesajlarınızı görüntülemek için sol taraftan bir kişi seçin. Mesajlarınız anlık olarak iletilir.
                 </p>
               </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-[#111] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center font-black text-xl">₺</div>
                 <h3 className="text-xl font-black text-gray-900 dark:text-white">Yeni Teklif Oluştur</h3>
              </div>
              <form onSubmit={(e) => {
                 e.preventDefault();
                 if(!offerPrice) return;
                 handleSendMessage(undefined, `OFFER|${offerPrice}|${offerDetail}`);
                 setShowOfferModal(false);
                 setOfferPrice('');
                 setOfferDetail('');
              }} className="space-y-4">
                 <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Teklif Tutarı</label>
                   <div className="relative">
                     <input type="number" required value={offerPrice} onChange={e => setOfferPrice(e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-4 pr-12 py-3.5 outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-[#1a1a1a] font-black text-2xl dark:text-white transition-all" placeholder="0" />
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">TL</div>
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Açıklama <span className="text-gray-400 font-medium">(İsteğe Bağlı)</span></label>
                   <textarea value={offerDetail} onChange={e => setOfferDetail(e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-[#1a1a1a] min-h-[100px] resize-none dark:text-white transition-all" placeholder="Teklif detaylarını yazın..." />
                 </div>
                 <div className="flex gap-3 pt-4">
                   <button type="button" onClick={() => setShowOfferModal(false)} className="flex-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-bold py-3.5 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/20 transition-all active:scale-95">İptal</button>
                   <button type="submit" className="flex-[2] bg-rose-600 text-white font-bold py-3.5 rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/30 active:scale-95 flex items-center justify-center gap-2">
                     <CheckCircle2 size={18} />
                     Teklifi Gönder
                   </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Escrow Payment Modal */}
      {paymentOfferId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-[#111] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center font-black">
                   <Shield size={20} />
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-gray-900 dark:text-white">Güvenli Ödeme</h3>
                   <p className="text-xs text-gray-500">Iyzico & Param Güvende</p>
                 </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                Tutar şu anda havuz hesabına aktarılacaktır. Hizmeti teslim aldığınızı onaylayana kadar esnafa aktarılmaz.
              </p>
              <form onSubmit={async (e) => {
                 e.preventDefault();
                 setProcessingPayment(true);
                 // Simulate API delay
                 await new Promise(r => setTimeout(r, 1500));
                 handleOfferAction(paymentOfferId, 'accept');
                 setPaymentOfferId(null);
                 setProcessingPayment(false);
              }} className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Kart Numarası</label>
                   <input type="text" required placeholder="0000 0000 0000 0000" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-mono text-sm dark:text-white" />
                 </div>
                 <div className="flex gap-3">
                   <div className="flex-1">
                     <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">SKT</label>
                     <input type="text" required placeholder="MM/YY" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-mono text-sm dark:text-white" />
                   </div>
                   <div className="flex-1">
                     <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">CVC</label>
                     <input type="text" required placeholder="***" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-mono text-sm dark:text-white" />
                   </div>
                 </div>
                 
                 <div className="flex gap-3 pt-4">
                   <button type="button" disabled={processingPayment} onClick={() => setPaymentOfferId(null)} className="flex-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50">İptal</button>
                   <button type="submit" disabled={processingPayment} className="flex-[2] bg-emerald-500 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50">
                     {processingPayment ? <span className="animate-spin w-5 h-5 border-2 border-white/40 border-t-white rounded-full"></span> : 'Ödemeyi Tamamla'}
                   </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
