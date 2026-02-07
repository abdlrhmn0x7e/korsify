"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { env } from "@/env";
import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function PaymobCheckout() {
  const router = useRouter();
  const checkoutAction = useAction(api.paymob.actions.checkout);

  const handleCheckout = async () => {
    try {
      const { clientSecret } = await checkoutAction();
      router.push(generatePaymobCheckoutUrl(clientSecret));
    } catch {
      toast.error("Failed to checkout");
    }
  };

  return (
    <div>
      <Button onClick={handleCheckout}>Checkout</Button>
    </div>
  );
}

function generatePaymobCheckoutUrl(clientSecret: string) {
  return `https://accept.paymob.com/unifiedcheckout/?publicKey=${env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`;
}
