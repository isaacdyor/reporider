import { NextResponse } from "next/server";
import { generateJwt } from "@/lib/github/generate-jwt";
import { api } from "@/trpc/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const installationId = searchParams.get("installation_id");

  if (!installationId) {
    return NextResponse.json(
      { error: "No installation ID provided" },
      { status: 400 },
    );
  }

  try {
    // Generate JWT
    const jwt = generateJwt();

    // Get installation token
    const response = await fetch(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const data = await response.json();
    const installationToken = data.token;

    // Store the token in your database
    const user = await api.users.update({
      user: {
        githubInstallationId: installationId,
      },
    });

    // Redirect to success page
    return NextResponse.redirect(`${origin}/github-setup-success`);
  } catch (error) {
    console.error("Error in GitHub callback:", error);
    return NextResponse.redirect(`${origin}/github-setup-error`);
  }
}
