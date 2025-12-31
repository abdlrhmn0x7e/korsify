import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CONVEX_DEPLOYMENT: z.string(),
    BETTER_AUTH_SECRET: z.string(),

    // Mux
    MUX_TOKEN_ID: z.string(),
    MUX_TOKEN_SECRET: z.string(),
    MUX_SIGNING_KEY_ID: z.string(),
    MUX_SIGNING_KEY_PRIVATE: z.string(),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.url(),
    NEXT_PUBLIC_CONVEX_SITE_URL: z.url(),
    NEXT_PUBLIC_SITE_URL: z.url(),
    NEXT_PUBLIC_APP_DOMAIN: z.string().optional(),
  },
  runtimeEnv: {
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

    // Mux
    MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
    MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
    MUX_SIGNING_KEY_ID: process.env.MUX_SIGNING_KEY_ID,
    MUX_SIGNING_KEY_PRIVATE: process.env.MUX_SIGNING_KEY_PRIVATE,

    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
  },
});
