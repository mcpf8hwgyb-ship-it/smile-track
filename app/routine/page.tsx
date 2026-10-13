import type { Metadata } from "next";
import Navigation from "../navigation";
import shell from "../page.module.css";
import styles from "./routine.module.css";
import CheckIn from "./check-in";

export const metadata: Metadata = { title: "My daily routine | Smile Track", description: "A private, user-entered check-in for today. Optional browser-local saving; no clinical assessment." };
export default function Routine() {
  return <div className={shell.shell}>
    <a className={shell.skipLink} href="#main">Skip to content</a>
    <header className={shell.header}>
      <span className={shell.wordmark}>Smile Track<span aria-hidden="true">.</span></span>
      <Navigation current="Routine" />
    </header>
    <main id="main" tabIndex={-1} className={styles.main}>
      <h1>My daily routine</h1>
      <p className={styles.intro}>A simple record of what you report doing today. No scores, goals or health judgments.</p>
      <CheckIn />
      <p className={styles.notice}>Smile Track is not a diagnostic medical device and does not provide diagnoses or replace professional dental care. This check-in is not dentist-reviewed or clinically validated.</p>
    </main>
    <footer className={shell.footer}><span>Smile Track</span><span>Thoughtful progress. Clear limits.</span></footer>
  </div>;
}
