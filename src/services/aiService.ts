/**
 * AI servisi — Supabase Edge Function üzerinden AI içerik üretimi.
 * Swift SupabaseAIService ile aynı payload yapısı korunmuştur.
 */

import {supabase} from './supabaseClient';
import type {AppLanguage, MotivationalQuranic} from '../types';

interface AiPayload {
  type: string;
  language: AppLanguage;
  [key: string]: unknown;
}

/**
 * Supabase Edge Function'ı çağıran ortak yardımcı.
 * Başarılı ise üretilen metin, hata durumunda null döner.
 */
async function callEdgeFunction(payload: AiPayload): Promise<string | null> {
  try {
    const {data, error} = await supabase.functions.invoke('generate-ai', {
      body: payload,
    });

    if (error) {
      return null;
    }

    const result = data as {content?: string};
    return result.content || null;
  } catch {
    return null;
  }
}

/**
 * Ruh haline göre olumlu bir affirmation üretir.
 */
export async function generateAffirmation(
  mood: string,
  language: AppLanguage,
): Promise<string | null> {
  return callEdgeFunction({
    type: 'affirmation',
    mood,
    language,
  });
}

/**
 * Kişiye özel dua üretir.
 */
export async function generateDua(
  name: string,
  intention: string,
  language: AppLanguage,
): Promise<string | null> {
  return callEdgeFunction({
    type: 'dua',
    name,
    intention,
    language,
  });
}

/**
 * Kur'an ayeti yorumu (hikmet) üretir.
 */
export async function generateAyahHikmah(
  verse: MotivationalQuranic,
  language: AppLanguage,
): Promise<string | null> {
  return callEdgeFunction({
    type: 'ayah_hikmah',
    arabic: verse.arabic,
    translation: verse.translation,
    surah: verse.surah,
    ayah: verse.ayah,
    language,
  });
}

/**
 * Tefekkür metni üretir.
 */
export async function generateReflection(
  topic: string,
  content: string,
  language: AppLanguage,
): Promise<string | null> {
  return callEdgeFunction({
    type: 'reflection',
    topic,
    content,
    language,
  });
}
