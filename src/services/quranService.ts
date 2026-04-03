/**
 * Kur'an servisi — Alquran.cloud API ile ayet ve sure bilgisi çekme.
 * Swift QuranService ile aynı endpoint'ler kullanılır.
 */

import type {
  AyahData,
  AyahWithTranslations,
  AppLanguage,
  SurahSummary,
  SurahDetail,
  SurahWithTranslation,
} from '../types';

const QURAN_BASE = 'https://api.alquran.cloud/v1';

/** Çeviri edition kodları */
const EDITION = {
  arabic: 'quran-uthmani',
  turkish: 'tr.diyanet',
  english: 'en.asad',
  russian: 'ru.kuliev',
} as const;

interface AlquranAyahResponse {
  data: AyahData;
}

interface AlquranSurahListResponse {
  data: SurahSummary[];
}

interface AlquranSurahDetailResponse {
  data: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    ayahs: Array<{
      number: number;
      text: string;
      numberInSurah: number;
      juz: number;
      page: number;
    }>;
  };
}

/** Dile göre çeviri edition kodu */
function translationEdition(language: AppLanguage): string {
  switch (language) {
    case 'tr':
      return EDITION.turkish;
    case 'ru':
      return EDITION.russian;
    default:
      return EDITION.english;
  }
}

/**
 * 1-6236 arasında rastgele bir ayet numarası üretir
 * ve 4 dilde çevirisini paralel olarak çeker.
 */
export async function fetchRandomAyahWithTranslations(): Promise<AyahWithTranslations> {
  const ayahNumber = Math.floor(Math.random() * 6236) + 1;

  const [arabic, turkish, english, russian] = await Promise.all([
    fetchAyah(ayahNumber, EDITION.arabic),
    fetchAyah(ayahNumber, EDITION.turkish),
    fetchAyah(ayahNumber, EDITION.english),
    fetchAyah(ayahNumber, EDITION.russian),
  ]);

  return {arabic, turkish, english, russian};
}

/**
 * Belirli bir ayet numarasını belirli edition'da çeker.
 */
async function fetchAyah(
  ayahNumber: number,
  edition: string,
): Promise<AyahData> {
  try {
    const url = `${QURAN_BASE}/ayah/${ayahNumber}/${edition}`;
    const response = await fetch(url);
    const json: AlquranAyahResponse = await response.json();
    return json.data;
  } catch {
    return {
      number: ayahNumber,
      text: '',
      numberInSurah: 0,
      surah: {number: 0, name: '', englishName: '', numberOfAyahs: 0},
    };
  }
}

/**
 * Tüm surelerin özet listesini döndürür (114 sure).
 */
export async function fetchSurahList(): Promise<SurahSummary[]> {
  try {
    const url = `${QURAN_BASE}/surah`;
    const response = await fetch(url);
    const json: AlquranSurahListResponse = await response.json();
    return json.data;
  } catch {
    return [];
  }
}

/**
 * Bir surenin detayını (ayetleri dahil) döndürür.
 * Arapça metin + seçilen çeviri edition'ı kullanılır.
 */
export async function fetchSurahDetail(
  surahNumber: number,
): Promise<SurahDetail> {
  try {
    const url = `${QURAN_BASE}/surah/${surahNumber}/${EDITION.arabic}`;
    const response = await fetch(url);
    const json: AlquranSurahDetailResponse = await response.json();
    const d = json.data;
    return {
      number: d.number,
      name: d.name,
      englishName: d.englishName,
      englishNameTranslation: d.englishNameTranslation ?? '',
      numberOfAyahs: d.numberOfAyahs,
      ayahs: d.ayahs.map(a => ({
        number: a.number,
        text: a.text,
        numberInSurah: a.numberInSurah,
        juz: a.juz ?? 0,
        page: a.page ?? 0,
      })),
    };
  } catch {
    return {
      number: surahNumber,
      name: '',
      englishName: '',
      englishNameTranslation: '',
      numberOfAyahs: 0,
      ayahs: [],
    };
  }
}

/**
 * Bir surenin Arapça metni + seçilen dildeki çevirisini paralel çeker.
 */
export async function fetchSurahWithTranslation(
  surahNumber: number,
  language: AppLanguage,
): Promise<SurahWithTranslation> {
  const edition = translationEdition(language);

  const [arabicRes, translationRes] = await Promise.all([
    fetch(`${QURAN_BASE}/surah/${surahNumber}/${EDITION.arabic}`),
    fetch(`${QURAN_BASE}/surah/${surahNumber}/${edition}`),
  ]);

  const arabicJson: AlquranSurahDetailResponse = await arabicRes.json();
  const translationJson: AlquranSurahDetailResponse =
    await translationRes.json();

  const mapDetail = (d: AlquranSurahDetailResponse['data']): SurahDetail => ({
    number: d.number,
    name: d.name,
    englishName: d.englishName,
    englishNameTranslation: d.englishNameTranslation ?? '',
    numberOfAyahs: d.numberOfAyahs,
    ayahs: d.ayahs.map(a => ({
      number: a.number,
      text: a.text,
      numberInSurah: a.numberInSurah,
      juz: a.juz ?? 0,
      page: a.page ?? 0,
    })),
  });

  return {
    arabic: mapDetail(arabicJson.data),
    translation: mapDetail(translationJson.data),
  };
}
