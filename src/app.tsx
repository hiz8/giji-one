import { Editor } from "./component/editor";
import styles from "./app.module.css";

function App() {
  return (
    <>
      <h1 className={styles.test}>Gizi one</h1>
      <Editor />
    </>
  );
}

export default App;
