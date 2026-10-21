"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { historyDays, historyOperation, HISTORY_KEY, type HistoryAction, type HistoryResult } from "./history-storage";
import { localDate, type RecordToday } from "./storage";
import styles from "./routine.module.css";

export type HistoryControl = { erase: () => Promise<boolean> };
export default function History({ record, ref, onEraseAll, erasingAll }: { record: RecordToday | null; ref: Ref<HistoryControl>; onEraseAll: () => void; erasingAll: boolean }) {
  const [result, setResult] = useState<HistoryResult>({ history: null, notice: "History is off.", error: false });
  const [days, setDays] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmingHistoryOptOut, setConfirmingHistoryOptOut] = useState(false);
  const historyConsent = useRef<HTMLInputElement>(null);
  const cancelHistoryOptOut = useRef<HTMLButtonElement>(null);
  const historyOptOutOpen = useRef(false);
  const restoreHistoryFocus = useRef(false);
  useEffect(() => {
    if (confirmingHistoryOptOut) cancelHistoryOptOut.current?.focus();
  }, [confirmingHistoryOptOut]);
  useEffect(() => {
    if (!confirmingHistoryOptOut && restoreHistoryFocus.current && ready && !busy) {
      historyConsent.current?.focus();
      restoreHistoryFocus.current = false;
    }
  }, [confirmingHistoryOptOut, ready, busy]);
  function closeHistoryOptOut() {
    historyOptOutOpen.current = false;
    restoreHistoryFocus.current = true;
    setConfirmingHistoryOptOut(false);
  }
  const [confirmingEraseAll, setConfirmingEraseAll] = useState(false);
  const eraseAllButton = useRef<HTMLButtonElement>(null);
  const cancelEraseAllButton = useRef<HTMLButtonElement>(null);
  const restoreEraseFocus = useRef(false);
  useEffect(() => {
    if (confirmingEraseAll) cancelEraseAllButton.current?.focus();
  }, [confirmingEraseAll]);
  useEffect(() => {
    if (!confirmingEraseAll && restoreEraseFocus.current && ready && !busy && record && !erasingAll) {
      eraseAllButton.current?.focus();
      restoreEraseFocus.current = false;
    }
  }, [confirmingEraseAll, ready, busy, record, erasingAll]);
  function closeEraseConfirmation() {
    restoreEraseFocus.current = true;
    setConfirmingEraseAll(false);
  }
  const alive = useRef(false);
  const blocked = useRef(false);
  const enabled = useRef(false);
  const revision = useRef(0);
  const run = useCallback(async (action: HistoryAction, entry?: RecordToday) => {
    if (action !== "read") revision.current += 1;
    const requestedRevision = revision.current;
    const next = await historyOperation(action, entry);
    if (alive.current && requestedRevision === revision.current) {
      blocked.current = next.error;
      enabled.current = next.history !== null;
      setResult(next);
      setDays(historyDays());
      setReady(true);
    }
    return !next.error;
  }, []);
  const eraseHistory = useCallback(async () => {
    // Immediately prevent pending UI submissions while the cross-tab lock is held.
    enabled.current = false;
    setBusy(true);
    const ok = await run("erase");
    if (alive.current) setBusy(false);
    return ok;
  }, [run]);
  function confirmHistoryOptOut() {
    if (!historyOptOutOpen.current || busy || !enabled.current || blocked.current) return;
    closeHistoryOptOut();
    void eraseHistory();
  }
  useImperativeHandle(ref, () => ({ erase: eraseHistory }), [eraseHistory]);
  useEffect(() => {
    alive.current = true;
    const refresh = () => {
      setDays(historyDays());
      // A failed erase must not silently re-enable its remaining bytes in this page.
      if (!blocked.current) void run("read");
    };
    let timer: ReturnType<typeof setTimeout>;
    function tick() {
      refresh();
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(tick, Math.min(60_000, Math.max(1, midnight.getTime() - now.getTime())));
    }
    tick();
    const changed = (event: StorageEvent) => { if (event.key === HISTORY_KEY || event.key === null) refresh(); };
    window.addEventListener("storage", changed);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      alive.current = false;
      clearTimeout(timer);
      window.removeEventListener("storage", changed);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [run]);
  async function enable() {
    setBusy(true);
    await run("enable");
    if (alive.current) setBusy(false);
  }
  async function recordToday() {
    if (!record || !enabled.current || blocked.current) return;
    setBusy(true);
    await run("record", record);
    if (alive.current) setBusy(false);
  }
  const today = result.history?.entries.find(entry => entry.date === days[0]);
  const differs = today && record?.date === days[0] && (today.brushedTeeth !== record.brushedTeeth || today.cleanedBetweenTeeth !== record.cleanedBetweenTeeth);
  return <section className={styles.history} aria-labelledby="history-title" aria-busy={busy}>
    <h2 id="history-title">Optional seven-day history</h2>
    <div id="history-details">
      <p>History is a separate choice from saving today’s check-in. Enabling it does not copy any existing check-in.</p>
      <p>When enabled, choose “Record today’s check-in in history” to save the date and the two current activity selections. Editing the checkboxes or saving today alone does not update history. Recording again replaces only today’s history entry.</p>
      <p>Only the current and preceding six local calendar days are kept. Older entries are removed when the app next runs. A closed or suspended browser cannot guarantee immediate expiry. No past days are reconstructed.</p>
    </div>
    <label className={styles.consent}><input type="checkbox" disabled={!ready || busy} checked={result.history !== null} ref={historyConsent} onChange={() => {
      // A stale pending confirmation must never become a request to enable saving.
      if (historyOptOutOpen.current) { cancelHistoryOptOut.current?.focus(); return; }
      if (result.history) { historyOptOutOpen.current = true; setConfirmingHistoryOptOut(true); }
      else void enable();
    }} aria-describedby="history-details" />Enable seven-day history in this browser</label>
    {confirmingHistoryOptOut && <div role="group" aria-labelledby="history-opt-out-title" aria-describedby="history-opt-out-details" className={styles.eraseConfirmation}>
      <h3 id="history-opt-out-title">Erase saved seven-day history and turn history off?</h3>
      <p id="history-opt-out-details">This will attempt to erase saved seven-day history and turn history off. Today’s separate check-in, activity selections and saving option are unaffected. Smile Track cannot recover history that has been successfully erased. Browser or storage failures can prevent verified deletion; saved history may remain. Check the history status for the result. Another tab may enable history again.</p>
      <div className={styles.historyActions}>
        <button type="button" ref={cancelHistoryOptOut} onClick={() => { closeHistoryOptOut(); void eraseHistory(); }}>Cancel — keep history</button>
        <button type="button" disabled={!ready || busy || !result.history || result.error} onClick={confirmHistoryOptOut}>Confirm — erase history and turn it off</button>
      </div>
    </div>}
    <div className={styles.historyActions}>
      <button type="button" disabled={!ready || busy || !result.history || !record} onClick={() => void recordToday()}>Record today’s check-in in history</button>
      <button type="button" disabled={!ready || busy} onClick={() => void eraseHistory()}>Erase history and turn it off</button>
      <button type="button" disabled={!ready || busy || !record || erasingAll} ref={eraseAllButton} aria-expanded={confirmingEraseAll} aria-controls="erase-all-confirmation" onClick={() => setConfirmingEraseAll(true)}>Erase all routine data and turn off both saving options</button>
    </div>
    {confirmingEraseAll && <div id="erase-all-confirmation" role="group" aria-labelledby="erase-all-title" aria-describedby="erase-all-details" className={styles.eraseConfirmation}>
      <h3 id="erase-all-title">Erase all routine data?</h3>
      <p id="erase-all-details">This will attempt to remove both saved records, turn off both saving options here, and reset your activity selections. The two records are erased in separate operations, not one transaction. Another tab may enable saving again between or after these operations. Check the status messages for the result. Smile Track has no undo or recovery feature for records that have been successfully erased.</p>
      <div className={styles.historyActions}>
        <button type="button" ref={cancelEraseAllButton} onClick={closeEraseConfirmation}>Cancel — keep routine data</button>
        <button type="button" disabled={!ready || busy || !record || erasingAll} onClick={() => { closeEraseConfirmation(); onEraseAll(); }}>Confirm — erase all routine data</button>
      </div>
    </div>}
    <p>Erasing history leaves today-only saving and the checkboxes unchanged. Erase all removes both saved records and resets the checkboxes.</p>
    <p role="status" aria-label="History status" className={styles.status}>{result.notice} {differs ? "Current selections differ from today’s recorded history. Record again to update history." : ""}</p>
    <p>No recorded check-in means no entry was saved. “Not marked” means the checkbox was unchecked in a saved entry. Neither tells us whether oral care was performed.</p>
    {/* The unchanged semantic list below provides the same dates and values to assistive technology. */}
    {result.history && !result.error && <div className={styles.historyOverview} aria-hidden="true" data-testid="history-overview">
      <table>
        <caption>Seven-day overview · saved snapshots</caption>
        <thead><tr><th scope="col">Local date</th><th scope="col">Brushed teeth</th><th scope="col">Cleaned between teeth</th></tr></thead>
        <tbody>{days.map(date => {
          const entry = result.history?.entries.find(item => item.date === date);
          return <tr key={date}>
            <th scope="row"><time dateTime={date}>{date}</time></th>
            {entry ? [entry.brushedTeeth, entry.cleanedBetweenTeeth].map((marked, index) =>
              <td key={index} className={marked ? styles.snapshotMarked : undefined}>{marked ? "✓ Marked" : "○ Not marked"}</td>
            ) : <td colSpan={2}>— No recorded check-in</td>}
          </tr>;
        })}</tbody>
      </table>
    </div>}
    {result.history && <ol className={styles.historyList} aria-label="Seven local calendar days">
      {days.map(date => {
        const entry = result.history?.entries.find(item => item.date === date);
        return <li key={date} aria-label={date}>
          <h3><time dateTime={date}>{date}</time>{date === localDate() ? " · Today" : ""}</h3>
          {entry ? <><p>Brushed teeth: {entry.brushedTeeth ? "Marked" : "Not marked"}</p><p>Cleaned between teeth: {entry.cleanedBetweenTeeth ? "Marked" : "Not marked"}</p></> : <p>No recorded check-in</p>}
        </li>;
      })}
    </ol>}
    <p className={styles.notice}>Browser-local storage is not encrypted private storage. Other users of this profile may see records. Browser backups, extensions and synchronization are outside Smile Track’s control. Device dates and timezones may be incorrect. This version of Smile Track has no in-app feature for uploading or sharing routine entries.</p>
  </section>;
}
