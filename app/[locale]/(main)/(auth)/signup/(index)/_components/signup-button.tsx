"use client";

import { Google } from "@/components/brands/google";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useScopedI18n } from "@/locales/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

export function SignupButton({ token }: { token: string }) {
  const t = useScopedI18n("auth.signup");

  const signupFn = useCallback(async () => {
    await authClient.signIn.social({
      provider: "google",
      requestSignUp: true,
      callbackURL: `/signup/redirect?token=${token}`,
      additionalData: {
        token,
      },
    });
  }, [token]);

  const { mutate: signup, isPending } = useMutation({
    mutationFn: signupFn,
  });

  return (
    <Button
      size="xl"
      className="w-full"
      variant="outline"
      onClick={() => signup()}
      disabled={isPending}
    >
      {isPending ? <Spinner /> : <Google />}
      {t("withGoogle")}
    </Button>
  );
}
