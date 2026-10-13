import Navigation from "./navigation";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={styles.header}>
        <span className={styles.wordmark}>Smile Track<span aria-hidden="true">.</span></span>
        <Navigation current="Home" />
      </header>
      <main id="main" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="page-title">
          <p className={styles.eyebrow}>A clearer view of oral health</p>
          <h1 id="page-title">Oral health,<br /><span>understood.</span></h1>
          <p className={styles.intro}>Smile Track is being built to make oral-health education and personal tracking easier to understand.</p>
          <p className={styles.status}>This is an early preview. A private daily routine check-in is available. Educational lessons and capture features are not available yet.</p>
          <a className={styles.link} href="#about">About this preview <span aria-hidden="true">↘</span></a>
        </section>
        <section id="about" tabIndex={-1} className={styles.about} aria-labelledby="about-title">
          <div>
            <p className={styles.eyebrow}>Built with care</p>
            <h2 id="about-title">Understanding starts<br />with clear boundaries.</h2>
          </div>
          <div className={styles.notes}>
            <div><h3>Education, not diagnosis</h3><p>Smile Track is not a diagnostic medical device and does not provide diagnoses or replace professional dental care.</p></div>
            <div><h3>No personal information needed</h3><p>This preview has no accounts or photo uploads. Routine entries stay in your browser, with saving off by default.</p></div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}><span>Smile Track</span><span>Thoughtful progress. Clear limits.</span></footer>
    </div>
  );
}
