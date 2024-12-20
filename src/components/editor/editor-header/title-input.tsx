import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { type Article } from "@prisma/client";
import { api } from "@/trpc/react";
import { useEditorStoreActions } from "@/stores/editor-store";

export function TitleInput({ article }: { article: Article }) {
  const [title, setTitle] = useState(article.title);
  const { setIsSaving } = useEditorStoreActions();
  const { mutate: updateArticle } = api.articles.update.useMutation();

  const debouncedSetTitle = useDebouncedCallback((value: string) => {
    updateArticle({
      article: { title: value },
      articleId: article.id,
    });
    setIsSaving(false);
  }, 1000);

  return (
    <AutosizeTextarea
      placeholder="Write a title..."
      className="resize-none overflow-hidden border-none px-0 py-0 text-5xl font-bold focus-visible:ring-0"
      value={title}
      onChange={(e) => {
        setTitle(e.target.value);
        setIsSaving(true);
        debouncedSetTitle(e.target.value);
      }}
    />
  );
}
