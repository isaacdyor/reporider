import { redirect } from "next/navigation";
import { Octokit } from "octokit";
import { getSession } from "./supabase/server";

let octokitInstance: Octokit | null = null;

export const getOctokit = async ({ pathname }: { pathname: string }) => {
  const { session } = await getSession();

  if (!session) {
    redirect("/signin");
  }

  if (!session.provider_token) {
    redirect(`/refresh?pathname=${pathname}`);
  }

  if (!octokitInstance) {
    octokitInstance = new Octokit({
      auth: session.provider_token,
    });
  }
  return octokitInstance;
};
