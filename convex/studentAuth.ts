import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { phoneNumber } from "better-auth/plugins";
import { APIError } from "better-auth/api";
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
      },
    },

    session: {
      additionalFields: {
        teacherId: {
          type: "string",
          required: true,
          input: true,
        },
      },
    },

    databaseHooks: {
      user: {
        create: {
          before: async (user, hookCtx) => {
            if (!hookCtx) return;

            console.log(
              "[StudentAuth] user.create.before - path:",
              hookCtx.path
            );

            if (hookCtx.path !== "/sign-up/email") return;

            console.log("[StudentAuth] user.create.before - user:", user);

            const teacherId = (user as { teacherId?: string }).teacherId;

            if (!teacherId) {
              throw new APIError("BAD_REQUEST", {
                message: "Teacher ID is required for student registration",
              });
            }

            const email = user.email;

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
                  "An account with this email already exists for this storefront",
              });
            }
          },
        },
      },

      session: {
        create: {
          before: async (session, hookCtx) => {
            if (!hookCtx) return;
            if (
              hookCtx.path !== "/sign-in/email" &&
              hookCtx.path !== "/sign-up/email"
            )
              return;

            const teacherId = (
              hookCtx.context.session?.user as { teacherId?: string }
            ).teacherId;
            console.log(
              "[StudentAuth] session.create.before - teacherId:",
              teacherId
            );

            if (!teacherId) {
              throw new APIError("BAD_REQUEST", {
                message: "Teacher ID is required for student session creation",
              });
            }

            const existingUserForTenant = await hookCtx.context.adapter.findOne(
              {
                model: "user",
                where: [{ field: "teacherId", value: teacherId }],
              }
            );

            if (!existingUserForTenant) {
              throw new APIError("BAD_REQUEST", {
                message: "User not found for this storefront",
              });
            }

            console.log(
              "[StudentAuth] session.create.after - session:",
              session
            );
          },
        },
      },
    },
    plugins: [
      phoneNumber({
        sendOTP: ({ phoneNumber: phone, code }, _ctx) => {
          console.log(
            `[StudentAuth] Sending OTP ${code} to phone number ${phone}`
          );
        },
        signUpOnVerification: {
          getTempEmail: (phone) =>
            `${phone.replace(/\+/g, "")}@student.korsify.com`,
          getTempName: (phone) => phone,
        },
      }),
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
