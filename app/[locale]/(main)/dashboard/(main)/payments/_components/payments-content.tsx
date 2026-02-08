"use client";

import { useAction } from "convex/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { usePlanLimits } from "@/hooks/use-plan-limits";
import { useDialog } from "@/hooks/use-dialog";
import { useScopedI18n } from "@/locales/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconAlertTriangle } from "@tabler/icons-react";

import { generatePaymobCheckoutUrl } from "./payments-utils";
import {
  PlanCard,
  SubscribeCard,
  SubscriptionCard,
  TransactionsCard,
  CancelCard,
  LoadingSkeleton,
} from "./payments-cards";

export function PaymentsContent() {
  const t = useScopedI18n("dashboard.payments");
  const router = useRouter();
  const { isLoaded, plan, limits, usage } = usePlanLimits();

  const checkoutAction = useAction(api.paymob.actions.checkout);
  const cancelAction = useAction(api.paymob.actions.cancelSubscription);
  const getDetailsAction = useAction(
    api.teachers.subscriptions.actions.getDetails
  );

  const termsDialog = useDialog();

  const {
    data: details,
    isPending: detailsLoading,
    isError: detailsError,
    refetch: refetchDetails,
  } = useQuery({
    queryKey: ["subscription-details"],
    queryFn: () => getDetailsAction(),
  });

  const checkoutMutation = useMutation({
    mutationFn: checkoutAction,
    onSuccess: ({ clientSecret }) => {
      router.push(generatePaymobCheckoutUrl(clientSecret));
    },
    onError: () => {
      toast.error("Failed to checkout");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelAction,
    onSuccess: () => {
      refetchDetails();
      router.push("/");
      toast.success(t("cancel.success"));
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel subscription"
      );
    },
  });

  const isSubscribed = details?.hasSubscription === true;

  if (!isLoaded || detailsLoading) {
    return <LoadingSkeleton />;
  }

  if (detailsError) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="bg-destructive/10 rounded-full p-3">
              <IconAlertTriangle className="size-6 text-destructive" />
            </div>
            <p className="text-sm text-muted-foreground">{t("error")}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchDetails()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
        <PlanCard plan={plan} limits={limits} usage={usage} t={t} />

        {isSubscribed && details.hasSubscription ? (
          <>
            <SubscriptionCard
              subscription={details.subscription}
              card={details.card}
              t={t}
            />
            <TransactionsCard transactions={details.transactions} t={t} />
            <CancelCard
              t={t}
              onCancel={() => cancelMutation.mutate({})}
              cancelLoading={cancelMutation.isPending}
            />
          </>
        ) : (
          <SubscribeCard
            t={t}
            termsDialog={termsDialog}
            checkoutLoading={checkoutMutation.isPending}
            onCheckout={() => checkoutMutation.mutate({})}
          />
        )}
      </div>
    </div>
  );
}
