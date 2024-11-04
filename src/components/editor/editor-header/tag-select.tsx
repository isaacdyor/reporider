import { useState } from "react";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import { X } from "lucide-react";
import { api } from "@/trpc/react";
import { type Article } from "@prisma/client";

export function TagSelect({ article }: { article: Article }) {
  const [selectedTags, setSelectedTags] = useState<string[]>(article.tags);
  const [inputValue, setInputValue] = useState("");

  const { mutate: updateArticle } = api.articles.update.useMutation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === " ") && inputValue.trim()) {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (!selectedTags.includes(trimmedValue)) {
        setSelectedTags([...selectedTags, trimmedValue]);
        setInputValue("");
        updateArticle({
          article: { tags: [...selectedTags, trimmedValue] },
          articleId: article.id,
        });
      }
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      selectedTags.length > 0
    ) {
      e.preventDefault();
      const lastTag = selectedTags[selectedTags.length - 1];
      setSelectedTags(selectedTags.slice(0, -1));
      setInputValue(lastTag ?? "");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {selectedTags.map((tag) => (
        <Badge
          onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
          key={tag}
          className="flex h-6 cursor-pointer items-center"
        >
          {tag}
          <X className="ml-2 h-4 w-4" />
        </Badge>
      ))}
      <Input
        className="h-6 w-min border-none px-1 focus-visible:ring-0"
        placeholder="Add a tag"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
