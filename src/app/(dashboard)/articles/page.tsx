import { ArticleCard } from "@/components/articles/article-card";
import { DashboardContentLayout } from "@/components/dashboard-content-layout";
import { api } from "@/trpc/server";

export default async function ArticlesPage() {
  const articles = await api.articles.getAll();
  return (
    <DashboardContentLayout routes={[{ label: "Articles", href: "/articles" }]}>
      <div className="flex flex-col rounded-md border">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            border={index !== 0}
          />
        ))}
      </div>
    </DashboardContentLayout>
  );
}
