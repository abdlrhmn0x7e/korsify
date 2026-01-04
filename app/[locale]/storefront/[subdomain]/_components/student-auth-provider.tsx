"use client";

import { cache, type PropsWithChildren } from "react";
import { ConvexReactClient } from "convex/react";
import { studentAuthClient } from "@/lib/student-auth-client";
import {
  ConvexBetterAuthProvider,
  type AuthClient,
} from "@convex-dev/better-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexQueryClient } from "@convex-dev/react-query";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const convexQueryClient = new ConvexQueryClient(convex);

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });
}

export const getStudentQueryClient = cache(makeQueryClient);
convexQueryClient.connect(getStudentQueryClient());

export function StudentAuthProvider({
  children,
  initialToken,
}: PropsWithChildren<{ initialToken?: string | null }>) {
  return (
    <ConvexBetterAuthProvider
      client={convex}
      authClient={studentAuthClient as unknown as AuthClient}
      initialToken={initialToken}
    >
      <QueryClientProvider client={getStudentQueryClient()}>
        {children}
      </QueryClientProvider>
    </ConvexBetterAuthProvider>
  );
}
