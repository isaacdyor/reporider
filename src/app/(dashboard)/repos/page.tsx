import { DashboardContentLayout } from "@/components/dashboard-content-layout";
import { RepoCard } from "@/components/repo-card";
import { getOctokit } from "@/lib/github/octokit";

const REPOS_TO_DISPLAY = 30;

async function getAllRepositories() {
  const octokit = await getOctokit();
  const allRepos = [];
  let page = 1;

  while (true) {
    try {
      const { data } =
        await octokit.rest.apps.listReposAccessibleToInstallation({
          per_page: 100,
          page: page,
        });

      // If no repositories are returned, we've reached the end
      if (!data.repositories || data.repositories.length === 0) {
        break;
      }

      allRepos.push(...data.repositories);

      // If we received fewer repos than requested, we've reached the end
      if (data.repositories.length < 100) {
        break;
      }

      page++;
    } catch (error) {
      console.error("Error fetching repositories:", error);
      break;
    }
  }

  return allRepos;
}

export default async function DashboardPage() {
  const allRepos = await getAllRepositories();

  // Sort repos by updated_at date and take the 30 most recent
  const recentRepos = [...allRepos]
    .sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at) : new Date(0);
      const dateB = b.updated_at ? new Date(b.updated_at) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, REPOS_TO_DISPLAY);

  return (
    <DashboardContentLayout>
      <div className="flex flex-col gap-4 p-8">
        {recentRepos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </DashboardContentLayout>
  );
}
