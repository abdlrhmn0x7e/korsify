"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export function CreateAccessTokenButton({
  variant = "ghost",
}: {
  variant?: "ghost" | "default";
}) {
  const { mutate: createAccessToken, isPending } = useMutation({
    mutationFn: useConvexMutation(api.earlyAccess.admin.accessTokens.create),
  });

  return (
    <Button
      onClick={() => createAccessToken({})}
      disabled={isPending}
      variant={variant}
    >
      Create Access Token
      {isPending ? <Spinner /> : <IconPlus />}
    </Button>
  );
}
