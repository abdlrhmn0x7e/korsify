import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { oAuthProxy } from "better-auth/plugins";
import { APIError, getOAuthState } from "better-auth/api";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import studentAuthConfig from "./studentAuth.config";
import studentAuthSchema from "./components/studentAuth/schema";

interface StudentOAuthState {
  teacherId?: string;
  originSubdomain?: string;
}

const siteUrl = process.env.SITE_URL!;
const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

export const studentAuthComponent = createClient<
  DataModel,
  typeof studentAuthSchema
>(components.studentAuth, {
  local: {
    schema: studentAuthSchema,
  },
});

export const createStudentAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    baseURL: siteUrl,
    basePath: "/api/student-auth",
    database: studentAuthComponent.adapter(ctx),
    emailAndPassword: {
      enabled: false,
    },
    socialProviders: {
      google: {
        clientId,
        clientSecret,
        redirectURI: `${siteUrl}/api/student-auth/callback/google`,
      },
    },
    user: {
      additionalFields: {
        teacherId: {
          type: "string",
          required: true,
          input: true,
        },
      },
    },
    session: {
      additionalFields: {
        teacherId: {
          type: "string",
          required: true,
        },
      },
    },
    account: {
      additionalFields: {
        teacherId: {
          type: "string",
          required: true,
        },
      },
    },
    advanced: {
      disableCSRFCheck: true,
      cookies: {
        session_token: {
          name: "student_session",
          attributes: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            path: "/",
          },
        },
      },
      defaultCookieAttributes: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      },
      cookiePrefix: "student",
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user, hookCtx) => {
            if (!hookCtx) return { data: user };

            const oauthState = (await getOAuthState()) as StudentOAuthState | null;
            const teacherIdFromState = oauthState?.teacherId;
            const teacherIdFromUser = (user as { teacherId?: string }).teacherId;
            const teacherId = teacherIdFromState || teacherIdFromUser;

            if (!teacherId) {
              throw new APIError("BAD_REQUEST", {
                message: "Teacher ID is required for student registration",
              });
            }

            const email = user.email;

            const existingUserForTenant =
              await hookCtx.context.adapter.findOne({
                model: "user",
                where: [
                  { field: "email", value: email },
                  { field: "teacherId", value: teacherId },
                ],
              });

            if (existingUserForTenant) {
              throw new APIError("BAD_REQUEST", {
                message:
                  "An account with this email already exists for this storefront",
              });
            }

            return {
              data: {
                ...user,
                teacherId,
              },
            };
          },
        },
      },

      account: {
        create: {
          before: async (account, hookCtx) => {
            if (!hookCtx) return { data: account };

            const oauthState = (await getOAuthState()) as StudentOAuthState | null;
            const teacherIdFromState = oauthState?.teacherId;
            const teacherIdFromAccount = (account as { teacherId?: string })
              .teacherId;
            const teacherId = teacherIdFromState || teacherIdFromAccount;

            if (!teacherId) {
              throw new APIError("BAD_REQUEST", {
                message: "Teacher ID is required for account creation",
              });
            }

            const existingAccountForTenant =
              await hookCtx.context.adapter.findOne({
                model: "account",
                where: [
                  { field: "teacherId", value: teacherId },
                  { field: "providerId", value: account.providerId },
                  { field: "accountId", value: account.accountId },
                ],
              });

            if (existingAccountForTenant) {
              throw new APIError("BAD_REQUEST", {
                message:
                  "This account is already linked to a user in this storefront",
              });
            }

            return {
              data: {
                ...account,
                teacherId,
              },
            };
          },
        },
      },

      session: {
        create: {
          before: async (session, hookCtx) => {
            if (!hookCtx) return { data: session };

            const oauthState = (await getOAuthState()) as StudentOAuthState | null;
            const teacherIdFromState = oauthState?.teacherId;
            const teacherIdFromSession = (session as { teacherId?: string })
              .teacherId;
            const teacherId = teacherIdFromState || teacherIdFromSession;

            if (!teacherId) {
              throw new APIError("BAD_REQUEST", {
                message: "Teacher ID is required for session creation",
              });
            }

            return {
              data: {
                ...session,
                teacherId,
              },
            };
          },
        },
      },
    },
    plugins: [
      oAuthProxy({
        productionURL: siteUrl,
      }),
      convex({
        authConfig: studentAuthConfig,
        options: {
          basePath: "/api/student-auth",
        },
      }),
    ],
  } satisfies BetterAuthOptions;
};

export const createStudentAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createStudentAuthOptions(ctx));
};

export const getCurrentStudent = query({
  args: {},
  handler: async (ctx) => {
    return studentAuthComponent.safeGetAuthUser(ctx);
  },
});
