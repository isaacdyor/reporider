import { api } from "@/trpc/server";
import { generateJwt } from "./generate-jwt";
import { z } from "zod";

const AccessTokenResponseSchema = z.object({
  token: z.string(),
  expires_at: z.string(),
});

export const getAccessToken = async (installationId: string) => {
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

  const data = (await response.json()) as unknown;
  const { token, expires_at } = AccessTokenResponseSchema.parse(data);

  // Store the token in your database
  await api.users.update({
    githubInstallation: {
      upsert: {
        where: { installationId },
        update: {
          accessToken: token,
          expiresAt: new Date(expires_at),
        },
        create: {
          installationId,
          accessToken: token,
          expiresAt: new Date(expires_at),
        },
      },
    },
  });
  return token;
};
