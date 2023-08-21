import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import { type AppRouter } from "./root";

export const api = createTRPCReact<AppRouter>();

export const client = api.createClient({
  transformer: superjson,
  links: [
    loggerLink({
      enabled: opts =>
        process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});

export const TRPCProvider = api.Provider;
