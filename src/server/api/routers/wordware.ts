import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env";

const WORDWARE_CONFIG = {
  orgSlug: "isaac-dyor-d74b42",
  version: "latest",
};

const getEndpoint = (appSlug: string) => {
  return `https://api.wordware.ai/v1alpha/apps/${WORDWARE_CONFIG.orgSlug}/${appSlug}/${WORDWARE_CONFIG.version}/runs/wait?timeout=0`;
};

const getDraftResponseSchema = z.object({
  outputs: z.object({
    title: z.string().transform((str) => str.replace(/^"|"$/g, "")),
    tags: z.string().transform((str) => {
      try {
        return JSON.parse(str) as string[];
      } catch {
        // Fallback to splitting if not valid JSON
        return str.split(",").map((tag) => tag.trim());
      }
    }),
    article: z.string(),
  }),
});

const inlineEditResponseSchema = z.object({
  outputs: z.object({
    edit: z.string(),
  }),
});

export const wordwareRouter = createTRPCRouter({
  getDraft: publicProcedure
    .input(z.object({ commits: z.string().min(1) }))

    .mutation(async ({ input }) => {
      const appSlug = "540d322c-32f3-4b9b-a18d-9c6a5dd67551";
      const endpoint = getEndpoint(appSlug);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.WORDWARE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            commits: input.commits,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = (await response.json()) as unknown;
      console.log(json);
      const result = getDraftResponseSchema.parse(json);
      return result.outputs;
    }),

  inlineEdit: publicProcedure
    .input(
      z.object({
        selected: z.string().min(1),
        context: z.string().min(1),
        edit: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const appSlug = "540d322c-32f3-4b9b-a18d-9c6a5dd67551";
      const endpoint = getEndpoint(appSlug);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.WORDWARE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            selected: input.selected,
            context: input.context,
            edit: input.edit,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = (await response.json()) as unknown;
      console.log(json);
      const result = inlineEditResponseSchema.parse(json);
      return result.outputs;
    }),
});
