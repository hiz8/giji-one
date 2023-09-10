import { useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import type { EditorState, EditorThemeClasses } from "lexical";
import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HashtagNode } from "@lexical/hashtag";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";

import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { TRANSFORMERS } from "@lexical/markdown";

import { EditroStatePlugin } from "./plugins/editor-state";
import { EmojiPickerPlugin } from "./plugins/member-picker";
import { HashtagPlugin, type HashTagState } from "./plugins/hashtag";

import { editorStateAtom } from "../atoms/editor-state";
import { memberAtom } from "../atoms/member";
import { hashtagAtom } from "../atoms/hashtag";

import styles from "./editor.module.css";

const theme: EditorThemeClasses = {
  ltr: styles.ltr,
  rtl: styles.rtl,
  paragraph: styles.paragraph,
  placeholder: styles.placeholder,
  quote: styles.quote,
  heading: {
    h1: styles.headingH1,
    h2: styles.headingH2,
    h3: styles.headingH3,
    h4: styles.headingH4,
    h5: styles.headingH5,
    h6: styles.headingH6,
  },
  list: {
    nested: {
      listitem: styles.nestedListitem,
    },
    ol: styles.listOl,
    ul: styles.listUl,
    listitem: styles.listitem,
    listitemChecked: styles.listitemChecked,
    listitemUnchecked: styles.listitemUnchecked,
  },
  hashtag: styles.hashtag,
  text: {
    bold: styles.textBold,
    code: styles.textCode,
    italic: styles.textItalic,
    strikethrough: styles.textStrikethrough,
    subscript: styles.textSubscript,
    superscript: styles.textSuperscript,
    underline: styles.textUnderline,
    underlineStrikethrough: styles.textUnderlineStrikethrough,
  },
};

function onError(error: unknown) {
  console.error(error);
}

const initialConfig = {
  namespace: "GijiEditor",
  theme,
  onError,
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    HorizontalRuleNode,
    LinkNode,
    HashtagNode,
  ],
};

export function Editor() {
  const isFirstRender = useRef(true);
  const setEditorState = useSetAtom(editorStateAtom);

  function onChange(editorState: EditorState) {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const editorStateJSON = editorState.toJSON();
    setEditorState(JSON.stringify(editorStateJSON));
  }

  const members = useAtomValue(memberAtom);

  const setHashtags = useSetAtom(hashtagAtom);

  function handleUpdateHashtagState(hashtags: HashTagState) {
    setHashtags(hashtags);
  }

  return (
    <div id="editor">
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <div className={styles.outer}>
              <ContentEditable className={styles.root} />
            </div>
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <TabIndentationPlugin />
        <CheckListPlugin />
        <ListPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <OnChangePlugin onChange={onChange} />

        <EditroStatePlugin />
        <EmojiPickerPlugin members={members} />
        <HashtagPlugin onUpdateHashtagState={handleUpdateHashtagState} />
      </LexicalComposer>
    </div>
  );
}
