"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconCheck, IconX } from "@tabler/icons-react";

interface PaymentResultProps {
  isSuccess: boolean;
  isPending: boolean;
  amount: string;
  currency: string;
  pan: string;
  cardBrand: string;
  transactionId: string;
  translations: {
    successTitle: string;
    successDescription: string;
    successCta: string;
    failedTitle: string;
    failedDescription: string;
    failedCta: string;
    card: string;
    amount: string;
    transactionId: string;
  };
}

export function PaymentResult({
  isSuccess,
  amount,
  currency,
  pan,
  cardBrand,
  transactionId,
  translations: t,
}: PaymentResultProps) {
  const title = isSuccess ? t.successTitle : t.failedTitle;
  const description = isSuccess ? t.successDescription : t.failedDescription;
  const cta = isSuccess ? t.successCta : t.failedCta;
  const href = isSuccess ? "/dashboard" : "/dashboard/payments";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full max-w-sm flex-col items-center gap-8 text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.15,
        }}
      >
        <div
          className={`relative flex size-20 items-center justify-center rounded-full ${
            isSuccess
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          {/* Pulse ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.4,
              ease: "easeOut",
            }}
            className={`absolute inset-0 rounded-full ${
              isSuccess ? "bg-emerald-500/20" : "bg-red-500/20"
            }`}
          />
          {isSuccess ? (
            <IconCheck className="size-10" stroke={2} />
          ) : (
            <IconX className="size-10" stroke={2} />
          )}
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="space-y-2"
      >
        <h4 className="!pb-0">{title}</h4>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </motion.div>

      {/* Transaction details */}
      {(pan || (amount && amount !== "0.00")) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="flex w-full flex-col gap-3 rounded-xl border bg-card/50 p-4 text-sm"
        >
          {amount && amount !== "0.00" && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {currency === "EGP" ? "Amount" : "Amount"}
              </span>
              <span className="font-medium tabular-nums">
                {amount} {currency}
              </span>
            </div>
          )}
          {pan && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {cardBrand || "Card"}
              </span>
              <span className="font-medium tabular-nums">
                •••• {pan}
              </span>
            </div>
          )}
          {transactionId && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">ID</span>
              <span className="font-mono text-xs text-muted-foreground">
                #{transactionId}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="w-full"
      >
        <Button
          size="lg"
          variant={isSuccess ? "default" : "outline"}
          className="w-full"
          render={<Link href={href} />}
        >
          {cta}
        </Button>
      </motion.div>
    </motion.div>
  );
}
