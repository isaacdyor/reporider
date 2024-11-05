import { api } from "@/trpc/server";
import { Octokit } from "octokit";
import { getAccessToken } from "./get-access-token";

export const getOctokit = async () => {
  const user = await api.users.getCurrent();

  if (!user?.githubInstallation) {
    throw new Error("No GitHub installation ID found");
  }

  let token = user.githubInstallation.accessToken;

  const expiresAt = new Date(user.githubInstallation.expiresAt);
  const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);

  if (expiresAt < tenMinutesFromNow) {
    token = await getAccessToken(user.githubInstallation.installationId);
  }

  // Create a new instance every time to ensure we're using the current token
  return new Octokit({
    auth: token,
  });
};
