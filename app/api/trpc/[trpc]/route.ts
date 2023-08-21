import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "@/lib/trpc";
import { appRouter } from "@/lib/trpc/root";
import { getServerSession } from "@/lib/auth";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async opts => createContext({ ...opts, session: await getServerSession() }),
  });

export { handler as GET, handler as POST };
