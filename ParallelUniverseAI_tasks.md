# tasks.md — Parallel Universe AI

Küçük, tek amaçlı, hızlı test edilebilir görevler. MVP geliştirme sürecine göre sıralanmıştır.

---

## 1. Proje Kurulumu (Frontend)

- [ ] 1.1. Yeni React Native CLI projesi oluştur (`parallel-universe-ai`).
- [ ] 1.2. Gerekli bağımlılıkları kur:
  - react-navigation
  - axios
  - react-native-image-picker
- [ ] 1.3. Placeholder bir ekran ile projenin çalıştığını doğrula.

---

## 2. Proje Yapısını Oluşturma

- [ ] 2.1. `src/` klasörünü oluştur.
- [ ] 2.2. `navigation/RootNavigator.tsx` oluştur.
- [ ] 2.3. Ekran klasörlerini oluştur (`screens/`).
- [ ] 2.4. Komponent klasörünü oluştur (`components/`).
- [ ] 2.5. context, services, hooks, utils, constants klasörlerini ekle.

---

## 3. Navigation Kurulumu

- [ ] 3.1. React Navigation Stack kurulumu.
- [ ] 3.2. WelcomeScreen → UploadScreen → UniverseSelectScreen → GeneratingScreen → ResultScreen akışını oluştur.
- [ ] 3.3. `App.tsx` içinde NavigationContainer ile entegre et.

---

## 4. Fotoğraf Yükleme

- [ ] 4.1. UploadScreen tasarımı.
- [ ] 4.2. react-native-image-picker ile fotoğraf yüklemeyi aktif et.
- [ ] 4.3. Yüklenen fotoğrafı state’e kaydet.
- [ ] 4.4. “Devam et” butonuyla UniverseSelectScreen’e yönlendir.

---

## 5. Universe Select Modülü

- [ ] 5.1. `constants/universes.ts` dosyasını oluştur (5 temel evren).
- [ ] 5.2. UniverseCard bileşenini oluştur.
- [ ] 5.3. UniverseSelectScreen’de tüm evrenleri listele.
- [ ] 5.4. Seçilen evreni global state’e kaydet.

---

## 6. Backend Temel API Entegrasyonu

- [ ] 6.1. `services/apiClient.ts` içinde axios client oluştur.
- [ ] 6.2. `/api/generations` için POST isteği yaz.
- [ ] 6.3. Backend’den dönen jobId’yi sakla.
- [ ] 6.4. `/api/generations/:id` endpoint’i için getStatus fonksiyonu yaz.

---

## 7. Generating Screen

- [ ] 7.1. Job ID alıp backend’den statü sorgulaması yap.
- [ ] 7.2. Her 2 saniyede bir job durumunu tekrar kontrol et.
- [ ] 7.3. Job `COMPLETED` olduğunda ResultScreen’e yönlendir.

---

## 8. Result Screen

- [ ] 8.1. AI tarafından oluşturulan ana görseli ekranda göster.
- [ ] 8.2. Hikâye metnini göster.
- [ ] 8.3. Karakter kartını göster.
- [ ] 8.4. Paylaş / indir butonlarını ekle.

---

## 9. Gallery (Geçmiş Sonuçlar)

- [ ] 9.1. Lokal storage kullan (AsyncStorage).
- [ ] 9.2. Yeni sonuçları gallery'e kaydet.
- [ ] 9.3. GalleryScreen’de sonuçları listele.
- [ ] 9.4. Eski sonuç görüntüleme sayfası oluştur.

---

## 10. Premium Modülü (MVP Sonrası)

- [ ] 10.1. Premium evrenlerin kilitli olduğunu göster.
- [ ] 10.2. “Upgrade to Premium” ekranı oluştur.
- [ ] 10.3. Stripe / IAP entegrasyonu (isteğe bağlı).

---
