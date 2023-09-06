import { Fragment } from "react";
import { atom, useAtom } from "jotai";
import styles from "./hashtag-viewer.module.css";

type Hashtag = Record<
  number,
  {
    hashtag: string;
    text: string;
  }
>;

export const hashtagAtom = atom<Hashtag>({});

export function HashtagViewer() {
  const [data] = useAtom(hashtagAtom);

  // data を hashtag ごとにグルーピングする
  const groupedData = Object.values(data).reduce((acc, cur) => {
    if (acc[cur.hashtag]) {
      acc[cur.hashtag].push(cur.text);
    } else {
      acc[cur.hashtag] = [cur.text];
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div id="hashtags" className={styles.root}>
      {Object.entries(groupedData).map(([key, values]) => (
        <Fragment key={key}>
          <h2 className={styles.headline}>{key.slice(1)}</h2>
          <ul className={styles.list}>
            {values.map((value) => {
              return <li key={value}>{value}</li>;
            })}
          </ul>
        </Fragment>
      ))}
    </div>
  );
}
