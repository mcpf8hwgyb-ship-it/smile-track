"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fresh, localDate, routineOperation, STORAGE_KEY, type RecordToday, type RoutineRequest } from "./storage";
import History, { type HistoryControl } from "./history";
import styles from "./routine.module.css";

type Action = RoutineRequest["action"];
type State = { record: RecordToday; saving: boolean; observed: string | null; warning: string; pending: Action | null };
const detachedNotice = "A saved current-day record exists but is not attached here. Choose saving to restore it without replacing it.";
const freshState = (): State => ({ record: fresh(), saving: false, observed: null, warning: "", pending: null });

export default function CheckIn() {
  const [state, setState] = useState<State | null>(null);
  const current = useRef<State | null>(null);
  const history = useRef<HistoryControl>(null);
  const pending = useRef<AbortController | null>(null);
  const detached = useRef(false);
  const blocked = useRef(false);
  const alive = useRef(false);
  const allBusy = useRef(false);
  const [erasingAll, setErasingAll] = useState(false);
  const publish = useCallback((next: State) => { current.current = next; setState(next); }, []);
  const abortPending = useCallback(() => { pending.current?.abort(); pending.current = null; }, []);
  function continueInMemory() {
    abortPending();
    detached.current = true;
    const next = current.current;
    if (next) publish({ ...next, saving: false, observed: null, pending: null, warning: "Pending work cancelled here. A write already completed cannot be undone by cancellation. Saved records may remain; use the erase control or your browser’s site-data controls to remove them." });
  }
  const run = useCallback(async (action: Action, record = current.current?.record, observed = current.current?.observed) => {
    abortPending();
    const controller = new AbortController();
    pending.current = controller;
    const requestedDate = record?.date ?? localDate();
    const start = current.current ?? freshState();
    publish({ ...start, pending: action });
    const answer = await routineOperation({ action, record, observed, date: requestedDate, signal: controller.signal });
    // Abort prevents queued mutation; this identity check separately prevents old UI results.
    if (!alive.current || pending.current !== controller || controller.signal.aborted) return false;
    pending.current = null;
    const next = current.current ?? freshState();
    if (answer.outcome === "cancelled") { publish({ ...next, pending: null, saving: false }); return false; }
    if (answer.outcome === "error") {
      blocked.current = true;
      detached.current = true;
      publish({ ...next, pending: null, saving: false, observed: null, warning: answer.notice });
      return false;
    }
    if (answer.outcome === "date" || next.record.date !== localDate()) {
      detached.current = true;
      publish({ ...freshState(), warning: answer.record?.date === localDate() ? detachedNotice : "The local date changed. Review today’s fresh check-in before saving." });
      return false;
    }
    if (action === "erase") {
      blocked.current = false;
      detached.current = true;
      publish({ ...next, pending: null, saving: false, observed: null, warning: "Check-in erased. Saving is off." });
    } else if (action === "read" && (detached.current || blocked.current)) {
      publish({ ...next, pending: null, saving: false, observed: null, warning: answer.record ? detachedNotice : next.warning });
    } else {
      if (action === "enable") { detached.current = false; blocked.current = false; }
      if (answer.outcome === "conflict" && !answer.record) detached.current = true;
      publish({ record: answer.record ?? (action === "edit" ? next.record : fresh()), saving: answer.record !== null,
        observed: answer.raw, pending: null, warning: answer.notice });
    }
    return answer.outcome === "ok";
  }, [abortPending, publish]);
  const rollover = useCallback((): State | null => {
    const next = current.current;
    if (next && next.record.date !== localDate()) {
      abortPending();
      detached.current = true;
      publish({ ...freshState(), warning: blocked.current ? next.warning : "A new day has started. Saving is off for this fresh check-in." });
      if (!blocked.current) void run("read");
    }
    return current.current;
  }, [abortPending, publish, run]);
  useEffect(() => {
    alive.current = true;
    publish(freshState());
    void run("read");
    function refresh() {
      if (allBusy.current) return;
      const old = current.current?.record.date !== localDate();
      rollover();
      if (!old && !pending.current && !blocked.current && current.current?.saving) void run("read");
    }
    function storageChanged(event: StorageEvent) {
      if ((event.key === STORAGE_KEY || event.key === null) && !allBusy.current) {
        const hadIntent = current.current?.pending && current.current.pending !== "read";
        abortPending();
        rollover();
        if (hadIntent) {
          detached.current = true;
          const next = current.current;
          if (next) publish({ ...next, saving: false, observed: null, pending: null, warning: "Saved data changed while work was pending. Review it before choosing saving again." });
        }
        if (!blocked.current) void run("read");
      }
    }
    function hide() {
      abortPending();
      if (current.current?.record.date !== localDate()) detached.current = true;
      publish(freshState());
    }
    function show(event: PageTransitionEvent) {
      if (event.persisted) { rollover(); if (!blocked.current) void run("read"); }
      else refresh();
    }
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
      alive.current = false;
      abortPending();
      clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", show);
      window.removeEventListener("pagehide", hide);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("storage", storageChanged);
    };
  }, [abortPending, publish, rollover, run]);

  function select(activity: "brushedTeeth" | "cleanedBetweenTeeth") {
    const rolled = current.current?.record.date !== localDate();
    rollover();
    const next = current.current;
    if (!next) return;
    if (pending.current && next.pending !== "read") continueInMemory();
    else if (pending.current && !rolled) abortPending();
    const latest = current.current ?? next;
    const record = { ...latest.record, [activity]: !latest.record[activity] };
    publish({ ...latest, record, pending: rolled ? latest.pending : null });
    if (latest.saving && !rolled) void run("edit", record, latest.observed);
  }
  function toggleSaving(wanted: boolean) {
    // Capture enable/disable intent before rollover; never invert post-wait state.
    const next = rollover();
    if (!next) return;
    if (!wanted) {
      abortPending(); detached.current = true;
      publish({ ...next, saving: false, observed: null, pending: null });
      void run("erase");
    } else void run("enable", next.record);
  }
  function reset() {
    abortPending(); detached.current = true;
    publish(freshState());
    void run("erase");
  }
  async function resetAll() {
    abortPending(); detached.current = true; allBusy.current = true;
    setErasingAll(true);
    publish(freshState());
    // H has fully released before R is requested. This is not a two-key transaction.
    const historyRemoved = await history.current?.erase();
    if (!alive.current) return;
    const todayRemoved = await run("erase");
    if (!alive.current) return;
    const next = current.current ?? freshState();
    publish({ ...next, saving: false, warning: todayRemoved && historyRemoved
      ? "All routine data erased in separately verified operations. Both saving options are off here. Another tab may subsequently enable saving again."
      : `Erasure of all routine data could not be verified. History erasure: ${historyRemoved ? "verified" : "unverified"}; today-only erasure: ${todayRemoved ? "verified" : "unverified"}. Saving is off here. Use your browser’s site-data controls to remove remaining records.` });
    allBusy.current = false;
    setErasingAll(false);
  }
  return (
    <section className={styles.card} aria-label="Today's check-in">
      <p className={styles.date}>{state ? `Today · ${state.record.date}` : "Loading your local date…"}</p>
      <fieldset disabled={!state || erasingAll} className={styles.activities}>
        <legend>What did you do today?</legend>
        <label><input type="checkbox" checked={state?.record.brushedTeeth ?? false} onChange={() => select("brushedTeeth")} />Brushed teeth</label>
        <label><input type="checkbox" checked={state?.record.cleanedBetweenTeeth ?? false} onChange={() => select("cleanedBetweenTeeth")} />Cleaned between teeth</label>
      </fieldset>
      <p>Select again to undo. These are your own records, not an assessment of your health, technique or how often you should act.</p>
      <button type="button" disabled={!state || erasingAll} onClick={reset}>Erase today-only record and turn off today-only saving</button>
      <p>This erase control resets the checkboxes and removes only today-only saving. It does not change separately recorded history.</p>
      <div className={styles.privacy} id="saving-details">
        <h2>Your choice to save</h2>
        <p>By default, selections stay in this page’s memory and disappear when you leave or reload it. History below has its own consent and explicit recording action.</p>
        <p>Optional saving keeps only today’s check-in in this browser/device profile. Other people using this profile may see it. Browser backups or synchronization are outside Smile Track’s control.</p>
        <p>A new local day resets this tab’s old selections and turns saving off here. A current-day record saved in another tab is preserved; choose saving to restore it. Expired records are removed when coordinated storage is available. A closed browser or unavailable coordination cannot actively erase a record. Saving and in-app deletion require browser tab coordination. If it is unavailable, use this check-in in memory and browser site-data controls to remove saved records. This option does not keep history, and entries are not sent anywhere.</p>
      </div>
      <label className={styles.consent}><input type="checkbox" disabled={!state || erasingAll || state.pending !== null} checked={state?.pending === "enable" || (state?.saving ?? false)} onChange={event => toggleSaving(event.target.checked)} aria-describedby="saving-details" />Save today’s check-in in this browser</label>
      <p role="status" aria-label="Today-only status" className={styles.status}>{state?.pending ? "Waiting for coordinated browser storage. Saving or erasure is not yet confirmed." : state ? state.saving ? "Saved in this browser for today." : "Today-only saving is off. Current selections are in page memory; separately recorded history is shown below." : "Saving is off."} {state?.warning}</p>
      {state?.pending && !erasingAll && <button type="button" onClick={continueInMemory}>Cancel pending work and continue in memory</button>}
      <History ref={history} record={state?.record ?? null} onEraseAll={() => void resetAll()} erasingAll={erasingAll} />
      <noscript>This check-in needs JavaScript. Entries cannot be changed here while it is disabled.</noscript>
    </section>
  );
}
