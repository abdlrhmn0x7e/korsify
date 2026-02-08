"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconCreditCard,
  IconCheck,
  IconAlertTriangle,
  IconCrown,
  IconBook,
  IconVideo,
  IconCircleCheck,
  IconLoader2,
  IconReceipt,
  IconBan,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";
import { useDialog } from "@/hooks/use-dialog";

import type { CardInfo, MappedTransaction } from "./payments-types";
import { format } from "date-fns";
import { formatCurrency, getTransactionStatus } from "./payments-utils";

type PaymentsT = ReturnType<typeof useScopedI18n<"dashboard.payments">>;
type DialogReturn = ReturnType<typeof useDialog>;

export function PlanCard({
  plan,
  limits,
  usage,
  t,
}: {
  plan: string;
  limits: { maxCourses: number | null; canUseMuxHosting: boolean } | undefined;
  usage: { courseCount: number } | undefined;
  t: PaymentsT;
}) {
  const isPro = plan === "pro";
  const maxCourses = limits?.maxCourses;
  const courseCount = usage?.courseCount ?? 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{t("plan.currentPlan")}</CardTitle>
          <Badge variant={isPro ? "default" : "outline"} size="lg">
            {isPro && <IconCrown className="size-3" />}
            {isPro ? t("plan.pro") : t("plan.free")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <div className="bg-primary/10 text-primary rounded-md p-2">
              <IconBook className="size-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                {t("plan.limits.maxCourses")}
              </p>
              <p className="text-xs text-muted-foreground">
                {maxCourses === null
                  ? t("plan.usage.coursesUnlimited", {
                      count: String(courseCount),
                    })
                  : t("plan.usage.courses", {
                      count: String(courseCount),
                      max: String(maxCourses),
                    })}
              </p>
              {maxCourses != null && (
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${Math.min((courseCount / maxCourses) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <div className="bg-primary/10 text-primary rounded-md p-2">
              <IconVideo className="size-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                {t("plan.limits.muxHosting")}
              </p>
              <p className="text-xs text-muted-foreground">
                {limits?.canUseMuxHosting
                  ? t("plan.limits.enabled")
                  : t("plan.limits.disabled")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SubscribeCard({
  t,
  termsDialog,
  checkoutLoading,
  onCheckout,
}: {
  t: PaymentsT;
  termsDialog: DialogReturn;
  checkoutLoading: boolean;
  onCheckout: () => void;
}) {
  return (
    <>
      <Card className="border-primary/30 bg-primary/2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconCrown className="size-5 text-primary" />
            <CardTitle>{t("subscribe.title")}</CardTitle>
          </div>
          <CardDescription>{t("subscribe.description")}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={termsDialog.trigger}>{t("subscribe.cta")}</Button>
        </CardFooter>
      </Card>
      <Dialog {...termsDialog.props}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("subscribe.termsDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("subscribe.termsDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {(
              [
                "billing",
                "renewal",
                "cancellation",
                "refund",
                "downgrade",
              ] as const
            ).map((key) => (
              <div key={key} className="flex gap-2.5 text-sm">
                <IconCircleCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  {t(`subscribe.termsDialog.terms.${key}`)}
                </span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              onClick={onCheckout}
              disabled={checkoutLoading}
              className="w-32"
            >
              {checkoutLoading ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                t("subscribe.termsDialog.accept")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SubscriptionCard({
  subscription,
  card,
  t,
}: {
  subscription: {
    status: "active" | "inactive";
    paymobSubscriptionId: number;
    lastRenewalDate: number;
    currentPeriodEnd: number;
  };
  card: CardInfo | null;
  t: PaymentsT;
}) {
  const isActive = subscription.status === "active";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{t("subscription.title")}</CardTitle>
          <Badge variant={isActive ? "success" : "error"}>
            {isActive ? t("subscription.active") : t("subscription.inactive")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isActive && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <IconAlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive/90">
              {t("subscription.inactiveWarning")}
            </p>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">
              {t("subscription.nextBilling")}
            </p>
            <p className="text-sm font-medium">
              {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
            </p>
          </div>
          <div className="space-y-1 rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">
              {t("subscription.lastRenewal")}
            </p>
            <p className="text-sm font-medium">
              {format(new Date(subscription.lastRenewalDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-md p-2">
              <IconCreditCard className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{t("card.title")}</p>
              {card ? (
                <p className="text-xs text-muted-foreground">
                  {card.brand} {t("card.endingIn", { pan: card.pan })}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {t("card.noCard")}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm font-semibold">{t("subscription.amount")}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function TransactionsCard({
  transactions,
  t,
}: {
  transactions: Array<MappedTransaction>;
  t: PaymentsT;
}) {
  const statusConfig = {
    success: { badge: "success" as const, icon: IconCheck },
    pending: { badge: "warning" as const, icon: IconLoader2 },
    failed: { badge: "error" as const, icon: IconAlertTriangle },
    refunded: { badge: "info" as const, icon: IconReceipt },
    voided: { badge: "secondary" as const, icon: IconBan },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("transactions.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("transactions.empty")}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("transactions.headers.date")}</TableHead>
                <TableHead>{t("transactions.headers.amount")}</TableHead>
                <TableHead>{t("transactions.headers.status")}</TableHead>
                <TableHead>{t("transactions.headers.card")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => {
                const status = getTransactionStatus(tx);
                const config = statusConfig[status];
                return (
                  <TableRow key={tx.id}>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(tx.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(tx.amountCents, tx.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.badge}>
                        {t(`transactions.status.${status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tx.cardBrand && tx.cardPan
                        ? `${tx.cardBrand} •••• ${tx.cardPan.slice(-4)}`
                        : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export function CancelCard({ t }: { t: PaymentsT }) {
  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="text-destructive">{t("cancel.title")}</CardTitle>
        <CardDescription>{t("cancel.description")}</CardDescription>
      </CardHeader>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="destructive-outline" size="sm" />}
          >
            {t("cancel.cta")}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10">
                <IconAlertTriangle className="text-destructive" />
              </AlertDialogMedia>
              <AlertDialogTitle>{t("cancel.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("cancel.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel.back")}</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => {
                  toast.info("Cancellation is not available yet.");
                }}
              >
                {t("cancel.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-12" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
