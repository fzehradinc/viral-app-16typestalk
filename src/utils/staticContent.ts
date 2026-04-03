/**
 * staticContent — Offline / hata durumunda kullanılacak sabit Kur'an ayetleri.
 * verseStore fetchDailyVerse'de fallback olarak bu listeyi kullanır.
 */

import {MotivationalQuranic} from '../types';

export const STATIC_VERSES: MotivationalQuranic[] = [
  {
    id: 1,
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'So verily, with hardship, there is relief.',
    translationTurkish: 'Şüphesiz güçlüğün yanında bir kolaylık vardır.',
    translationRussian: 'Поистине, за затруднением следует облегчение.',
    surah: 'Ash-Sharh',
    ayah: '94:5',
  },
  {
    id: 2,
    arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
    translation: 'And your Lord is going to give you, and you will be satisfied.',
    translationTurkish: 'Rabbin sana verecek ve sen razı olacaksın.',
    translationRussian: 'Господь твой непременно одарит тебя, и ты будешь доволен.',
    surah: 'Ad-Duhaa',
    ayah: '93:5',
  },
  {
    id: 3,
    arabic:
      'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    translation:
      'And whoever relies upon Allah – then He is sufficient for him.',
    translationTurkish:
      "Kim Allah'a tevekkül ederse, O ona yeter.",
    translationRussian:
      'Тому, кто уповает на Аллаха, достаточно Его.',
    surah: 'At-Talaq',
    ayah: '65:3',
  },
  {
    id: 4,
    arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    translation: 'Indeed, Allah is with the patient.',
    translationTurkish: 'Şüphesiz Allah sabredenlerle beraberdir.',
    translationRussian: 'Воистину, Аллах — с терпеливыми.',
    surah: 'Al-Baqarah',
    ayah: '2:153',
  },
  {
    id: 5,
    arabic: 'وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ',
    translation:
      'And remember Allah often that you may succeed.',
    translationTurkish:
      "Allah'ı çokça zikredin ki kurtuluşa eresiniz.",
    translationRussian:
      'Поминайте Аллаха много, — быть может, вы преуспеете.',
    surah: 'Al-Jumu\'ah',
    ayah: '62:10',
  },
  {
    id: 6,
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي',
    translation: 'My Lord, expand for me my breast.',
    translationTurkish: "Rabbim! Göğsümü aç.",
    translationRussian: 'Господь мой! Раскрой для меня мою грудь.',
    surah: 'Ta-Ha',
    ayah: '20:25',
  },
  {
    id: 7,
    arabic:
      'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ',
    translation: 'And do not despair of relief from Allah.',
    translationTurkish: "Allah'ın rahmetinden ümidinizi kesmeyin.",
    translationRussian: 'Не теряйте надежды на милость Аллаха.',
    surah: 'Yusuf',
    ayah: '12:87',
  },
  {
    id: 8,
    arabic:
      'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation:
      'Verily, in the remembrance of Allah do hearts find rest.',
    translationTurkish:
      'Bilesiniz ki kalpler ancak Allah\'ı anmakla huzur bulur.',
    translationRussian:
      'Разве не поминанием Аллаха утешаются сердца?',
    surah: "Ar-Ra'd",
    ayah: '13:28',
  },
];
