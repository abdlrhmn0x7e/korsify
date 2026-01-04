"use client";

import { Google } from "@/components/brands/google";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signInWithGoogle } from "@/lib/student-auth-client";
import { useScopedI18n } from "@/locales/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

interface StudentLoginButtonProps {
  teacherId: string;
}

export function StudentLoginButton({ teacherId }: StudentLoginButtonProps) {
  const t = useScopedI18n("auth.login");

  const loginFn = useCallback(async () => {
    await signInWithGoogle({
      teacherId,
      callbackURL: "/",
    });
  }, [teacherId]);

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
