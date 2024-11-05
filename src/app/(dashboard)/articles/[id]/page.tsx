import "@/styles/index.css";
import { api } from "@/trpc/server";
import { ProseMirrorRenderer } from "@/components/prose-mirror-renderer";
import { DashboardContentLayout } from "@/components/dashboard-content-layout";
import { type Article } from "@prisma/client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await api.articles.getById({ id });

  if (!article) {
    return null;
  }

  return (
    <DashboardContentLayout
      rightComponent={<EditButton article={article} />}
      routes={[
        { label: "Articles", href: "/articles" },
        { label: article.title, href: `/articles/${article.id}` },
      ]}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-4 pb-12 pl-20 pr-8 lg:max-w-3xl">
        <h1 className="text-5xl font-bold">{article.title}</h1>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>

      <article className="prose prose-slate max-w-none p-6">
        <ProseMirrorRenderer content={article.content} />
      </article>
    </DashboardContentLayout>
  );
}

const EditButton = ({ article }: { article: Article }) => {
  return (
    <Link
      className={buttonVariants({ size: "thin" })}
      href={`/articles/${article.id}/edit`}
    >
      Edit
    </Link>
  );
};
