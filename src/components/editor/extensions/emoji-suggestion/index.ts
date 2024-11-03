import { type Editor } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import {
  type SuggestionKeyDownProps,
  type SuggestionProps,
} from "@tiptap/suggestion";
import tippy from "tippy.js";

import { type RefAttributes } from "react";
import EmojiList from "./emoji-list";
import { type EmojiListProps } from "./types";

interface EmojiStorage {
  emojis: Array<{ shortcodes: string[]; tags: string[] }>;
}

export const emojiSuggestion = {
  items: ({ editor, query }: { editor: Editor; query: string }) =>
    (editor.storage.emoji as EmojiStorage).emojis
      .filter(
        ({ shortcodes, tags }) =>
          shortcodes.find((shortcode) =>
            shortcode.startsWith(query.toLowerCase()),
          ) ?? tags.find((tag) => tag.startsWith(query.toLowerCase())),
      )
      .slice(0, 250),

  allowSpaces: false,

  render: () => {
    let component: ReactRenderer<
      { onKeyDown: (evt: SuggestionKeyDownProps) => boolean },
      EmojiListProps &
        RefAttributes<{ onKeyDown: (evt: SuggestionKeyDownProps) => boolean }>
    >;
    let popup: ReturnType<typeof tippy>;

    return {
      onStart: (props: SuggestionProps<unknown>) => {
        component = new ReactRenderer(EmojiList, {
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: SuggestionProps<unknown>) {
        component.updateProps(props);

        popup[0]?.setProps({
          getReferenceClientRect: props.clientRect as () => DOMRect,
        });
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === "Escape") {
          popup[0]?.hide();
          component.destroy();

          return true;
        }

        return component.ref?.onKeyDown(props) ?? false;
      },

      onExit() {
        popup[0]?.destroy();
        component.destroy();
      },
    };
  },
};

export default emojiSuggestion;