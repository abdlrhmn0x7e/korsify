import { env } from "@/env";

export function generatePaymobCheckoutUrl(clientSecret: string) {
  return `https://accept.paymob.com/unifiedcheckout/?publicKey=${env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`;
}

export function formatCurrency(amountCents: number, currency: string) {
  return `${(amountCents / 100).toFixed(0)} ${currency}`;
}
