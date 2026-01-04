import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "@/convex/components/studentAuth/auth";

export const studentAuthClient = createAuthClient({
  basePath: "/api/student-auth",
  plugins: [inferAdditionalFields<typeof auth>(), convexClient()],
});
