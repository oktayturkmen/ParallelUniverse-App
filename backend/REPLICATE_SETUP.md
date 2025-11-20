# Replicate AI Integration Setup

## 1. API Key Alın

1. **Replicate hesabı oluşturun**: https://replicate.com/signin
2. **API Token alın**: https://replicate.com/account/api-tokens
3. Token'ı kopyalayın

## 2. Backend Setup

```bash
cd backend

# Yeni dependency'leri yükle
pip install -r requirements.txt

# .env dosyası oluştur
cp .env.example .env

# .env dosyasını düzenle ve API token'ı ekle
# REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxx
```

## 3. Server'ı Yeniden Başlat

```bash
# Ctrl+C ile mevcut server'ı durdur
# Sonra tekrar başlat:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Nasıl Çalışır?

### Replicate Mode (API key varsa)
- ✅ Gerçek Stable Diffusion SDXL modeli
- ✅ Yüksek kalite avatar görselleri
- ✅ ~10-15 saniye işlem süresi
- ⚠️ Ücretli (~$0.01-0.02 per image)

### Mock Mode (API key yoksa)
- ✅ Placeholder görseller
- ✅ Hızlı (3 saniye)
- ✅ Ücretsiz
- ⚠️ Gerçek AI değil

## API Key Ekledikten Sonra

Uygulama otomatik olarak Replicate kullanacak. Frontend'de hiçbir değişiklik gerekmez!

## Maliyet

- İlk $5 ücretsiz kredi
- Sonrası: ~$0.01-0.02 per görsel
- 100 görsel ≈ $1-2

## Alternatif Modeller

`ai_service.py`'de model değiştirilebilir:

```python
# Daha hızlı (SD 1.5)
"stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf"

# Daha kaliteli (SDXL)
"stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"

# Anime style
"cjwbw/anything-v3.0:f410ed4c6a0c3bf8b76747860b3a3c9e4c8b5a827a16eac9dd5ad9642edce9a2"
```
