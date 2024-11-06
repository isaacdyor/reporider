"use client";

import { type Article } from "@prisma/client";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { DeleteArticleButton } from "./delete-article-button";

export function ArticleCard({
  article,
  border,
}: {
  article: Article;
  border?: boolean;
}) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/articles/${article.id}`)}
      className={cn(
        border && "border-t",
        "flex justify-between gap-2 p-4 hover:cursor-pointer hover:bg-muted/50",
      )}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">
          {article.title.length > 100
            ? article.title.slice(0, 100) + "..."
            : article.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 4).map((tag) => (
            <Badge className="px-1 text-xs" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          href={`/articles/${article.id}/edit`}
        >
          Edit
        </Link>
        <DeleteArticleButton articleId={article.id} />
      </div>
    </div>
  );
}
