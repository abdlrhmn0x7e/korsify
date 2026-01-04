import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const studentAuthClient = createAuthClient({
  basePath: "/api/student-auth",
  plugins: [convexClient()],
});

export interface SignInWithGoogleOptions {
  teacherId: string;
  callbackURL?: string;
  originSubdomain?: string;
}

export async function signInWithGoogle({
  teacherId,
  callbackURL = "/",
  originSubdomain,
}: SignInWithGoogleOptions) {
  return studentAuthClient.signIn.social({
    provider: "google",
    callbackURL,
    fetchOptions: {
      onSuccess: () => {
        window.location.href = callbackURL;
      },
    },
    additionalData: {
      teacherId,
      originSubdomain,
    },
  });
}

export async function signOut(redirectTo?: string) {
  return studentAuthClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        if (redirectTo) {
          window.location.href = redirectTo;
        }
      },
    },
  });
}

export function useStudentSession() {
  return studentAuthClient.useSession();
}
