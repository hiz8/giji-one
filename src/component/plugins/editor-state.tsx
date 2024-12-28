import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { editorStateAtom } from "../../atoms/editor-state";

export function EditroStatePlugin() {
  const [editor] = useLexicalComposerContext();
  const editorState = useAtomValue(editorStateAtom);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current && editorState) {
      const initialEditorState = editor.parseEditorState(editorState);
      editor.setEditorState(initialEditorState);
      isFirstRender.current = false;
    }
  }, [editor, editorState]);
  return null;
}
