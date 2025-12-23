import { api } from "@/convex/_generated/api";
import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { notFound } from "next/navigation";

export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthNextJs({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  convexSiteUrl: process.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
});

export async function requireAdmin() {
  "use server";

  const user = await fetchAuthQuery(api.auth.getCurrentUser);

  if (user?.role !== "admin") {
    return notFound();
  }
}
