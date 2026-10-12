import { db } from '@/db/db';

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const record = await db.settings.get(key);
  if (!record) return fallback;
  return record.value as T;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  await db.settings.put({ key, value });
}

export async function getAllSettings(): Promise<Record<string, unknown>> {
  const all = await db.settings.toArray();
  const result: Record<string, unknown> = {};
  for (const item of all) {
    result[item.key] = item.value;
  }
  return result;
}

export async function replaceSettings(settings: Record<string, unknown>): Promise<void> {
  await db.settings.clear();
  const records = Object.entries(settings).map(([key, value]) => ({ key, value }));
  if (records.length > 0) {
    await db.settings.bulkPut(records);
  }
}
