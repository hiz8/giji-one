import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  TextNode,
} from "lexical";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import "./member-picker.css";

class MemberOption extends MenuOption {
  readonly title;
  readonly keywords;

  constructor(
    title: string,
    options: {
      keywords?: Array<string>;
    }
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
  }
}

function MemberMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MemberOption;
}) {
  let className = "item";
  if (isSelected) {
    className += " selected";
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className="text">{option.title}</span>
    </li>
  );
}

type Member = {
  name: string;
  aliases: Array<string>;
};

const MAX_MEMBER_SUGGESTION_COUNT = 10;

type EmojiPickerPluginProps = {
  members: Array<Member>;
};
export function EmojiPickerPlugin({ members }: EmojiPickerPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

  const memberOptions = useMemo(
    () =>
      members != null
        ? members.map(
            ({ name, aliases }) =>
              new MemberOption(name, {
                keywords: aliases,
              })
          )
        : [],
    [members]
  );

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("@", {
    minLength: 0,
  });

  const options: Array<MemberOption> = useMemo(() => {
    return memberOptions
      .filter((option: MemberOption) => {
        return queryString != null
          ? new RegExp(queryString, "gi").exec(option.title) ||
            option.keywords != null
            ? option.keywords.some((keyword: string) =>
                new RegExp(queryString, "gi").exec(keyword)
              )
            : false
          : memberOptions;
      })
      .slice(0, MAX_MEMBER_SUGGESTION_COUNT);
  }, [memberOptions, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: MemberOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection) || selectedOption == null) {
          return;
        }

        if (nodeToRemove) {
          nodeToRemove.remove();
        }

        selection.insertNodes([$createTextNode(`(${selectedOption.title})`)]);

        closeMenu();
      });
    },
    [editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (anchorElementRef.current == null || options.length === 0) {
          return null;
        }

        return anchorElementRef.current && options.length
          ? createPortal(
              <div className="typeahead-popover member-menu">
                <ul>
                  {options.map((option: MemberOption, index) => (
                    <div key={option.key}>
                      <MemberMenuItem
                        index={index}
                        isSelected={selectedIndex === index}
                        onClick={() => {
                          setHighlightedIndex(index);
                          selectOptionAndCleanUp(option);
                        }}
                        onMouseEnter={() => {
                          setHighlightedIndex(index);
                        }}
                        option={option}
                      />
                    </div>
                  ))}
                </ul>
              </div>,
              anchorElementRef.current
            )
          : null;
      }}
    />
  );
}
