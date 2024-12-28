import { useState, useRef } from "react";
import { useAtom } from "jotai";
import {
  TagGroup,
  TagList,
  Tag,
  Button,
  TextField,
  Input,
  Form,
  FieldError,
} from "react-aria-components";
import { memberAtom } from "../atoms/member";

import styles from "./member-toolbar.module.css";

export function MemberToolbar() {
  const [members, setMembers] = useAtom(memberAtom);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    const aliases = data.get("aliases") as string;

    if (!name) {
      return;
    }

    // If there is a member with the same name, it will not be added.
    if (members.some((member) => member.name === name)) {
      setValidationErrors({ name: "This name is already used." });
      return;
    }

    setMembers([...members, { name, aliases: aliases.split(" "), id: name }]);
    setValidationErrors({});
    nameInputRef.current?.focus();
    event.currentTarget.reset();
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
            <title>Members</title>
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="10" cy="6" r="4" />
              <path
                strokeLinecap="round"
                d="M21 10h-2m0 0h-2m2 0V8m0 2v2m-1.003 6c.003-.164.003-.331.003-.5c0-2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5S2 22 10 22c2.231 0 3.84-.157 5-.437"
              />
            </g>
          </svg>
        </span>
        <TagList items={members} className={styles.tagList}>
          {(item) => (
            <Tag className={styles.tag}>
              {item.name}{" "}
              <Button slot="remove">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <title>Remove</title>
                  <g fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" d="M15 12H9" />
                  </g>
                </svg>
              </Button>
            </Tag>
          )}
        </TagList>
      </TagGroup>

      <Form
        onSubmit={handleSubmit}
        className={styles.form}
        validationErrors={validationErrors}
      >
        <TextField
          name="name"
          isRequired={true}
          className={styles.formTextField}
        >
          <Input
            placeholder="name"
            ref={nameInputRef}
            className={styles.formTextFieldInput}
          />
          <FieldError className={styles.formFieldError} />
        </TextField>

        <TextField name="aliases">
          <Input placeholder="aliases" className={styles.formTextFieldInput} />
          <FieldError className={styles.formFieldError} />
        </TextField>

        <Button type="submit" className={styles.button}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <title>Add</title>
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path
                strokeLinecap="round"
                d="M15 12h-3m0 0H9m3 0V9m0 3v3"
              />
            </g>
          </svg>
        </Button>
      </Form>
    </div>
  );
}
