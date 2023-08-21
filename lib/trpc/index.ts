import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError, type inferAsyncReturnType } from "@trpc/server";
import superjson from "superjson";
import { prisma } from "@/lib/db";
import { Session } from "next-auth";
import { hasPermissions, Permission } from "../auth";

interface CreateContextOptions extends FetchCreateContextFnOptions {
  session: Session | null;
}

export const createContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const authenticatedProcedure = t.procedure.use(enforceUserIsAuthed);

const enforceUserhasAdminRead = t.middleware(({ ctx, next }) => {
  if (!hasPermissions(ctx.session, [Permission.AdminRead])) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({ ctx });
});
export const adminReadProcedure = t.procedure.use(enforceUserIsAuthed).use(enforceUserhasAdminRead);

const enforceUserHasAdminWrite = t.middleware(({ ctx, next }) => {
  if (hasPermissions(ctx.session, [Permission.AdminWrite])) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({ ctx });
});
export const adminWriteProcedure = t.procedure.use(enforceUserIsAuthed).use(enforceUserHasAdminWrite);

export const convertMeToUserId = t.middleware(async ({ ctx, input, next }) => {
  const userId = (input as { userId?: string }).userId;

  if (!userId) {
    return next({ ctx });
  }

  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (userId !== "me" && userId !== ctx.session.user.id) {
    if (!hasPermissions(ctx.session, [Permission.AdminRead])) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
  }

  // replace "me" with the user's id
  if (userId === "me") {
    (input as { userId?: string }).userId = ctx.session?.user?.id;
  }

  return next({ ctx });
});
