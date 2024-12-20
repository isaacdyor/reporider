import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

import { wordwareRouter } from "./routers/wordware";
import { articlesRouter } from "./routers/articles";
import { usersRouter } from "./routers/users";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  wordware: wordwareRouter,
  articles: articlesRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
