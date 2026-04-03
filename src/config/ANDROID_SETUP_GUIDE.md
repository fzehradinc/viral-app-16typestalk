# Android Setup Guide — Noorbloom

Bu rehber, Noorbloom Android uygulamasını Google Play Store'a yüklemek için
gereken tüm manuel kurulum adımlarını içerir.

---

## 1. Firebase Console — Android App Ekleme

1. https://console.firebase.google.com adresine git
2. Noorbloom projesini seç (Swift projesinde zaten mevcut olmalı)
3. **"Add app"** → **Android** seç
4. Package name: `com.noorbloom`
5. App nickname: `Noorbloom Android`
6. **google-services.json** dosyasını indir
7. `android/app/` klasörüne koy (mevcut `google-services.json.example` ile aynı dizine)

---

## 2. Keystore Oluşturma

Terminal'de çalıştır:

```bash
cd android/app
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore noorbloom-release.keystore \
  -alias noorbloom-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Sorulara cevap ver:
- **First and last name:** Noorbloom
- **Organizational unit:** Mobile
- **Organization:** Noorbloom
- **City:** Istanbul
- **State:** Istanbul
- **Country code:** TR

Sonra `android/gradle.properties` dosyasını güncelle:

```properties
MYAPP_UPLOAD_STORE_FILE=noorbloom-release.keystore
MYAPP_UPLOAD_STORE_PASSWORD=[seçtiğin şifre]
MYAPP_UPLOAD_KEY_ALIAS=noorbloom-key
MYAPP_UPLOAD_KEY_PASSWORD=[seçtiğin şifre]
```

> **ÖNEMLİ:** `gradle.properties` `.gitignore`'a eklenmiştir. Şifreleri asla Git'e commit etme.

---

## 3. GoogleService-Info.plist (iOS)

Swift projesindeki `ios/noorbloom/` klasöründen `GoogleService-Info.plist` dosyasını
al ve React Native `ios/Noorbloom/` klasörüne koy.

---

## 4. RevenueCat Android Ürün Kurulumu

1. https://app.revenuecat.com'da **Android app** ekle
2. Package name: `com.noorbloom`
3. Google Play'de in-app products oluştur:
   - `noorbloom_monthly` (aylık abonelik)
   - `noorbloom_yearly` (yıllık abonelik)
4. Android API key'i `src/config/env.ts`'e gir:
   ```
   REVENUECAT_ANDROID_KEY: 'goog_...'
   ```

---

## 5. AdMob Android Kurulumu

1. https://admob.google.com'da **Android app** ekle
2. App ID'yi al ve şu dosyalara gir:
   - `android/app/src/main/AndroidManifest.xml` → `com.google.android.gms.ads.APPLICATION_ID` meta-data value
   - `src/config/env.ts` → `ADMOB_ANDROID_APP_ID`
3. Banner ve Rewarded ad unit ID'lerini `src/config/env.ts`'e gir:
   ```
   ADMOB_BANNER_ANDROID: 'ca-app-pub-XXXX/YYYY'
   ADMOB_REWARDED_ANDROID: 'ca-app-pub-XXXX/ZZZZ'
   ```

---

## 6. AdMob iOS Kurulumu

1. https://admob.google.com'da **iOS app** ekle
2. App ID'yi al ve `ios/Noorbloom/Info.plist` → `GADApplicationIdentifier` değerini güncelle
3. Banner ve Rewarded ad unit ID'lerini `src/config/env.ts`'e gir:
   ```
   ADMOB_BANNER_IOS: 'ca-app-pub-XXXX/YYYY'
   ADMOB_REWARDED_IOS: 'ca-app-pub-XXXX/ZZZZ'
   ```

---

## 7. Release Build Alma

```bash
cd android
./gradlew bundleRelease
```

Çıktı: `android/app/build/outputs/bundle/release/app-release.aab`

Alternatif olarak:
```bash
npm run android:release
```

---

## 8. Play Store Yükleme

1. https://play.google.com/console adresine git
2. **"Create app"** → App adı: **Noorbloom**
3. App Bundle yükle (`.aab` dosyası)
4. İçerik derecelendirmesi doldur (**Everyone**)
5. Gizlilik politikası URL'si ekle
6. Store listing doldur (EN + TR)
7. **Internal testing** track'ine yükle ve test et
8. Test başarılıysa **Production** track'ine promote et

---

## Ortam Değişkenleri Kontrol Listesi

`src/config/env.ts` dosyasında şu değerlerin gerçek değerlerle doldurulması gerekir:

| Değişken | Nereden alınır |
|---|---|
| `SUPABASE_URL` | Supabase dashboard |
| `SUPABASE_ANON_KEY` | Supabase dashboard |
| `GOOGLE_WEB_CLIENT_ID` | Firebase Console → Authentication → Sign-in method → Google |
| `REVENUECAT_IOS_KEY` | RevenueCat dashboard → iOS app |
| `REVENUECAT_ANDROID_KEY` | RevenueCat dashboard → Android app |
| `ADMOB_IOS_APP_ID` | AdMob dashboard → iOS app |
| `ADMOB_ANDROID_APP_ID` | AdMob dashboard → Android app |
| `ADMOB_BANNER_IOS` | AdMob dashboard → iOS banner ad unit |
| `ADMOB_BANNER_ANDROID` | AdMob dashboard → Android banner ad unit |
| `ADMOB_REWARDED_IOS` | AdMob dashboard → iOS rewarded ad unit |
| `ADMOB_REWARDED_ANDROID` | AdMob dashboard → Android rewarded ad unit |
