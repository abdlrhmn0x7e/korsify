import { env } from "@/env";
import type { MappedTransaction } from "./payments-types";

export function generatePaymobCheckoutUrl(clientSecret: string) {
  return `https://accept.paymob.com/unifiedcheckout/?publicKey=${env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`;
}

export function formatCurrency(amountCents: number, currency: string) {
  return `${(amountCents / 100).toFixed(0)} ${currency}`;
}

export function getTransactionStatus(tx: MappedTransaction) {
  if (tx.isVoided) return "voided" as const;
  if (tx.isRefunded) return "refunded" as const;
  if (tx.pending) return "pending" as const;
  if (tx.success) return "success" as const;
  return "failed" as const;
}
