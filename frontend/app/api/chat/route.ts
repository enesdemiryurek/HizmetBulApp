import { API_BASE_URL } from '@/config';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Sen "HizmetBul" platformunun resmi yapay zeka asistanısın. 
Kullanıcılar senden platformla ilgili bilgi almak, doğru esnafı bulmak veya fiyat aralıkları sormak için yardım isteyecekler. 
Cevapların profesyonel, yapıcı, kısa ve net olmalı. Türkçe konuşmalısın.
HizmetBul, kullanıcıların temizlik, yazılım, tadilat, fotoğrafçılık, araç kiralama, özel ders gibi alanlarda yerel uzmanları ve esnafları bulabildiği bir hizmet pazar yeridir.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Geçerli bir mesaj dizisi gereklidir.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'AIzaSy...') {
      // API Key eklenene kadar mock/örnek cevap döndür
      return NextResponse.json({ 
        reply: "Merhaba! Şu anda Google Gemini API Key'im ayarlanmadığı için bu otomatik bir test mesajıdır. Benimle gerçek bir sohbet edebilmek için lütfen `.env.local` dosyasına kendi GEMINI_API_KEY bilginizi ekleyip uygulamayı yeniden başlatın! 😊 Size HizmetBul platformu hakkında yardımcı olmak için sabırsızlanıyorum." 
      });
    }

    // Convert messages to Gemini format
    const geminiContents = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Fetch active listings to feed the AI
    let providersData = '';
    try {
      const dbRes = await fetch(`${API_BASE_URL}/api/listings/public`);
      const dbData = await dbRes.json();
      if (dbData.success && dbData.listings) {
        const compactListings = dbData.listings.map((l: any) => ({
          name: l.user?.name || 'Anonim',
          service: l.service,
          city: l.city || l.user?.city,
          district: l.district || l.user?.district,
          avgPricePaid: l.avg_price_paid || 'Bilinmiyor',
          level: l.gamification_level || 'Çırak',
          rating: l.rating,
          reviewCount: l.reviewCount,
          profileLink: `/esnaf/db-${l.id}`
        }));
        providersData = JSON.stringify(compactListings);
      }
    } catch (e) {
      console.log('Error fetching listings for AI:', e);
    }

    const DYNAMIC_PROMPT = `${SYSTEM_PROMPT}
    
ÖNEMLİ GÖREVLERİN:
1. FİYAT TAHMİNCİSİ: Kullanıcı bir iş tarifi yaparsa, sana verilen esnaf veritabanındaki "avgPricePaid" (Gerçekleşen Ortalama Fiyat) verilerini analiz et. Eğer o iş kolunda fiyat varsa o ortalamayı söyle, yoksa kendi piyasa bilgini kullanarak mantıklı bir fiyat aralığı ver. (Örn: Bu işin piyasa ortalaması 1.200 TL - 1.500 TL arasıdır.)
2. OTOMATİK USTA EŞLEŞTİRİCİ: Kullanıcı "Bana usta bul", "Temizlikçi lazım" gibi taleplerde bulunduğunda, aşağıdaki GÜNCEL ESNAF VERİTABANI'nı kullanarak konuma, mesleğe ve kaliteye (level ve rating) göre en uygun 3 ustayı (veya ne kadar varsa) seçip güzel bir formatta sun. Seçtiğin ustaların profil linklerini (profileLink) KESİNLİKLE Markdown link formatında ver. Örnek Format: "[Usta Adı Buraya Gelecek](/esnaf/db-1)". Düz yazı olarak link verme. Seviyesi yüksek (Efsane Usta, Usta) olanlara öncelik ver.

GÜNCEL ESNAF VERİTABANI:
${providersData ? providersData : 'Şu an sistemde kayıtlı esnaf bulunamadı.'}
`;

    const payload = {
      systemInstruction: {
        parts: [{ text: DYNAMIC_PROMPT }]
      },
      contents: geminiContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      }
    };

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash-exp', 'gemini-pro'];
    let response;
    let data;

    for (const model of modelsToTry) {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      data = await response.json();

      if (response.ok) {
        break; // Successfully got a response
      } else {
        console.warn(`Model ${model} failed:`, data.error?.message);
      }
    }

    if (!response || !response.ok) {
      console.error('Tüm modeller denendi fakat Gemini API Hatası verdi:', data);
      return NextResponse.json({ error: data?.error?.message || 'Gemini sunucuları şu an aşırı yoğun. Lütfen birkaç dakika sonra tekrar deneyin.' }, { status: 503 });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Üzgünüm, cevap üretemedim.';

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Chat API Sunucu Hatası:', error);
    return NextResponse.json({ error: 'Sunucu tarafında bir hata oluştu.' }, { status: 500 });
  }
}
