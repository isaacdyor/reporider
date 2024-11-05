import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { z } from "node_modules/zod/lib";
import {
  UserCreateInputSchema,
  UserUpdateInputSchema,
} from "prisma/generated/zod";

const UpdateUserInputSchema = z.object({
  user: UserUpdateInputSchema,
  userId: z.string(),
});

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
    .input(UpdateUserInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: input.userId },
        data: input.user,
      });
    }),

  getCurrent: privateProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.user.id },
    });
  }),
});
