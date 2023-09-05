import { atom, useAtom } from "jotai";

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
    <div>
      {Object.entries(groupedData).map(([key, values]) => (
        <div key={key}>
          <h2>{key}</h2>
          {values.map((value) => {
            return <div key={value}>{value}</div>;
          })}
        </div>
      ))}
    </div>
  );
}
