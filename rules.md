# Rules (Kesin Kurallar)

Bu dosya, Codex tarafında kod üretimi sırasında zorunlu olarak uygulanacak kuralları tanımlar. Aşağıdaki kuralların dışına çıkılmamalıdır.

## 1) Teknoloji ve Genel Yaklaşım

- Kodlar **React** ile yazılmalı.
- React Router kullanılmalı.
- UI tarafında yalnızca **Chakra UI v2** kullanılmalı.
- Kodlar **JavaScript (.js / .jsx)** ile yazılmalı.
- **TypeScript kesinlikle kullanılmamalı.**
- Gereksiz, ek veya istenmeyen kodlardan kaçınılmalı.
- Kod sade, okunabilir ve sürdürülebilir olmalı.

## 2) Zorunlu Klasör Yapısı

Aşağıdaki klasör yapısı korunmalı ve yeni kodlar buna göre yerleştirilmeli:

```txt
src/
  components/
  pages/
  services/
  data/
  routes/
```

- `components`: Tekrar kullanılabilir UI bileşenleri.
- `pages`: Sayfa seviyesindeki bileşenler.
- `services`: İş mantığı ve yardımcı servis fonksiyonları (API çağrısı yok).
- `data`: Mock veri dosyaları.
- `routes`: Route tanımları ve yönlendirme yapısı.

## 3) Bileşen Mimarisi ve Kod Temizliği

- Bileşenler tek sorumluluk prensibine göre bölümlendirilmeli.
- Büyük bileşenler küçük, yönetilebilir alt bileşenlere ayrılmalı.
- Tekrar eden kodlar ortak bileşene/fonksiyona taşınmalı.
- Anlamlı isimlendirme yapılmalı (değişken, fonksiyon, bileşen adları).
- Kullanılmayan import, değişken ve fonksiyon bırakılmamalı.

## 4) Veri Kullanımı

- **API kullanılmayacak.**
- Tüm veri ihtiyacı `data/` altındaki **mock data** dosyalarından karşılanacak.
- Veri yapıları temiz ve tutarlı tutulmalı.

## 5) Arama İşlevi

- Listelenen içerikler için arama işlevi bulunmalı.
- Arama kullanıcı girdisine göre anlık veya tetiklemeli olarak çalışmalı.
- Arama sonucu yoksa kullanıcıya açık bir boş durum mesajı gösterilmeli.

## 6) Responsive (Duyarlı) Tasarım

- Tüm sayfalar mobil, tablet ve masaüstünde düzgün çalışmalı.
- Chakra UI v2 responsive prop yapıları kullanılmalı (`base`, `sm`, `md`, `lg`, `xl`).
- Taşma, kırılma, üst üste binme gibi görsel sorunlar bırakılmamalı.

## 7) Genel Kod Kalitesi

- Kod üretiminde tutarlılık korunmalı.
- Basit işler için aşırı mühendislik yapılmamalı.
- Yalnızca ihtiyaç duyulan bağımlılıklar kullanılmalı.
- Her yeni dosya, klasör mimarisine ve isimlendirme standardına uymalı.

## 8) Yasaklar

- API entegrasyonu eklemek.
- İstenmeyen ekstra kütüphane eklemek.
- Klasör yapısını bozmak.
- **TypeScript kullanmak.**
- Chakra UI v2 dışındaki UI yaklaşımını temel almak.

## 9) Uygulama Kuralı

Codex, çıktı üretirken bu dosyayı birincil referans kabul etmeli; burada belirtilen kurallarla çelişen hiçbir öneri veya kod üretmemelidir.
