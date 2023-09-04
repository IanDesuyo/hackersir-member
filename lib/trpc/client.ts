import { httpBatchLink, loggerLink, type TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import { type AppRouter } from "./root";
import { toast } from "@/components/ui/use-toast";

export const api = createTRPCReact<AppRouter>();

const errorHandlingLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable(observer => {
      const unsubscribe = next(op).subscribe({
        next: observer.next,
        complete: observer.complete,
        error: err => {
          toast({
            title: "發生錯誤",
            description: err.message,
            variant: "destructive",
          });
          observer.error(err);
        },
      });

      return unsubscribe;
    });
  };
};

export const client = api.createClient({
  transformer: superjson,
  links: [
    errorHandlingLink,
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
