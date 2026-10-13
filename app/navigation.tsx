import styles from "./page.module.css";
export default function Navigation({ current }: { current: "Home" | "Learn" | "Routine" }) {
  return <nav aria-label="Main navigation" className={styles.nav}>
    {([ ["Home", "/"], ["Learn", "/learn/"], ["Routine", "/routine/"] ] as const).map(([name, href]) =>
      <a className={styles.navLink} key={name} href={href} aria-current={current === name ? "page" : undefined}>{name}</a>)}
  </nav>;
}
