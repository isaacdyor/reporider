import { getAccessToken } from "@/lib/github/get-access-token";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const installationId = searchParams.get("installation_id");

  if (!installationId) {
    return NextResponse.json(
      { error: "No installation ID provided" },
      { status: 400 },
    );
  }

  try {
    await getAccessToken(installationId);

    // Redirect to success page
    return NextResponse.redirect(`${origin}/dashboard`);
  } catch (error) {
    console.error("Error in GitHub callback:", error);
    return NextResponse.redirect(`${origin}/github-setup-error`);
  }
}
