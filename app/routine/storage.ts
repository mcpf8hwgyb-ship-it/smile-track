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
// A constant coordination name, never a persisted identifier.
export const ROUTINE_LOCK = "smile-track:routine";
const storageWarning = "Browser storage could not be verified. Saving is off. A previous saved record may remain; use your browser’s site-data controls to remove it.";
const coordinationWarning = "Browser storage could not be verified because tab coordination is unavailable. Saving is off. Saved records may remain; use your browser’s site-data controls to remove them.";
export type RoutineRequest = {
  action: "read" | "enable" | "edit" | "erase";
  date: string;
  record?: RecordToday;
  observed?: string | null;
  signal: AbortSignal;
};
export type RoutineResult = {
  outcome: "ok" | "conflict" | "date" | "error" | "cancelled";
  record: RecordToday | null;
  raw: string | null;
  notice: string;
};
const result = (outcome: RoutineResult["outcome"], record: RecordToday | null = null, raw: string | null = null, notice = ""): RoutineResult => ({ outcome, record, raw, notice });

// Every storage access, including failure cleanup, remains inside one acquired lock.
// No unlocked public mutators and no awaits or nested lock acquisition in the callback.
export async function routineOperation(request: RoutineRequest): Promise<RoutineResult> {
  const { action, signal } = request;
  if (signal.aborted) return result("cancelled");
  try {
    if (!navigator.locks) return result("error", null, null, coordinationWarning);
    return await navigator.locks.request(ROUTINE_LOCK, { mode: "exclusive", signal }, () => {
      if (signal.aborted) return result("cancelled");
      const day = localDate();
      const canMutate = () => !signal.aborted && localDate() === day;
      const remove = () => {
        if (!canMutate()) return false;
        window.localStorage.removeItem(STORAGE_KEY);
        return window.localStorage.getItem(STORAGE_KEY) === null;
      };
      try {
        let raw = window.localStorage.getItem(STORAGE_KEY);
        const record = parseRecord(raw);
        if (!canMutate()) return result(signal.aborted ? "cancelled" : "date");
        if (action === "erase") return remove() ? result("ok") : result("error", null, null, storageWarning);
        if (raw !== null && record === null) {
          if (!remove()) return result("error", null, null, storageWarning);
          raw = null;
        }
        if (action === "read") return result("ok", record, raw);
        if (request.date !== day || request.record?.date !== day) return result("date", record, raw);
        if (action === "enable" && record) return result("ok", record, raw, "Existing saved current-day record restored without replacing it.");
        if (action === "edit" && (!record || raw !== request.observed)) {
          return result("conflict", record, raw, record ? "Saved values changed in another tab. Review the latest values before editing again." : "Saved consent was removed. Your selections are in memory only.");
        }
        if (!request.record || !parseRecord(JSON.stringify(request.record))) return result("error", null, null, storageWarning);
        const serialized = JSON.stringify(request.record);
        if (!canMutate()) return result(signal.aborted ? "cancelled" : "date", record, raw);
        try {
          window.localStorage.setItem(STORAGE_KEY, serialized);
          if (window.localStorage.getItem(STORAGE_KEY) === serialized) return result("ok", request.record, serialized);
        } catch { /* Verified failure recovery uses the same lock. */ }
        try { remove(); } catch { /* Remaining bytes are disclosed below. */ }
        return result("error", null, null, storageWarning);
      } catch { return result("error", null, null, storageWarning); }
    });
  } catch {
    return signal.aborted ? result("cancelled") : result("error", null, null, coordinationWarning);
  }
}
