import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";
import studentAuthSchema from "./components/studentAuth/schema";

const siteUrl = process.env.SITE_URL!;
const siteTrustedOrigin = process.env.SITE_TRUSTED_ORIGIN!;

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

    trustedOrigins: [siteTrustedOrigin],

    advanced: {
      cookiePrefix: "student-auth",
    },

    emailAndPassword: {
      enabled: true,
    },

    user: {
      additionalFields: {
        teacherId: {
          type: "string",
          required: true,
          input: true,
        },
        phoneNumber: {
          type: "string",
          required: true,
          input: true,
        },
      },
    },

    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== "/sign-in/email") {
          return;
        }

        const email = ctx.body?.email as string | undefined;
        const expectedTeacherId = ctx.body?.teacherId as string | undefined;

        if (!email) {
          throw new APIError("BAD_REQUEST", {
            message: "Email is required",
          });
        }

        if (!expectedTeacherId) {
          throw new APIError("BAD_REQUEST", {
            message: "Teacher ID is required",
          });
        }

        const user = await ctx.context.adapter.findOne<{
          teacherId: string;
          email: string;
        }>({
          model: "user",
          where: [{ field: "email", value: email }],
        });

        if (!user) {
          throw new APIError("UNAUTHORIZED", {
            message: "Invalid credentials",
          });
        }

        // SECURITY: Prevent cross-tenant sign-in by validating the user's teacherId
        // matches the expected tenant context from the request
        if (user.teacherId !== expectedTeacherId) {
          throw new APIError("UNAUTHORIZED", {
            message: "Invalid credentials",
          });
        }
      }),
    },

    databaseHooks: {
      user: {
        create: {
          before: async (user, hookCtx) => {
            if (!hookCtx) return;

            if (hookCtx.path !== "/sign-up/email") return;

            const teacherId = (user as { teacherId?: string }).teacherId;

            if (!teacherId) {
              throw new APIError("BAD_REQUEST", {
                message: "Teacher ID is required for student registration",
              });
            }

            const email = user.email;

            // Check if user already exists for this teacher
            const existingUserForTenant = await hookCtx.context.adapter.findOne(
              {
                model: "user",
                where: [
                  { field: "email", value: email },
                  { field: "teacherId", value: teacherId },
                ],
              }
            );

            if (existingUserForTenant) {
              throw new APIError("BAD_REQUEST", {
                message:
                  "An account with this phone number already exists for this storefront",
              });
            }
          },
        },
      },
    },

    plugins: [
      convex({
        authConfig,
        jwks: process.env.JWKS,
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
