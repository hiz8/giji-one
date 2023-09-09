import { atom } from "jotai";

type Member = {
  id: string;
  name: string;
  aliases: string[];
};

export const memberAtom = atom<Member[]>([]);
