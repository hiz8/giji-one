import styles from "./logo.module.css";

export function Logo() {
  return (
    <div className={styles.root}>
      <h1 className={styles.bland}>
        <span>Gizi</span>one
      </h1>
    </div>
  );
}
