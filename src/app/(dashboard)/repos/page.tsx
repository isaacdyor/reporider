import { DashboardContentLayout } from "@/components/dashboard-content-layout";
import { RepoCard } from "@/components/repo-card";
import { getOctokit } from "@/lib/github/octokit";

export default async function DashboardPage() {
  const octokit = await getOctokit();

  // doesnt work for more than 100 reposs
  const { data: repos } =
    await octokit.rest.apps.listReposAccessibleToInstallation({
      per_page: 100,
    });

  const sortedRepos = [...repos.repositories].sort((a, b) => {
    const dateA = a.updated_at ? new Date(a.updated_at) : new Date(0);
    const dateB = b.updated_at ? new Date(b.updated_at) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <DashboardContentLayout>
      <div className="flex flex-col gap-4 p-8">
        {sortedRepos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </DashboardContentLayout>
  );
}
