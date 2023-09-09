import { atom } from "jotai";

type Hashtag = Record<
  number,
  {
    hashtag: string;
    text: string;
  }
>;

export const hashtagAtom = atom<Hashtag>({});
