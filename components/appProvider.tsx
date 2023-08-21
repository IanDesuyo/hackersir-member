"use client";

import { useState } from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import { Provider as JotaiProvider } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TRPCProvider, client } from "@/lib/trpc/client";

type AppProviderProps = {
  session: Session | null;
  children: React.ReactNode;
};

const AppProvider: React.FC<AppProviderProps> = ({ session, children }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => client);

  return (
    <JotaiProvider>
      <NextAuthSessionProvider session={session}>
        <TRPCProvider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </TRPCProvider>
      </NextAuthSessionProvider>
    </JotaiProvider>
  );
};

export default AppProvider;
