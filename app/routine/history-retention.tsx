"use client";

import { useEffect } from "react";
import { historyOperation } from "./history-storage";

// Retention also applies when the app is reopened on Home or Learn. This never
// enables history, adds an entry, or exposes entries to another route's markup.
export default function HistoryRetention() {
  useEffect(() => {
    const refresh = () => { void historyOperation("read"); };
    refresh();
    window.addEventListener("pageshow", refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return null;
}
