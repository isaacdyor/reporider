import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { GithubInstallationUpsertWithoutUserInputSchema } from "prisma/generated/zod";

export const githubInstallationsRouter = createTRPCRouter({
  upsert: privateProcedure
    .input(GithubInstallationUpsertWithoutUserInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.githubInstallation.upsert({
        where: {
          userId: ctx.user.id,
        },
        update: input.update,
        create: {
          ...input.create,
          user: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      });
    }),
});
