import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from ".";
import { getServerSession } from "../auth";
import { memberRouter } from "./routers/member";
import { eventRouter } from "./routers/event";
import { joinRouter } from "./routers/join";
import { cache } from "react";
import { prisma } from "@/lib/db";

export const appRouter = createTRPCRouter({
  member: memberRouter,
  event: eventRouter,
  join: joinRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const getApi = cache(async () => {
  const session = await getServerSession();
  return appRouter.createCaller({
    session,
    prisma,
  });
});
