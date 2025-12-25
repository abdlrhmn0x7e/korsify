"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { useState } from "react";

export function CreateTokenButton() {
  const [isPending, setIsPending] = useState(false);
  const createTokenMuatation = useMutation(api.admin.tokens.create);

  async function createToken() {
    setIsPending(true);
    await createTokenMuatation();
    setIsPending(false);
  }

  return (
    <Button onClick={createToken} disabled={isPending}>
      Create Token
      {isPending ? <Spinner /> : <IconPlus />}
    </Button>
  );
}
