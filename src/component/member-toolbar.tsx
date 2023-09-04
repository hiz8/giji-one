import { useState, useRef } from "react";
import { atom, useAtom } from "jotai";
import {
  TagGroup,
  TagList,
  Tag,
  Label,
  Button,
  TextField,
  Input,
} from "react-aria-components";

type Member = {
  id: string;
  name: string;
  aliases: string[];
};

export const memberAtom = atom<Member[]>([
  {
    id: "田中太郎",
    name: "田中太郎",
    aliases: ["tanaka taro"],
  },
  {
    id: "山田花子",
    name: "山田花子",
    aliases: ["yamada hanako"],
  },
]);

export function MemberToolbar() {
  const [members, setMembers] = useAtom(memberAtom);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const aliasesInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    const aliases = data.get("aliases") as string;

    // 同じ名前のメンバーがいたら追加しない
    if (members.some((member) => member.name === name)) {
      setErrorMessage("同じ名前のメンバーがいます");
      return;
    }

    setMembers([...members, { name, aliases: aliases.split(" "), id: name }]);
    setErrorMessage(null);

    if (nameInputRef.current) {
      nameInputRef.current.value = "";
    }
    if (aliasesInputRef.current) {
      aliasesInputRef.current.value = "";
    }
  }

  function handleRemove(keys: Set<React.Key>) {
    setMembers(members.filter((member) => member.name !== [...keys][0]));
  }

  return (
    <>
      <TagGroup selectionMode="single" onRemove={handleRemove}>
        <Label>Members</Label>
        <TagList items={members}>
          {(item) => (
            <Tag>
              {item.name} <Button slot="remove">ⓧ</Button>
            </Tag>
          )}
          {/* {members.map((member) => (
            <Tag key={member.name}>
              {member.name} <Button slot="remove">ⓧ</Button>
            </Tag>
          ))} */}
        </TagList>
      </TagGroup>
      <form onSubmit={handleSubmit}>
        <TextField validationState={errorMessage !== "" ? "invalid" : "valid"}>
          <Input name="name" placeholder="name" ref={nameInputRef} />
          {errorMessage && <span>{errorMessage}</span>}
        </TextField>
        <Input name="aliases" placeholder="aliases" ref={aliasesInputRef} />
        <Button type="submit">add</Button>
      </form>
    </>
  );
}
