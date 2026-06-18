<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Listing;
use App\Models\Review;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Log;

class HizmetSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('tr_TR');

        $credentials = [];

        $data = [
            [
                'name' => 'Ahmet Yılmaz',
                'service' => 'Web Tasarım',
                'title' => 'Profesyonel Kurumsal Web Tasarım ve SEO Danışmanlığı',
                'description' => '10 yılı aşkın tecrübemle markanızın dijital dünyada parlaması için modern, mobil uyumlu ve SEO dostu web siteleri tasarlıyorum. E-ticaret siteleri, kurumsal tanıtım sayfaları ve özel yazılım çözümleri sunmaktayım. İhtiyaçlarınızı analiz edip en uygun çözümü en hızlı şekilde teslim ediyorum.',
                'process' => '1. İhtiyaç Analizi ve Teklif 2. Tasarım Onayı 3. Kodlama ve Geliştirme 4. SEO Optimizasyonu 5. Yayına Alma',
                'price_range' => '₺10.000 - ₺50.000',
                'city' => 'İstanbul',
                'district' => 'Kadıköy',
            ],
            [
                'name' => 'Fatma Kaya',
                'service' => 'Temizlik',
                'title' => 'Detaylı Ev ve Ofis Temizliği Uzmanı',
                'description' => 'Güvenilir ve titiz bir şekilde evinizin, ofisinizin dip köşe temizliğini yapıyorum. İnşaat sonrası temizlik, taşınma öncesi detaylı temizlik ve periyodik gündelik temizlik konularında profesyonel hizmet vermekteyim. Kendi malzemelerimle geliyorum.',
                'process' => '1. İletişim ve Tarih Belirleme 2. Temizlik Malzemelerinin Hazırlığı 3. Dip Köşe Temizlik 4. Müşteri Kontrolü ve Teslim',
                'price_range' => '₺1.000 - ₺3.000',
                'city' => 'Ankara',
                'district' => 'Çankaya',
            ],
            [
                'name' => 'Mehmet Demir',
                'service' => 'Tesisatçı',
                'title' => 'Acil Su Tesisatçısı ve Kaçak Tespiti (7/24)',
                'description' => 'Evinizde veya iş yerinizde meydana gelen su kaçaklarını kırmadan dökmeden, termal kamera ile nokta atışı tespit ediyoruz. Musluk tamiri, petek temizliği, tıkanıklık açma işlemlerinizi garantili olarak yapıyorum.',
                'process' => '1. Sorun Bildirimi 2. Adrese Hızlı İntikal 3. Termal Kamera ile Tespit 4. Hızlı Tamir',
                'price_range' => '₺500 - ₺5.000',
                'city' => 'İzmir',
                'district' => 'Bornova',
            ],
            [
                'name' => 'Ayşe Çelik',
                'service' => 'Diyetisyen',
                'title' => 'Online ve Yüz Yüze Kişiye Özel Beslenme Danışmanlığı',
                'description' => 'Sağlıklı yaşam ve kalıcı kilo kontrolü hedefleyenler için sürdürülebilir, yasakların olmadığı tamamen kişiye özel beslenme programları hazırlıyorum. Hastalıklarda beslenme, sporcu beslenmesi ve hamilelik dönemi takibi uzmanlık alanımdır.',
                'process' => '1. Ön Görüşme ve Kan Tahlili İncelemesi 2. Hedef Belirleme 3. Haftalık/Aylık Diyet Listesi 4. Düzenli Takip ve Motivasyon',
                'price_range' => '₺1.500 - ₺4.000',
                'city' => 'Bursa',
                'district' => 'Nilüfer',
            ],
            [
                'name' => 'Ali Veli',
                'service' => 'Boya Badana',
                'title' => 'Titiz Boya Badana ve Alçıpan Ustası',
                'description' => 'Evinizi kirletmeden, zeminleri ve eşyaları koruma altına alarak pırıl pırıl boya badana hizmeti sunuyorum. Alçı sıva, asma tavan, mantolama ve dekoratif boya işlerinizde garantili işçilik ve kaliteli malzeme kullanmaktayım.',
                'process' => '1. Ücretsiz Keşif 2. Eşyaların Korunması (Ambalajlama) 3. Boya İşlemi 4. Temiz Teslimat',
                'price_range' => '₺5.000 - ₺20.000',
                'city' => 'İstanbul',
                'district' => 'Beşiktaş',
            ],
            [
                'name' => 'Burcu Şahin',
                'service' => 'Fotoğrafçı',
                'title' => 'Dış Mekan Düğün, Nişan ve Ürün Fotoğrafçısı',
                'description' => 'En özel anlarınızı ölümsüzleştirmek için profesyonel ekipmanlarımla yanınızdayım. Düğün hikayesi, save the date, doğum fotoğrafçılığı ve e-ticaret siteleri için profesyonel ürün çekimi yapıyorum. Drone çekimi de mevcuttur.',
                'process' => '1. Konsept ve Mekan Seçimi 2. Çekim Günü 3. Profesyonel Kurgu/Montaj 4. Dijital ve Baskı Teslim',
                'price_range' => '₺3.000 - ₺15.000',
                'city' => 'Antalya',
                'district' => 'Muratpaşa',
            ],
            [
                'name' => 'Kemal Öztürk',
                'service' => 'Özel Ders',
                'title' => 'Matematik ve Geometri LGS/YKS Hazırlık Uzmanı',
                'description' => 'Matematiği sevdiren, analitik düşünmeyi geliştiren yeni nesil soru çözüm teknikleriyle öğrencileri hedeflerine ulaştırıyorum. 15 yıllık MEB tecrübemle hem eksik kapatma hem de derece isteyen öğrencilere özel program hazırlamaktayım.',
                'process' => '1. Seviye Tespit Sınavı 2. Kişiye Özel Çalışma Programı 3. Birebir Konu Anlatımı 4. Yeni Nesil Soru Çözümü',
                'price_range' => '₺600 - ₺1.200 (Saatlik)',
                'city' => 'Ankara',
                'district' => 'Yenimahalle',
            ],
            [
                'name' => 'Selin Yıldız',
                'service' => 'Spor Eğitmeni',
                'title' => 'Kişisel Antrenör (Personal Trainer) ve Pilates Eğitmeni',
                'description' => 'Amacınız ister kilo vermek, ister kas kütlesi kazanmak, isterse duruş bozukluklarını (kifoz, lordoz vb.) düzeltmek olsun; kişiye özel hazırladığım egzersiz programları ile hedefinize ulaşmanızı sağlıyorum. Evinizde, spor salonunda veya online ders imkanı.',
                'process' => '1. Fiziksel Değerlendirme 2. Program Yazımı 3. Birebir Antrenman 4. Gelişim Takibi',
                'price_range' => '₺800 - ₺2.500 (Ders Başı)',
                'city' => 'İstanbul',
                'district' => 'Şişli',
            ],
            [
                'name' => 'Hasan Arslan',
                'service' => 'Nakliyat',
                'title' => 'Sigortalı, Asansörlü Evden Eve Şehir İçi/Dışı Nakliyat',
                'description' => 'Eşyalarınızı özenle paketliyor, asansörlü sistemimizle çizilmeden, kırılmadan yeni evinize veya ofisinize taşıyoruz. Mobilya söküm ve kurulum işlemleri profesyonel ekibimiz tarafından yapılmaktadır. Tüm Türkiye\'ye hizmetimiz vardır.',
                'process' => '1. Eşya Hacmi Tespiti 2. Ambalajlama ve Paketleme 3. Güvenli Taşıma 4. Kurulum ve Yerleştirme',
                'price_range' => '₺8.000 - ₺40.000',
                'city' => 'İzmir',
                'district' => 'Karşıyaka',
            ],
            [
                'name' => 'Gökhan Kurt',
                'service' => 'Elektrikçi',
                'title' => 'Elektrik Tesisatı, Arıza Çözümü ve Aydınlatma Montajı',
                'description' => 'Priz arızaları, sigorta atması, avize montajı ve internet (cat6) kablosu çekimi gibi tüm elektrik işlerinizde uzman, belgeli hizmet. Ayrıca güvenlik kamerası ve akıllı ev sistemleri kurulumu yapmaktayım. Hızlı ve güvenilir.',
                'process' => '1. Arıza/İhtiyaç Tespiti 2. Malzeme Temini 3. Titiz İşçilik ile Kurulum/Tamir 4. Test ve Onay',
                'price_range' => '₺300 - ₺5.000',
                'city' => 'Bursa',
                'district' => 'Osmangazi',
            ],
        ];

        // Ensure fake roles
        $userRole = 'hizmet_veren'; 

        // Hardcoded users so you don't lose them
        User::create([
            'name' => 'Enes Demiryürek',
            'email' => 'enes@test.com', // Replace with your actual test email if different
            'password' => Hash::make('12345678'),
            'role' => 'hizmet_alan',
        ]);
        User::create([
            'name' => 'Ahmet Yüksek',
            'email' => 'ahmet@test.com',
            'password' => Hash::make('12345678'),
            'role' => 'hizmet_alan',
        ]);

        foreach ($data as $index => $item) {
            $email = 'esnaf' . ($index + 1) . '@test.com';
            $password = '12345678';
            $credentials[] = "Email: $email | Şifre: $password | İsim: {$item['name']} | Kategori: {$item['service']}";

            $user = User::create([
                'name' => $item['name'],
                'email' => $email,
                'password' => Hash::make($password),
                'phone' => '0555' . $faker->numberBetween(100000, 999999),
                'city' => $item['city'],
                'district' => $item['district'],
                'role' => $userRole,
                'avatar' => null, 
            ]);

            $listing = Listing::create([
                'user_id' => $user->id,
                'service' => $item['service'],
                'title' => $item['title'],
                'description' => $item['description'],
                'process' => $item['process'],
                'price_range' => $item['price_range'],
                'experience' => $faker->numberBetween(2, 20) . ' Yıl',
                'city' => $user->city,
                'district' => $user->district,
                'tags' => [$item['service'], 'Uzman', 'Garantili', 'Hızlı'],
                'cover_image' => null,
            ]);

            // Add realistic reviews
            $reviewCount = $faker->numberBetween(3, 8);
            $comments = [
                'İşini gerçekten çok iyi yapıyor, kesinlikle tavsiye ederim.',
                'Zamanında geldi, çok temiz çalıştı. Aldığı para helal olsun.',
                'Gayet memnun kaldım. Güler yüzlü ve ilgili bir usta.',
                'Söz verdiği saatte geldi, işi hızlıca bitirdi. Teşekkürler.',
                'İletişimi çok kuvvetli, beklentilerimi tam olarak karşıladı.',
                'Fiyat performans olarak çok başarılı. Çok teşekkür ederim.',
                'Biraz gecikti ama işçiliği gerçekten çok temiz, ellerine sağlık.',
            ];

            for ($r = 0; $r < $reviewCount; $r++) {
                $customer = User::create([
                    'name' => $faker->firstName . ' ' . $faker->lastName,
                    'email' => $faker->unique()->safeEmail,
                    'password' => Hash::make('password123'),
                    'role' => 'hizmet_veren',
                    'city' => $faker->randomElement(['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya']),
                    'district' => 'Merkez',
                ]);

                // Create a random listing for this customer to explode the database size
                $randomData = $faker->randomElement($data);
                Listing::create([
                    'user_id' => $customer->id,
                    'service' => $randomData['service'],
                    'title' => $randomData['title'],
                    'description' => $randomData['description'],
                    'process' => $randomData['process'],
                    'price_range' => $randomData['price_range'],
                    'experience' => $faker->numberBetween(1, 10) . ' Yıl',
                    'city' => $customer->city,
                    'district' => $customer->district,
                    'tags' => [$randomData['service'], 'Uygun Fiyatlı', 'Pratik', 'Hızlı'],
                    'cover_image' => null,
                ]);

                Review::create([
                    'listing_id' => $listing->id,
                    'user_id' => $customer->id,
                    'rating' => $faker->numberBetween(4, 5), // High ratings for realistic active providers
                    'comment' => $faker->randomElement($comments),
                    'price_paid' => $faker->numberBetween(500, 2000)
                ]);
            }
        }
        
        Log::info("--- ESNAF TEST HESAPLARI ---");
        foreach($credentials as $cred) {
            Log::info($cred);
        }
    }
}
