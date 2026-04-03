/**
 * Dhikr verisi — 10 temel zikir.
 * Swift DhikrModels.swift'ten taşınmış statik içerik.
 */

import type {DhikrItem} from '../types';

export const dhikrList: DhikrItem[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    meaningEn: 'Glory be to Allah',
    meaningTr: 'Allah\'ı tenzih ederim',
    meaningRu: 'Пречист Аллах',
    targetCount: 33,
    category: 'tasbih',
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaningEn: 'All praise is due to Allah',
    meaningTr: 'Hamd Allah\'a mahsustur',
    meaningRu: 'Хвала Аллаху',
    targetCount: 33,
    category: 'tahmid',
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaningEn: 'Allah is the Greatest',
    meaningTr: 'Allah en büyüktür',
    meaningRu: 'Аллах Велик',
    targetCount: 33,
    category: 'takbir',
  },
  {
    id: 'subhanallahi-wa-bihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdihi',
    meaningEn: 'Glory and praise be to Allah',
    meaningTr: 'Allah\'ı hamd ile tenzih ederim',
    meaningRu: 'Пречист Аллах и хвала Ему',
    targetCount: 100,
    category: 'tasbih',
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    meaningEn: 'I seek forgiveness from Allah',
    meaningTr: 'Allah\'tan bağışlanma dilerim',
    meaningRu: 'Прошу прощения у Аллаха',
    targetCount: 100,
    category: 'istighfar',
  },
  {
    id: 'la-ilaha-illallah',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illallah',
    meaningEn: 'There is no god but Allah',
    meaningTr: 'Allah\'tan başka ilah yoktur',
    meaningRu: 'Нет божества кроме Аллаха',
    targetCount: 100,
    category: 'other',
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
    transliteration: 'Allahümme salli ala Muhammed',
    meaningEn: 'O Allah, send blessings upon Muhammad',
    meaningTr: 'Allah\'ım Muhammed\'e salât et',
    meaningRu: 'О Аллах, благослови Мухаммада',
    targetCount: 100,
    category: 'salawat',
  },
  {
    id: 'subhanallahil-azim',
    arabic: 'سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: "SubhanAllahi'l-Azim",
    meaningEn: 'Glory be to Allah the Almighty',
    meaningTr: 'Yüce Allah\'ı tenzih ederim',
    meaningRu: 'Пречист Аллах Великий',
    targetCount: 33,
    category: 'tasbih',
  },
  {
    id: 'hasbunallah',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'HasbunAllahu wa ni\'mal wakeel',
    meaningEn: 'Allah is sufficient for us and the best disposer of affairs',
    meaningTr: 'Allah bize yeter, O ne güzel vekildir',
    meaningRu: 'Достаточно нам Аллаха, и Он лучший покровитель',
    targetCount: 33,
    category: 'other',
  },
  {
    id: 'la-hawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wala quwwata illa billah',
    meaningEn: 'There is no power nor strength except with Allah',
    meaningTr: 'Güç ve kuvvet ancak Allah\'tandır',
    meaningRu: 'Нет силы и мощи кроме как от Аллаха',
    targetCount: 33,
    category: 'other',
  },
];

export type DhikrCategory = DhikrItem['category'];

export const DHIKR_CATEGORIES: {key: DhikrCategory | 'all'; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'tasbih', label: 'Tasbih'},
  {key: 'tahmid', label: 'Tahmid'},
  {key: 'takbir', label: 'Takbir'},
  {key: 'istighfar', label: 'Istighfar'},
  {key: 'salawat', label: 'Salawat'},
  {key: 'other', label: 'Other'},
];
