import { getScopedI18n } from "@/locales/server";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { TopGrid } from "@/components/top-grid";
import { PaymentResult } from "./_components/payment-result";

interface PaymentRedirectSearchParams {
  success?: string;
  id?: string;
  amount_cents?: string;
  currency?: string;
  "source_data.pan"?: string;
  "source_data.type"?: string;
  "source_data.sub_type"?: string;
  "data.message"?: string;
  pending?: string;
}

export default async function PaymentRedirectPage({
  searchParams,
}: {
  searchParams: Promise<PaymentRedirectSearchParams>;
}) {
  const params = await searchParams;
  const t = await getScopedI18n("dashboard.payments.redirect");

  const isSuccess = params.success === "true" && params.pending !== "true";
  const isPending = params.pending === "true";

  const amountCents = parseInt(params.amount_cents ?? "0", 10);
  const amount = (amountCents / 100).toFixed(2);
  const currency = params.currency ?? "EGP";
  const pan = params["source_data.pan"] ?? "";
  const cardBrand = params["source_data.sub_type"] ?? "";
  const transactionId = params.id ?? "";

  return (
    <main className="relative min-h-screen">
      <Container className="flex min-h-screen flex-col items-center justify-between py-16 sm:py-24">
        <TopGrid />
        <Logo variant="primary" withText size="xl" />
        <PaymentResult
          isSuccess={isSuccess}
          isPending={isPending}
          amount={amount}
          currency={currency}
          pan={pan}
          cardBrand={cardBrand}
          transactionId={transactionId}
          translations={{
            successTitle: t("success.title"),
            successDescription: t("success.description"),
            successCta: t("success.cta"),
            failedTitle: t("failed.title"),
            failedDescription: t("failed.description"),
            failedCta: t("failed.cta"),
            card: t("card", { pan }),
            amount: t("amount", { amount, currency }),
            transactionId: t("transactionId", { id: transactionId }),
          }}
        />
        <div />
      </Container>
    </main>
  );
}
