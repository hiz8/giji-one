import { useState, useRef } from "react";
import { atom, useAtom } from "jotai";
import {
  TagGroup,
  TagList,
  Tag,
  Button,
  TextField,
  Input,
} from "react-aria-components";

import styles from "./member-toolbar.module.css";

type Member = {
  id: string;
  name: string;
  aliases: string[];
};

export const memberAtom = atom<Member[]>([]);

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

    if (!name) {
      return;
    }

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
    <div id="member" className={styles.root}>
      <TagGroup
        selectionMode="single"
        onRemove={handleRemove}
        className={styles.tagGroup}
      >
        <span className={styles.labelIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="10" cy="6" r="4"></circle>
              <path
                strokeLinecap="round"
                d="M21 10h-2m0 0h-2m2 0V8m0 2v2m-1.003 6c.003-.164.003-.331.003-.5c0-2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5S2 22 10 22c2.231 0 3.84-.157 5-.437"
              ></path>
            </g>
          </svg>
        </span>
        <TagList items={members} className={styles.tagList}>
          {(item) => (
            <Tag className={styles.tag}>
              {item.name}{" "}
              <Button slot="remove" className={styles.removeButton}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <g fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path strokeLinecap="round" d="M15 12H9"></path>
                  </g>
                </svg>
              </Button>
            </Tag>
          )}
        </TagList>
      </TagGroup>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField isInvalid={errorMessage !== ""} isRequired={true}>
          <Input
            name="name"
            placeholder="name"
            ref={nameInputRef}
            className={styles.nameInput}
          />
        </TextField>
        <Input
          name="aliases"
          placeholder="aliases"
          ref={aliasesInputRef}
          className={styles.aliasesInput}
        />
        <Button type="submit" className={styles.button}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <path
                strokeLinecap="round"
                d="M15 12h-3m0 0H9m3 0V9m0 3v3"
              ></path>
            </g>
          </svg>
        </Button>
        {errorMessage && (
          <span className={styles.errorMessage}>{errorMessage}</span>
        )}
      </form>
    </div>
  );
}
