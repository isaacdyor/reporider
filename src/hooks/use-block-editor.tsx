import type { AnyExtension, Editor, JSONContent } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import { useDebouncedCallback } from "use-debounce";

import { ExtensionKit } from "@/components/editor/extensions/extension-kit";
import { api } from "@/trpc/react";
import { type Article } from "@prisma/client";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = ({ article }: { article: Article }) => {
  const content = article.content;
  let parsedContent: JSONContent | string = content;
  try {
    parsedContent = JSON.parse(content) as JSONContent;
  } catch {
    parsedContent = content;
  }

  const { mutate: updateArticle } = api.articles.update.useMutation();

  const debouncedLog = useDebouncedCallback(() => {
    if (!editor) return;
    updateArticle({
      articleId: article.id,
      article: {
        content: JSON.stringify(editor?.getJSON()),
      },
    });
  }, 1000);

  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      content: parsedContent,
      extensions: [...ExtensionKit()].filter(
        (e): e is AnyExtension => e !== undefined,
      ),
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class: "min-h-full",
        },
      },
      onUpdate: () => {
        debouncedLog();
      },
    },
    [],
  );

  return { editor };
};
