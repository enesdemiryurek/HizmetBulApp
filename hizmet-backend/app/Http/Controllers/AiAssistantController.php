<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AiAssistantController extends Controller
{
    /**
     * POST /api/ai/generate-listing
     * Receives a short prompt and returns generated listing details.
     */
    public function generateListing(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string|max:500',
        ]);

        $prompt = strtolower($request->prompt);

        // Simulate AI processing delay (2 seconds)
        sleep(2);

        // Simple keyword-based mock intelligence
        $category = 'Diğer';
        $title = 'Profesyonel Hizmet';
        $description = 'Müşteri memnuniyeti odaklı, kaliteli ve güvenilir hizmet sunuyoruz.';
        $process = "1. İhtiyaç Analizi\n2. Fiyatlandırma\n3. Hizmetin Verilmesi\n4. Müşteri Onayı";
        $tags = ['profesyonel', 'güvenilir'];

        if (str_contains($prompt, 'nakliy') || str_contains($prompt, 'taşıma') || str_contains($prompt, 'asansör')) {
            $category = 'Nakliyat';
            $title = 'Sigortalı ve Asansörlü Evden Eve Nakliyat';
            $description = "Eşyalarınızı kendi eşyamız gibi özenle taşıyoruz. Yılların verdiği tecrübe ile, şehir içi ve şehirler arası taşımacılıkta güvenin adresiyiz. Kırılacak eşyalarınız için özel ambalajlama yapıyor, asansör sistemimiz ile yüksek katlara hasarsız ve hızlı taşıma sağlıyoruz. Yüzde yüz müşteri memnuniyeti garantisiyle hizmetinizdeyiz.";
            $process = "1. Ücretsiz Ekspertiz: Eşyalarınızın durumunu ve miktarını yerinde inceliyoruz.\n2. Özel Ambalajlama: Mobilya, beyaz eşya ve kırılacakları patpat ve battaniyelerle sarıyoruz.\n3. Asansörlü Taşıma: Çevreye rahatsızlık vermeden eşyalarınızı araca indiriyoruz.\n4. Güvenli Sevkiyat ve Kurulum: Yeni evinizde eşyalarınızı yerleştirip mobilya montajını yapıyoruz.";
            $tags = ['Nakliyat', 'Asansörlü Taşıma', 'Sigortalı', 'Evden Eve', 'Paketleme'];
        } elseif (str_contains($prompt, 'temiz') || str_contains($prompt, 'hijyen')) {
            $category = 'Temizlik';
            $title = 'Detaylı ve Hijyenik Ev/Ofis Temizliği';
            $description = "Yaşam alanlarınızı baştan aşağı pırıl pırıl yapıyoruz. Sağlığa zararsız ekolojik temizlik malzemelerimiz ve profesyonel ekibimizle en ince ayrıntıya kadar iniyoruz. İnşaat sonrası, boş ev veya periyodik temizlik ihtiyaçlarınız için bir telefon uzağınızdayız.";
            $process = "1. Keşif ve Planlama: Alanın büyüklüğüne göre ekip ve malzeme ayarlanır.\n2. Yüzey Temizliği: Toz alma, cam silme ve zemin temizliği detaylıca yapılır.\n3. Islak Zeminler: Banyo ve mutfaklarda derinlemesine hijyen sağlanır.\n4. Son Kontrol: Teslimat öncesi her nokta tekrar gözden geçirilir.";
            $tags = ['Ev Temizliği', 'Ofis Temizliği', 'İnşaat Sonrası', 'Hijyen', 'Detaylı Temizlik'];
        } elseif (str_contains($prompt, 'tamir') || str_contains($prompt, 'boya') || str_contains($prompt, 'elektrik')) {
            $category = 'Tamirat';
            $title = 'Profesyonel Tamirat, Tadilat ve Boya İşleri';
            $description = "Evinizin tüm tamirat ve tadilat işleri uzman ellerde. Su tesisatı arızalarından elektrik işlerine, boya badanadan alçıpan işlerine kadar her türlü ihtiyacınıza hızlı ve kalıcı çözümler üretiyoruz. Temiz işçilik ve uygun fiyat garantisiyle yanınızdayız.";
            $process = "1. Arıza Tespit: Sorunun kaynağı veya yapılacak işin kapsamı belirlenir.\n2. Fiyatlandırma: Malzeme ve işçilik dahil şeffaf bir teklif sunulur.\n3. Uygulama: En kaliteli malzemeler kullanılarak iş temiz bir şekilde tamamlanır.\n4. Test ve Teslim: Çalışan sistemler test edilip müşteri onayı alınır.";
            $tags = ['Tamirat', 'Tadilat', 'Boya Badana', 'Usta', 'Garantili İşçilik'];
        } elseif (str_contains($prompt, 'yazılım') || str_contains($prompt, 'site') || str_contains($prompt, 'web')) {
            $category = 'Yazılım & Tasarım';
            $title = 'Modern Web Tasarımı ve Yazılım Çözümleri';
            $description = "İşletmenizi dijital dünyaya en şık ve hızlı şekilde taşıyoruz. SEO uyumlu, mobil cihazlarla kusursuz çalışan ve modern tasarımlara sahip web siteleri geliştiriyoruz. Kurumsal sitelerden e-ticaret platformlarına kadar her türlü dijital ihtiyacınız için profesyonel çözümler sunuyoruz.";
            $process = "1. İhtiyaç Analizi: Beklentilerinizi ve hedef kitlenizi dinliyoruz.\n2. UI/UX Tasarım: Göz alıcı ve kullanıcı dostu arayüzler tasarlıyoruz.\n3. Geliştirme: En güncel teknolojilerle (React, Next.js vb.) kodluyoruz.\n4. Test ve Yayın: Performans ve güvenlik testlerinden sonra sitenizi yayına alıyoruz.";
            $tags = ['Web Tasarım', 'Yazılım', 'SEO', 'E-Ticaret', 'Modern Arayüz'];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'title' => $title,
                'description' => $description,
                'process' => $process,
                'tags' => $tags,
                'category' => $category,
            ]
        ]);
    }

    /**
     * POST /api/ai/summarize-reviews
     * Receives an array of reviews and returns an AI generated summary.
     */
    public function summarizeReviews(Request $request)
    {
        $request->validate([
            'reviews' => 'required|array',
        ]);

        $reviews = $request->reviews;

        if (count($reviews) === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Özetlenecek yorum bulunamadı.'
            ]);
        }

        // Simulate AI processing
        sleep(1);

        $totalRating = 0;
        $texts = '';
        foreach ($reviews as $r) {
            $totalRating += floatval($r['rating'] ?? 5);
            $texts .= ' ' . strtolower($r['comment'] ?? '');
        }
        $avgRating = $totalRating / count($reviews);

        $positiveKeywords = ['hızlı', 'temiz', 'harika', 'güzel', 'memnun', 'teşekkür', 'tavsiye', 'iyi', 'profesyonel', 'kaliteli'];
        $negativeKeywords = ['yavaş', 'kötü', 'gecik', 'pahalı', 'eksik', 'sorun', 'baştansavma', 'berbat'];

        $posCount = 0;
        $negCount = 0;

        foreach ($positiveKeywords as $word) {
            if (str_contains($texts, $word)) $posCount++;
        }
        foreach ($negativeKeywords as $word) {
            if (str_contains($texts, $word)) $negCount++;
        }

        $summary = "Müşteriler genel olarak bu uzmanın hizmetinden memnun.";

        if ($avgRating >= 4.5) {
            if ($posCount > 2) {
                $summary = "✨ Müşteriler genellikle uzmanın işçiliğini, hızını ve profesyonelliğini övüyor. Hizmet kalitesinden oldukça memnun kalmışlar ve şiddetle tavsiye ediyorlar.";
            } else {
                $summary = "✨ Müşteriler sunulan hizmetin kalitesini yüksek buluyor ve sonuçlardan oldukça memnun kalmış durumdalar.";
            }
        } elseif ($avgRating >= 3.5) {
            if ($negCount > 0) {
                $summary = "Müşteriler hizmet kalitesini yeterli buluyor, ancak bazı kullanıcılar iletişim veya hız konusunda küçük aksaklıklar yaşandığını belirtmiş.";
            } else {
                $summary = "Müşteriler genel olarak hizmetten memnun kalmış ve standart beklentilerin karşılandığını ifade etmişler.";
            }
        } else {
            $summary = "Müşteri yorumları karışık. Bazı kullanıcılar hizmet kalitesi, hız veya iletişim konularında çeşitli sorunlar yaşadıklarını raporlamış.";
        }

        return response()->json([
            'success' => true,
            'summary' => $summary
        ]);
    }
}
