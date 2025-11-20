# Parallel Universe AI — ARCHITECTURE.md

Bu doküman, **Parallel Universe AI** uygulamasının genel mimarisini, kullanılan teknolojileri,
klasör yapısını, veri modelini ve frontend–backend–AI entegrasyonunu açıklar.

Uygulama fikri:
Kullanıcı bir fotoğraf yükler, bir "evren" (universe) seçer ve yapay zekâ o fotoğrafı
seçilen evrendeki alternatif versiyonuna dönüştürür (ör: cyberpunk, samuray, viking vb.).
Ayrıca o evrene uygun **karakter hikâyesi**, **karakter kartı** ve isteğe bağlı **poster/reel** çıktıları üretilir.

---

## 1. Genel Mimarî

Uygulama iki ana parçadan oluşur:

1. **Mobil Uygulama (Frontend)**
   - React Native (CLI)
   - Kullanıcı arayüzü, fotoğraf çekme/yükleme, evren seçimi, sonuçların gösterimi
   - Backend API’larına istek atar

2. **Backend + AI Servisi**
   - REST API (ör: Python FastAPI veya Node.js/Express)
   - Kimlik doğrulama (opsiyonel)
   - Dosya upload, job yönetimi
   - AI görüntü üretimi (image-to-image, stil transferi)
   - AI metin üretimi (hikâye, karakter kartı, poster sloganı)
   - Storage (orijinal ve üretilmiş görseller, metadata)

---

## 2. Kullanılan Teknolojiler

### 2.1. Mobil (Frontend)

- **React Native CLI** (JavaScript veya TypeScript)
- **React Navigation** (stack + bottom tab)
- State yönetimi: **Context API** veya **Zustand** (MVP için hafif çözüm)
- HTTP istekleri: `axios` veya `fetch`
- Dosya seçimi / fotoğraf:
  - `react-native-image-picker` veya `expo-image-picker` (Expo kullanırsan)
- UI kütüphanesi (opsiyonel):
  - `react-native-paper` / `native-base` / `react-native-elements`

### 2.2. Backend

- **Python FastAPI** (öneri) veya Node.js + Express
- **Celery + Redis** (veya basit job queue alternatifi) — AI işlemlerini asenkron yapmak için
- Depolama:
  - Görseller için: dosya sistemi + CDN / S3 benzeri
  - Metadata için: PostgreSQL veya MongoDB
- Kimlik doğrulama (opsiyonel): JWT + Refresh Token

### 2.3. AI Katmanı

- **Görüntü modeli**:
  - Image-to-image / style transfer (ör: Stable Diffusion tabanlı modeller, LoRA’lar)
- **Metin modeli**:
  - Story / karakter / poster metni üretimi için LLM (ör: ücretsiz/deneme API’leri)
- Her evren için:
  - Ayrı bir stil prompt / LoRA / checkpoint

---

## 3. Genel Akış (User Flow)

1. Kullanıcı uygulamayı açar → Giriş veya “misafir” olarak devam ekranı.
2. Fotoğraf yükler veya çeker.
3. Bir evren seçer (ör: Cyberpunk 2099).
4. "Generate" butonuna basar.
5. Frontend → Backend’e:
   - Fotoğraf + universeId gönderir.
6. Backend:
   - Bir **Generation Job** oluşturur.
   - AI pipeline’ına işi ekler.
   - Job ID’yi frontend’e döner.
7. Frontend:
   - Job ID’yi alır, “Generating…” ekranı gösterir.
   - Belirli aralıklarla `/jobs/:id` endpoint’ini sorgular.
8. AI iş tamamlandığında backend:
   - Üretilmiş görsel(ler)in URL’lerini kaydeder.
   - Metin (hikâye, karakter kartı, poster metni) üretir.
   - Job durumunu `COMPLETED` yapar.
9. Frontend:
   - Job sonucunu alır.
   - Kullanıcıya:
     - Evrendeki yeni fotoğrafı
     - Karakter kartını
     - Kısa hikâyeyi
     - Poster görünümünü (opsiyonel)
     - Paylaş / indir butonlarını gösterir.

---

## 4. Frontend Klasör Yapısı

Önerilen React Native klasör yapısı:

```bash
parallel-universe-ai/
├─ android/
├─ ios/
├─ app.json
├─ index.js
├─ package.json
└─ src/
   ├─ App.tsx
   ├─ navigation/
   │  ├─ RootNavigator.tsx
   │  ├─ AuthNavigator.tsx
   │  └─ MainTabNavigator.tsx
   ├─ screens/
   │  ├─ WelcomeScreen.tsx
   │  ├─ UploadScreen.tsx
   │  ├─ UniverseSelectScreen.tsx
   │  ├─ GeneratingScreen.tsx
   │  ├─ ResultScreen.tsx
   │  └─ GalleryScreen.tsx
   ├─ components/
   │  ├─ UniverseCard.tsx
   │  ├─ ResultImageCard.tsx
   │  ├─ CharacterCard.tsx
   │  └─ LoadingOverlay.tsx
   ├─ context/
   │  ├─ AuthContext.tsx
   │  └─ GenerationContext.tsx
   ├─ services/
   │  ├─ apiClient.ts
   │  └─ generationApi.ts
   ├─ hooks/
   │  ├─ useAuth.ts
   │  └─ useGeneration.ts
   ├─ utils/
   │  ├─ validators.ts
   │  └─ formatters.ts
   ├─ constants/
   │  ├─ colors.ts
   │  ├─ typography.ts
   │  └─ universes.ts
   └─ types/
      ├─ api.ts
      ├─ generation.ts
      └─ universe.ts
```

### Önemli Ekranlar

- **WelcomeScreen**  
  Uygulama tanıtımı, “Hadi başlayalım” butonu.

- **UploadScreen**  
  Fotoğraf çekme/yükleme, basit crop/preview.

- **UniverseSelectScreen**  
  Kullanıcının evren seçtiği ekran.  
  `universes.ts` içindeki config’ten kartlar oluşturulur.

- **GeneratingScreen**  
  Job state: `PENDING` / `PROCESSING`  
  Progress UI, iptal etme opsiyonu (opsiyonel).

- **ResultScreen**  
  - Üretilmiş ana görsel
  - Karakter kartı (name, class, stats)
  - Hikâye text
  - Poster görünümü + paylaş butonları

- **GalleryScreen**  
  Kullanıcının daha önce oluşturduğu tüm sonuçların listesi (lokal + backend).

---

## 5. Backend Klasör Yapısı

Örnek FastAPI tabanlı backend:

```bash
backend/
├─ app/
│  ├─ main.py
│  ├─ api/
│  │  ├─ deps.py
│  │  ├─ routes_auth.py
│  │  ├─ routes_universes.py
│  │  └─ routes_generations.py
│  ├─ core/
│  │  ├─ config.py
│  │  └─ security.py
│  ├─ models/
│  │  ├─ user.py
│  │  ├─ universe.py
│  │  └─ generation.py
│  ├─ schemas/
│  │  ├─ user.py
│  │  ├─ universe.py
│  │  └─ generation.py
│  ├─ services/
│  │  ├─ ai_image_service.py
│  │  ├─ ai_story_service.py
│  │  └─ storage_service.py
│  ├─ workers/
│  │  └─ generation_worker.py
│  └─ db/
│     ├─ base.py
│     └─ session.py
└─ requirements.txt
```

---

## 6. Veri Modeli

### 6.1 Universe (Evren)

```ts
Universe {
  id: string;
  key: string;          // 'cyberpunk_2099', 'samurai_shogun' vb.
  displayName: string;  // "Cyberpunk 2099"
  description: string;
  thumbnailUrl: string;
  stylePrompt: string;  // "neon lights, futuristic city, cyberpunk style..."
  isPremium: boolean;
}
```

### 6.2 GenerationJob (Üretim İşi)

```ts
GenerationJob {
  id: string;
  userId: string | null;     // misafir için null olabilir
  universeId: string;
  originalImageUrl: string;
  resultImageUrl: string | null;
  characterCard: CharacterCard | null;
  story: string | null;
  posterImageUrl: string | null;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  errorMessage: string | null;
}
```

### 6.3 CharacterCard

```ts
CharacterCard {
  name: string;
  title: string;            // "Cyber Ronin", "Galactic Ranger"
  roleClass: string;        // "Warrior", "Mage", "Assassin"
  stats: {
    strength: number;       // 1–10
    agility: number;
    intelligence: number;
    charisma: number;
  };
  traits: string[];         // ["Brave", "Loyal", "Reckless"]
  quote: string;            // kısa motto
}
```

---

## 7. API Tasarımı (Özet)

### 7.1 Auth (opsiyonel)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### 7.2 Universes

- `GET /api/universes`
  - Tüm mevcut evrenleri döner.
  - Frontend, UniverseSelectScreen’de bunları kullanır.

### 7.3 Generations

- `POST /api/generations`
  - Body: `{ universeId, image }` (multipart/form-data)
  - Response: `{ jobId }`
- `GET /api/generations/:id`
  - Job detaylarını ve durumunu döner.
- `GET /api/generations/user`
  - Kullanıcının geçmiş üretimlerini döner (Gallery için).

---

## 8. AI Pipeline

1. **Input:**
   - Orijinal kullanıcı fotoğrafı
   - Seçilen universe’in `stylePrompt`’u

2. **Image-to-Image Generation:**
   - Model: Identity-preserving image model (ör: Stable Diffusion + özel settings)
   - Prompt: Universe stil prompt + bazı sabit direktifler
   - Çıktı: Yeni evren görseli

3. **Metin Üretimi (LLM):**
   - Input: Universe bilgisi + görsel konteksti (prompt) + basit kullanıcı bilgisi
   - Çıktılar:
     - Kısa hikâye
     - Karakter kartı
     - Poster için tagline / slogan

4. **Poster Render:**
   - Görsel + metin birlikte poster template’ine uygulanır (canva benzeri basit template engine).

5. **Sonuç Kaydı:**
   - Görseller storage’a yüklenir.
   - DB’de GenerationJob güncellenir.

---

## 9. Güvenlik ve Gizlilik

- Yüklenen görseller:
  - Yalnızca kullanıcıya ait alanda saklanır.
  - İstenirse auto-delete (X gün sonra sil).
- Kişisel veri:
  - Sadece e-posta + hashlenmiş şifre (opsiyonel).
- Loglar:
  - Üretilen prompt’lar ve job statüleri loglanır.
  - Görsel içeriği, kimlik tanıma/face recognition için kullanılmaz.

---

## 10. MVP Kapsamı

**MVP’de zorunlu olanlar:**

- 1 mobil app (React Native)
- 1 backend (FastAPI veya Express)
- 5 temel evren:
  - Cyberpunk
  - Medieval Knight
  - Samurai
  - Viking
  - Anime
- Sadece 1 output görsel + basit hikâye.
- Gallery ekranı (son üretilenleri gösteren basit liste).

**Sonraki aşamalarda:**

- Premium evrenler
- Poster, reel, video üretimi
- Sosyal paylaşım entegrasyonu
- Kullanıcı hesap sistemi, favori evrenler, vb.

---

Bu mimari, Parallel Universe AI için hem **yatırım sunumuna uygun**, hem de adım adım geliştirebileceğin **gerçekçi bir teknik temel** sağlar.
