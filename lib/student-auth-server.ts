import { api } from "@/convex/_generated/api";
import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { fetchQuery } from "convex/nextjs";
import { headers } from "next/headers";

const STOREFRONT_HEADER = "x-storefront-subdomain";
const CUSTOM_DOMAIN_HEADER = "x-custom-domain";

type Teacher = Awaited<
  ReturnType<typeof fetchQuery<typeof api.teachers.queries.getBySubdomain>>
>;

export const {
  handler: studentAuthHandler,
  preloadAuthQuery: preloadStudentAuthQuery,
  isAuthenticated: isStudentAuthenticated,
  getToken: getStudentToken,
  fetchAuthQuery: fetchStudentAuthQuery,
  fetchAuthMutation: fetchStudentAuthMutation,
  fetchAuthAction: fetchStudentAuthAction,
} = convexBetterAuthNextJs({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  convexSiteUrl: process.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
  cookiePrefix: "student-auth",
});

export async function getTeacherFromHeaders(): Promise<Teacher | null> {
  "use server";
  const headersList = await headers();

  const subdomain = headersList.get(STOREFRONT_HEADER);
  if (subdomain) {
    return fetchQuery(api.teachers.queries.getBySubdomain, { subdomain });
  }

  const customDomain = headersList.get(CUSTOM_DOMAIN_HEADER);
  if (customDomain) {
    return fetchQuery(api.teachers.queries.getByCustomDomain, {
      customDomain,
    });
  }

  return null;
}

export async function getCurrentStudent() {
  "use server";

  return await fetchStudentAuthQuery(api.studentAuth.getCurrentStudent);
}
