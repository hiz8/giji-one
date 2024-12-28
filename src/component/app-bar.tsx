import styles from "./app-bar.module.css";

type AppBarProps = {
  children: React.ReactNode;
};
export function AppBar(props: AppBarProps) {
  return (
    <div id="app-bar" className={styles.root}>
      {props.children}
    </div>
  );
}
