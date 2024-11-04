import { useState } from "react";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

export function TitleInput({ title }: { title: string }) {
  const [value, setValue] = useState(title);
  return (
    <AutosizeTextarea
      placeholder="Write a title..."
      className="resize-none overflow-hidden border-none px-0 py-0 text-4xl font-bold focus-visible:ring-0"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
