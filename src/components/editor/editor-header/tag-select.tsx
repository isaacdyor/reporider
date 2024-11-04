import { useState } from "react";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import { X } from "lucide-react";

export function TagSelect({ tags }: { tags: string[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>(tags);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === " ") && inputValue.trim()) {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (!selectedTags.includes(trimmedValue)) {
        setSelectedTags([...selectedTags, trimmedValue]);
      }
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {selectedTags.map((tag) => (
        <Badge
          onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
          key={tag}
          className="flex h-6 items-center"
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
