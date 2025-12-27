"use client";

import { Google } from "@/components/brands/google";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useScopedI18n } from "@/locales/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

export function LoginButton() {
  const t = useScopedI18n("auth.login");

  const loginFn = useCallback(async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  }, []);

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
