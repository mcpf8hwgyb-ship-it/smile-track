"use client";

import { useEffect, useRef, useState } from "react";
import { erase, fresh, localDate, parseRecord, save, STORAGE_KEY, type RecordToday } from "./storage";
import styles from "./routine.module.css";

type State = { record: RecordToday; saving: boolean; warning: string };
const storageWarning = "Browser storage could not be verified. Saving is off. A previous saved record may remain; use your browser’s site-data controls to remove it.";

export default function CheckIn() {
  const [state, setState] = useState<State | null>(null);
  const current = useRef<State | null>(null);
  function publish(next: State) { current.current = next; setState(next); }
  function rollover(): State | null {
    let next = current.current;
    if (next && next.record.date !== localDate()) {
      const removed = erase();
      next = { record: fresh(), saving: false, warning: removed ? "A new day has started. Saving is off for this fresh check-in." : storageWarning };
      publish(next);
    }
    return next;
  }
  useEffect(() => {
    function restore() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const record = parseRecord(raw);
        const removed = raw === null || record !== null || erase();
        publish({ record: record ?? fresh(), saving: record !== null, warning: removed ? "" : storageWarning });
      } catch { publish({ record: fresh(), saving: false, warning: storageWarning }); }
    }
    restore();
    function refresh() {
      const next = current.current;
      if (!next) return;
      if (next.record.date !== localDate()) {
        const removed = erase();
        publish({ record: fresh(), saving: false, warning: removed ? "A new day has started. Saving is off for this fresh check-in." : storageWarning });
      }
    }
    function storageChanged(event: StorageEvent) {
      if (event.key === STORAGE_KEY || event.key === null) restore();
    }
    function hide() { publish({ record: fresh(), saving: false, warning: "" }); }
    function show(event: PageTransitionEvent) { if (event.persisted) restore(); else refresh(); }
    let timer: ReturnType<typeof setTimeout>;
    function tick() {
      refresh();
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(tick, Math.min(60_000, Math.max(1, midnight.getTime() - now.getTime())));
    }
    tick();
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", show);
    window.addEventListener("pagehide", hide);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("storage", storageChanged);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", show);
      window.removeEventListener("pagehide", hide);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("storage", storageChanged);
    };
  }, []);

  function select(activity: "brushedTeeth" | "cleanedBetweenTeeth") {
    const next = rollover();
    if (!next) return;
    const record = { ...next.record, [activity]: !next.record[activity] };
    let saving = next.saving;
    let warning = next.warning === storageWarning ? storageWarning : "";
    if (saving) {
      // Do not resurrect consent removed by another tab before its event arrives.
      try { saving = parseRecord(window.localStorage.getItem(STORAGE_KEY)) !== null; }
      catch { saving = false; warning = storageWarning; }
      if (saving && !save(record)) { saving = false; warning = storageWarning; }
    }
    publish({ record, saving, warning });
  }
  function toggleSaving() {
    const next = rollover();
    if (!next) return;
    if (next.saving) {
      publish({ ...next, saving: false, warning: erase() ? "" : storageWarning });
    } else {
      const saved = save(next.record);
      publish({ ...next, saving: saved, warning: saved ? "" : storageWarning });
    }
  }
  function reset() {
    publish({ record: fresh(), saving: false, warning: erase() ? "Check-in erased. Saving is off." : storageWarning });
  }
  return (
    <section className={styles.card} aria-label="Today's check-in">
      <p className={styles.date}>{state ? `Today · ${state.record.date}` : "Loading your local date…"}</p>
      <fieldset disabled={!state} className={styles.activities}>
        <legend>What did you do today?</legend>
        <label><input type="checkbox" checked={state?.record.brushedTeeth ?? false} onChange={() => select("brushedTeeth")} />Brushed teeth</label>
        <label><input type="checkbox" checked={state?.record.cleanedBetweenTeeth ?? false} onChange={() => select("cleanedBetweenTeeth")} />Cleaned between teeth</label>
      </fieldset>
      <p>Select again to undo. These are your own records, not an assessment of your health, technique or how often you should act.</p>
      <button type="button" disabled={!state} onClick={reset}>Erase check-in and turn off saving</button>
      <div className={styles.privacy} id="saving-details">
        <h2>Your choice to save</h2>
        <p>By default, entries stay in this page’s memory and disappear when you leave or reload it.</p>
        <p>Optional saving keeps only today’s check-in in this browser/device profile. Other people using this profile may see it. Browser backups or synchronization are outside Smile Track’s control.</p>
        <p>A new local day clears the check-in and turns saving off while this page is running or when you next open it. A closed browser cannot actively erase a record. No history is kept, and entries are not sent anywhere.</p>
      </div>
      <label className={styles.consent}><input type="checkbox" disabled={!state} checked={state?.saving ?? false} onChange={toggleSaving} aria-describedby="saving-details" />Save today’s check-in in this browser</label>
      <p role="status" className={styles.status}>{state ? state.saving ? "Saved in this browser for today." : "Saving is off. Current selections are in memory only." : "Saving is off."} {state?.warning}</p>
      <noscript>This check-in needs JavaScript. Entries cannot be changed here while it is disabled.</noscript>
    </section>
  );
}
