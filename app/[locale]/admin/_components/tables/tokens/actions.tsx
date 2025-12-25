"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { IconChecks, IconCopy, IconTrash } from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

export function TokensTableActions({
  id,
  token,
}: {
  id: Id<"tokens">;
  token: string;
}) {
  const [didCopy, setDidCopy] = useState(false);
  function copySignupUrl() {
    if (didCopy) return;
    const url = `${window.location.origin}/signup?token=${token}`;
    const duration = 1500;

    navigator.clipboard.writeText(url);

    toast("Copied to clipboard.", {
      duration,
    });
    setDidCopy(true);

    setTimeout(() => {
      setDidCopy(false);
    }, duration);
  }

  const [isPending, setIsPending] = useState(false);
  const removeTokenMutation = useMutation(api.admin.tokens.remove);
  async function removeToken() {
    setIsPending(true);
    await removeTokenMutation({
      tokenId: id,
    });
    setIsPending(false);
  }

  return (
    <div className="space-x-2">
      <Button onClick={copySignupUrl}>
        {didCopy ? <IconChecks /> : <IconCopy />}
      </Button>
      <Button
        variant="outline"
        className="hover:text-destructive"
        disabled={isPending}
        onClick={removeToken}
      >
        {isPending ? <Spinner /> : <IconTrash />}
      </Button>
    </div>
  );
}
