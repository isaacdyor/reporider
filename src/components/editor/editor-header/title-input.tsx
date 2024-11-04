import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { type Article } from "@prisma/client";
import { api } from "@/trpc/react";

export function TitleInput({ article }: { article: Article }) {
  const [title, setTitle] = useState(article.title);

  const { mutate: updateArticle } = api.articles.update.useMutation();

  const debouncedSetTitle = useDebouncedCallback((value: string) => {
    updateArticle({
      article: { title: value },
      articleId: article.id,
    });
  }, 1000);

  return (
    <AutosizeTextarea
      placeholder="Write a title..."
      className="resize-none overflow-hidden border-none px-0 py-0 text-5xl font-bold focus-visible:ring-0"
      value={title}
      onChange={(e) => {
        setTitle(e.target.value);
        debouncedSetTitle(e.target.value);
      }}
    />
  );
}
