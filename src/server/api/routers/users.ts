import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import {
  UserCreateInputSchema,
  UserUpdateInputSchema,
} from "prisma/generated/zod";

export const usersRouter = createTRPCRouter({
  create: privateProcedure
    .input(UserCreateInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          ...input,
          id: ctx.user.id,
        },
      });
    }),

  update: privateProcedure
    .input(UserUpdateInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.user.id },
        data: input,
      });
    }),

  getCurrent: privateProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        githubInstallation: true,
      },
    });
  }),
});
