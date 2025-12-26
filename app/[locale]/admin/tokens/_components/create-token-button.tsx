"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export function CreateTokenButton() {
  const { mutate: createToken, isPending } = useMutation({
    mutationFn: useConvexMutation(api.admin.tokens.create),
  });

  return (
    <Button onClick={() => createToken({})} disabled={isPending}>
      Create Token
      {isPending ? <Spinner /> : <IconPlus />}
    </Button>
  );
}
