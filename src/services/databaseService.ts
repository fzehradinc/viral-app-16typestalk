/**
 * Database servisi — op-sqlite ile SQLite kalıcı depolama.
 * SwiftData modelinin React Native karşılığı.
 * JSI tabanlı sync API kullanır.
 */

import {open} from '@op-engineering/op-sqlite';
import type {DB} from '@op-engineering/op-sqlite';
import type {ReflectionEntry} from '../types';

let db: DB | null = null;

function getDb(): DB {
  if (!db) {
    db = open({name: 'noorbloom.db'});
  }
  return db;
}

/**
 * Veritabanını başlat — CREATE TABLE IF NOT EXISTS.
 * App başlangıcında bir kez çağrılır (senkron).
 */
export function initDatabase(): void {
  const database = getDb();
  database.executeSync(
    `CREATE TABLE IF NOT EXISTS reflections (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      topic TEXT NOT NULL,
      content TEXT NOT NULL,
      aiReflection TEXT,
      mood TEXT,
      language TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )`,
  );
}

/**
 * Yeni girdi kaydet veya mevcut girdiyi güncelle.
 */
export function saveReflection(entry: ReflectionEntry): void {
  const database = getDb();
  database.executeSync(
    `INSERT OR REPLACE INTO reflections
      (id, date, topic, content, aiReflection, mood, language, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.date,
      entry.topic,
      entry.content,
      entry.aiReflection,
      entry.mood,
      entry.language,
      entry.createdAt,
    ],
  );
}

function rowToEntry(row: Record<string, unknown>): ReflectionEntry {
  return {
    id: String(row.id ?? ''),
    date: String(row.date ?? ''),
    topic: String(row.topic ?? ''),
    content: String(row.content ?? ''),
    aiReflection: row.aiReflection != null ? String(row.aiReflection) : null,
    mood: row.mood != null ? String(row.mood) : null,
    language: String(row.language ?? 'en') as ReflectionEntry['language'],
    createdAt: String(row.createdAt ?? ''),
  };
}

/**
 * Belirli tarihteki girdiyi getir.
 */
export function getReflectionByDate(date: string): ReflectionEntry | null {
  const database = getDb();
  const result = database.executeSync(
    'SELECT * FROM reflections WHERE date = ? LIMIT 1',
    [date],
  );
  if (result.rows.length === 0) {
    return null;
  }
  return rowToEntry(result.rows[0] as Record<string, unknown>);
}

/**
 * Tüm girdileri tarihe göre azalan sırada getir.
 */
export function getAllReflections(): ReflectionEntry[] {
  const database = getDb();
  const result = database.executeSync(
    'SELECT * FROM reflections ORDER BY date DESC',
  );
  return result.rows.map(row => rowToEntry(row as Record<string, unknown>));
}

/**
 * ID ile girdi getir.
 */
export function getReflectionById(id: string): ReflectionEntry | null {
  const database = getDb();
  const result = database.executeSync(
    'SELECT * FROM reflections WHERE id = ? LIMIT 1',
    [id],
  );
  if (result.rows.length === 0) {
    return null;
  }
  return rowToEntry(result.rows[0] as Record<string, unknown>);
}

/**
 * Girdi sil.
 */
export function deleteReflection(id: string): void {
  const database = getDb();
  database.executeSync('DELETE FROM reflections WHERE id = ?', [id]);
}

/**
 * Takvim için girdi bulunan benzersiz tarihleri getir.
 */
export function getReflectionDates(): string[] {
  const database = getDb();
  const result = database.executeSync(
    'SELECT DISTINCT date FROM reflections ORDER BY date DESC',
  );
  return result.rows.map(row => String((row as Record<string, unknown>).date ?? ''));
}
