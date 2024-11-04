import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "node_modules/zod/lib";
import {
  ArticleCreateInputSchema,
  ArticleUpdateInputSchema,
} from "prisma/generated/zod";

const UpdateArticleInputSchema = z.object({
  article: ArticleUpdateInputSchema,
  articleId: z.string(),
});

export const articlesRouter = createTRPCRouter({
  create: privateProcedure
    .input(ArticleCreateInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.article.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });
    }),

  update: privateProcedure
    .input(UpdateArticleInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.article.update({
        where: { id: input.articleId },
        data: input.article,
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.article.findUnique({
        where: { id: input.id },
      });
    }),

  getAll: privateProcedure.query(async ({ ctx }) => {
    return ctx.db.article.findMany({
      where: {
        userId: ctx.user.id,
      },
    });
  }),
});
