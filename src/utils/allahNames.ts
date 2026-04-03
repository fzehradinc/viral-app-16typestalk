/**
 * Esma-ül Hüsna — 20 Allah ismi, çeviri ve transliterasyon.
 * AllahNamesSection bileşeninde dönen kart animasyonu için kullanılır.
 */

import type {AllahName, AppLanguage} from '../types';

export const ALLAH_NAMES: AllahName[] = [
  {
    arabic: 'الرَّحْمَنُ',
    transliteration: 'Ar-Rahman',
    meaning: 'The Most Gracious',
    meaningTurkish: 'Esirgeyen',
    meaningRussian: 'Милостивый',
  },
  {
    arabic: 'الرَّحِيمُ',
    transliteration: 'Ar-Raheem',
    meaning: 'The Most Merciful',
    meaningTurkish: 'Bağışlayan',
    meaningRussian: 'Милосердный',
  },
  {
    arabic: 'الْمَلِكُ',
    transliteration: 'Al-Malik',
    meaning: 'The King',
    meaningTurkish: 'Mülkün Sahibi',
    meaningRussian: 'Царь',
  },
  {
    arabic: 'الْقُدُّوسُ',
    transliteration: 'Al-Quddus',
    meaning: 'The Most Holy',
    meaningTurkish: 'Tertemiz',
    meaningRussian: 'Святой',
  },
  {
    arabic: 'السَّلَامُ',
    transliteration: 'As-Salam',
    meaning: 'The Source of Peace',
    meaningTurkish: 'Esenlik Veren',
    meaningRussian: 'Дарующий мир',
  },
  {
    arabic: 'الْمُؤْمِنُ',
    transliteration: "Al-Mu'min",
    meaning: 'The Guardian of Faith',
    meaningTurkish: 'Güven Veren',
    meaningRussian: 'Дарующий безопасность',
  },
  {
    arabic: 'الْمُهَيْمِنُ',
    transliteration: 'Al-Muhaymin',
    meaning: 'The Protector',
    meaningTurkish: 'Koruyup Gözeten',
    meaningRussian: 'Охраняющий',
  },
  {
    arabic: 'الْعَزِيزُ',
    transliteration: "Al-Aziz",
    meaning: 'The Almighty',
    meaningTurkish: 'Güçlü ve Yenilmez',
    meaningRussian: 'Могущественный',
  },
  {
    arabic: 'الْجَبَّارُ',
    transliteration: 'Al-Jabbar',
    meaning: 'The Compeller',
    meaningTurkish: 'Düzeltip Islah Eden',
    meaningRussian: 'Могучий',
  },
  {
    arabic: 'الْمُتَكَبِّرُ',
    transliteration: 'Al-Mutakabbir',
    meaning: 'The Supreme',
    meaningTurkish: 'Büyüklükte Eşsiz',
    meaningRussian: 'Превосходящий',
  },
  {
    arabic: 'الْخَالِقُ',
    transliteration: 'Al-Khaliq',
    meaning: 'The Creator',
    meaningTurkish: 'Yaratan',
    meaningRussian: 'Творец',
  },
  {
    arabic: 'الْبَارِئُ',
    transliteration: "Al-Bari'",
    meaning: 'The Evolver',
    meaningTurkish: 'Kusursuz Var Eden',
    meaningRussian: 'Создатель',
  },
  {
    arabic: 'الْغَفَّارُ',
    transliteration: 'Al-Ghaffar',
    meaning: 'The Forgiver',
    meaningTurkish: 'Çok Bağışlayan',
    meaningRussian: 'Прощающий',
  },
  {
    arabic: 'الْوَهَّابُ',
    transliteration: 'Al-Wahhab',
    meaning: 'The Bestower',
    meaningTurkish: 'Karşılıksız Veren',
    meaningRussian: 'Дарующий',
  },
  {
    arabic: 'الرَّزَّاقُ',
    transliteration: 'Ar-Razzaq',
    meaning: 'The Provider',
    meaningTurkish: 'Rızık Veren',
    meaningRussian: 'Наделяющий',
  },
  {
    arabic: 'السَّمِيعُ',
    transliteration: "As-Sami'",
    meaning: 'The All-Hearing',
    meaningTurkish: 'Her Şeyi İşiten',
    meaningRussian: 'Всеслышащий',
  },
  {
    arabic: 'الْبَصِيرُ',
    transliteration: 'Al-Basir',
    meaning: 'The All-Seeing',
    meaningTurkish: 'Her Şeyi Gören',
    meaningRussian: 'Всевидящий',
  },
  {
    arabic: 'اللَّطِيفُ',
    transliteration: 'Al-Latif',
    meaning: 'The Subtle One',
    meaningTurkish: 'Lütfeden',
    meaningRussian: 'Добрый',
  },
  {
    arabic: 'الْحَكِيمُ',
    transliteration: 'Al-Hakim',
    meaning: 'The Perfectly Wise',
    meaningTurkish: 'Hikmet Sahibi',
    meaningRussian: 'Мудрый',
  },
  {
    arabic: 'الْوَدُودُ',
    transliteration: 'Al-Wadud',
    meaning: 'The Loving One',
    meaningTurkish: 'Çok Seven',
    meaningRussian: 'Любящий',
  },
];

/** Dile göre anlam döndüren yardımcı */
export function getMeaning(name: AllahName, language: AppLanguage): string {
  switch (language) {
    case 'tr':
      return name.meaningTurkish;
    case 'ru':
      return name.meaningRussian;
    default:
      return name.meaning;
  }
}
