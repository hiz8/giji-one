import styles from "./logo.module.css";

export function Logo() {
  return (
    <div className={styles.root}>
      <h1 className={styles.bland}>
        <span>Giji</span>one
      </h1>
    </div>
  );
}
