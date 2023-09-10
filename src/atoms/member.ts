import { atomWithStorage } from "jotai/utils";

type Member = {
  id: string;
  name: string;
  aliases: string[];
};

export const memberAtom = atomWithStorage<Member[]>("member", []);
