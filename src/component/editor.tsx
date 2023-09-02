import { useState } from "react";
import type { EditorState, EditorThemeClasses } from "lexical";
import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { LexicalComposer } from "@lexical/react/LexicalComposer";

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
  namespace: "GiziEditor",
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
  ],
};

export function Editor() {
  const [, setEditorState] = useState("");
  function onChange(editorState: EditorState) {
    const editorStateJSON = editorState.toJSON();
    console.log(editorStateJSON);
    setEditorState(JSON.stringify(editorStateJSON));
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable className={styles.root} />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <TabIndentationPlugin />
      <CheckListPlugin />
      <ListPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <OnChangePlugin onChange={onChange} />
    </LexicalComposer>
  );
}
