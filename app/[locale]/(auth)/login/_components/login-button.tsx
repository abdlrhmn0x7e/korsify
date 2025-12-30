"use client";

import { Google } from "@/components/brands/google";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useScopedI18n } from "@/locales/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useReadLocalStorage } from "usehooks-ts";

export function LoginButton() {
  const t = useScopedI18n("auth.login");
  const onboarded = useReadLocalStorage<boolean>("korsify-welcome-seen");

  const loginFn = useCallback(async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: onboarded ? "/dashboard" : "/dashboard/onboarding",
    });
  }, [onboarded]);

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginFn,
  });

  return (
    <Button
      size="xl"
      className="w-full"
      variant="outline"
      onClick={() => login()}
      disabled={isPending}
    >
      {isPending ? <Spinner /> : <Google />}
      {t("withGoogle")}
    </Button>
  );
}
