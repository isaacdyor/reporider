import { env } from "@/env";
import jwt from "jsonwebtoken";

export const generateJwt = () => {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iat: now - 60,
    exp: now + 10 * 60,
    iss: env.GITHUB_APP_ID,
  };

  return jwt.sign(payload, env.GITHUB_PRIVATE_KEY, {
    algorithm: "RS256",
  });
};
