import type { Metadata } from "next";
import { getPublishedLessons } from "../../education/catalog.ts";
import styles from "./page.module.css";
import shell from "../page.module.css";

export const metadata: Metadata = {
  title: "Learn | Smile Track",
  description: "The home for reviewed oral-health education at Smile Track. No lessons are published yet.",
};

export default function Learn() {
  const lessons = getPublishedLessons();
  return (
    <div className={shell.shell}>
      <a className={shell.skipLink} href="#main">Skip to content</a>
      <header className={shell.header}>
        <span className={shell.wordmark}>Smile Track<span aria-hidden="true">.</span></span>
        <nav aria-label="Main navigation" className={styles.nav}>
          <a href="/">Home</a>
          <a href="/learn/" aria-current="page">Learn</a>
        </nav>
      </header>
      <main id="main" tabIndex={-1} className={styles.main}>
        <p className={shell.eyebrow}>Oral-health education</p>
        <h1>Learn</h1>
        <p className={styles.intro}>A place for clear, carefully reviewed information about oral health.</p>
        {lessons.length === 0 ? (
          <section className={styles.empty} aria-labelledby="empty-title">
            <span className={shell.badge}>In preparation</span>
            <h2 id="empty-title">No lessons published yet</h2>
            <p>We’ll add lessons after their sources and content have been reviewed and approved for publication.</p>
            <p>There are no articles to open right now.</p>
          </section>
        ) : (
          <section aria-labelledby="lessons-title" className={styles.lessons}>
            <h2 id="lessons-title">Published lessons</h2>
            <ul>{lessons.map(lesson => <li key={lesson.id}><a href={`#lesson-${lesson.id}`}>{lesson.title}</a></li>)}</ul>
            {lessons.map(lesson => (
              <article key={lesson.id} id={`lesson-${lesson.id}`} tabIndex={-1} aria-labelledby={`title-${lesson.id}`}>
                <h3 id={`title-${lesson.id}`}>{lesson.title}</h3>
                {lesson.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                <h4>Limits and safety information</h4>
                <ul>{[...lesson.limitations, ...lesson.safetyNotices].map((notice, i) => <li key={i}>{notice}</li>)}</ul>
                <h4>Sources</h4>
                <ul>{lesson.sources.map(source => <li key={source.id}><a href={source.url}>{source.title}</a> — {source.publisher}</li>)}</ul>
              </article>
            ))}
          </section>
        )}
        <aside className={styles.notice} aria-label="About this education preview">
          <p>Smile Track is not a diagnostic medical device and does not provide diagnoses or replace professional dental care.</p>
          <p>No account or personal health information is needed to browse this preview.</p>
        </aside>
        <a className={shell.link} href="/">Back to home <span aria-hidden="true">↗</span></a>
      </main>
      <footer className={shell.footer}><span>Smile Track</span><span>Thoughtful progress. Clear limits.</span></footer>
    </div>
  );
}
