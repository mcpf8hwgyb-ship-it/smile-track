// One owned key; presence of a valid record represents explicit same-day consent.
export const STORAGE_KEY = "smile-track:routine:1";
export type RecordToday = { version: 1; date: string; brushedTeeth: boolean; cleanedBetweenTeeth: boolean };
export function localDate(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export function fresh(): RecordToday {
  return { version: 1, date: localDate(), brushedTeeth: false, cleanedBetweenTeeth: false };
}
export function parseRecord(raw: string | null): RecordToday | null {
  if (raw === null) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || Object.keys(value).sort().join() !== "brushedTeeth,cleanedBetweenTeeth,date,version" ||
      value.version !== 1 || value.date !== localDate() || typeof value.brushedTeeth !== "boolean" || typeof value.cleanedBetweenTeeth !== "boolean") return null;
    return value;
  } catch { return null; }
}
export function erase(): boolean {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return window.localStorage.getItem(STORAGE_KEY) === null;
  } catch { return false; }
}
export function save(record: RecordToday): boolean {
  try {
    const raw = JSON.stringify(record);
    window.localStorage.setItem(STORAGE_KEY, raw);
    if (window.localStorage.getItem(STORAGE_KEY) === raw) return true;
  } catch { /* Memory remains usable. */ }
  erase();
  return false;
}
