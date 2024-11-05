import { DashboardContentLayout } from "@/components/dashboard-content-layout";
import { RepoCard } from "@/components/repo-card";
import { getOctokit } from "@/lib/github/octokit";
import { api } from "@/trpc/server";

export default async function DashboardPage() {
  const octokit = await getOctokit();

  const user = await api.users.getCurrent();

  if (!user?.githubInstallation) {
    throw new Error("No GitHub installation ID found");
  }

  const { data: repos } = await octokit.request(
    "GET /installation/repositories",
    {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      per_page: 100,
      sort: "updated",
    },
  );

  return (
    <DashboardContentLayout>
      <div className="flex flex-col gap-4 p-8">
        {repos.repositories.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </DashboardContentLayout>
  );
}
