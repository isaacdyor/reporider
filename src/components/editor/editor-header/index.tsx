"use client";

import { useEffect } from "react";
import { useState } from "react";
import { TagSelect } from "./tag-select";
import { TitleInput } from "./title-input";
import { type Article } from "@prisma/client";

export default function EditorHeader({ article }: { article: Article }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-2 pb-12 pl-20 pr-8 lg:max-w-3xl">
      <TitleInput article={article} />
      <TagSelect article={article} />
    </div>
  );
}
