import { DashboardContentLayout } from "@/components/dashboard-content-layout";
import { Editor } from "@/components/editor";
import { EditorTopbar } from "@/components/editor/editor-topbar";
import EditorHeader from "@/components/editor/editor-header";
import { api } from "@/trpc/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: PageProps) {
  const { id } = await params;
  const article = await api.articles.getById({ id });

  if (!article) {
    return <p>not found</p>;
  }

  return (
    <DashboardContentLayout
      rightComponent={<EditorTopbar article={article} />}
      routes={[
        { label: "Editor", href: `/editor/${id}` },
        { label: article?.title ?? "Untitled", href: `/editor/${id}` },
      ]}
    >
      <EditorHeader article={article} />

      <Editor article={article} />
    </DashboardContentLayout>
  );
}
