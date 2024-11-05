import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { api } from "@/trpc/server";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createClient();

  // Get the current user's session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // Get the provider token from user session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const providerToken = session?.provider_token;

  if (!providerToken) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // Get GitHub user info using the provider token
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${providerToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const githubUser = await response.json();

  // Update user with GitHub ID
  await api.users.update({
    userId: user.id,
    user: {
      githubId: githubUser.id.toString(),
    },
  });

  return NextResponse.redirect(`${origin}`);
}
