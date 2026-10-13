import { localDate, type RecordToday } from "./storage";

export const HISTORY_KEY = "smile-track:routine-history:1";
// A constant coordination name, not a stored/user/device identifier.
export const HISTORY_LOCK = "smile-track:routine-history";
export type HistoryEntry = Omit<RecordToday, "version">;
export type HistoryRecord = { version: 1; enabled: true; entries: HistoryEntry[] };
export type HistoryResult = { history: HistoryRecord | null; notice: string; error: boolean };
export type HistoryAction = "read" | "enable" | "record" | "erase";
const warning = "History storage could not be verified. History is off here. Saved history may remain; use your browser’s site-data controls to remove it.";

export function historyDays(now = new Date()): string[] {
  // Calendar subtraction at local noon, not elapsed 24-hour periods across DST.
  return Array.from({ length: 7 }, (_, offset) => localDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset, 12)));
}
function fields(value: unknown, expected: string): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) && Object.keys(value).sort().join() === expected;
}
function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
export function parseHistory(raw: string): HistoryRecord | null {
  try {
    const value: unknown = JSON.parse(raw);
    if (!fields(value, "enabled,entries,version") || value.version !== 1 || value.enabled !== true || !Array.isArray(value.entries) || value.entries.length > 7) return null;
    const seen = new Set<string>();
    const entries: HistoryEntry[] = [];
    for (const entry of value.entries) {
      if (!fields(entry, "brushedTeeth,cleanedBetweenTeeth,date") || !validDate(entry.date) || entry.date > localDate() || seen.has(entry.date) || typeof entry.brushedTeeth !== "boolean" || typeof entry.cleanedBetweenTeeth !== "boolean") return null;
      seen.add(entry.date);
      entries.push({ date: entry.date, brushedTeeth: entry.brushedTeeth, cleanedBetweenTeeth: entry.cleanedBetweenTeeth });
    }
    const allowed = new Set(historyDays());
    return { version: 1, enabled: true, entries: entries.filter(entry => allowed.has(entry.date)).sort((a, b) => b.date.localeCompare(a.date)) };
  } catch { return null; }
}
function removeHistory(): boolean {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return localStorage.getItem(HISTORY_KEY) === null;
  } catch { return false; }
}
function failure(): HistoryResult { return { history: null, notice: warning, error: true }; }

// All cooperating tabs serialize read/modify/write and erasure. Every queued record
// operation rechecks stored consent under this lock; deletion cannot be resurrected
// by a tab using an earlier in-memory copy. No network or persisted lock token.
export async function historyOperation(action: HistoryAction, record?: RecordToday): Promise<HistoryResult> {
  try {
    if (!navigator.locks) {
      if (action === "erase" && removeHistory()) return { history: null, notice: "History erased. History is off.", error: false };
      return { history: null, notice: "History is unavailable because this browser cannot coordinate tabs. No history will be recorded here. Previously saved history may remain; use your browser’s site-data controls to remove it.", error: true };
    }
    return await navigator.locks.request(HISTORY_LOCK, () => {
      if (action === "erase") return removeHistory() ? { history: null, notice: "History erased. History is off.", error: false } : failure();
      try {
        const raw = localStorage.getItem(HISTORY_KEY);
        let history = raw === null ? null : parseHistory(raw);
        if (raw !== null && history === null && !removeHistory()) return failure();
        if (action === "enable") history = { version: 1, enabled: true, entries: [] };
        if (!history) return { history: null, notice: raw === null ? "History is off." : "Invalid history removed. History is off.", error: false };
        if (action === "record") {
          if (!record || record.date !== localDate()) return { history, notice: "The local date changed. Review today’s check-in before recording it.", error: false };
          const entry = { date: record.date, brushedTeeth: record.brushedTeeth, cleanedBetweenTeeth: record.cleanedBetweenTeeth };
          history = { ...history, entries: [entry, ...history.entries.filter(item => item.date !== record.date)].slice(0, 7) };
        }
        const serialized = JSON.stringify(history);
        // Reads write only to prune/canonicalize already consented history.
        if (serialized !== raw) {
          localStorage.setItem(HISTORY_KEY, serialized);
          if (localStorage.getItem(HISTORY_KEY) !== serialized) throw new Error("History write not verified");
        }
        return { history, notice: action === "record" ? "Today’s check-in recorded in history." : "History is enabled. Only explicitly recorded check-ins are kept.", error: false };
      } catch { removeHistory(); return failure(); }
    });
  } catch { return failure(); }
}
