"use client";

import type { ReactNode } from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconCreditCard,
  IconCrown,
  IconBook,
  IconVideo,
  IconCircleCheck,
  IconFileInvoice,
  IconCalendarMonth,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { useScopedI18n } from "@/locales/client";
import { useDialog } from "@/hooks/use-dialog";

import type { CardInfo } from "./payments-types";
import { format } from "date-fns";
import { formatCurrency } from "./payments-utils";
import { Spinner } from "@/components/ui/spinner";

type PaymentsT = ReturnType<typeof useScopedI18n<"dashboard.payments">>;
type DialogReturn = ReturnType<typeof useDialog>;

function SectionShell({
  title,
  description,
  children,
  right,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-background/80">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b px-5 py-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {right}
      </header>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

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
  const usageRatio =
    maxCourses && maxCourses > 0
      ? Math.min((courseCount / maxCourses) * 100, 100)
      : 0;

  return (
    <SectionShell
      title={t("plan.title")}
      description={t("plan.description")}
      right={
        <Badge variant={isPro ? "default" : "secondary"} size="lg">
          {isPro && <IconCrown className="size-3" />}
          {isPro ? t("plan.pro") : t("plan.free")}
        </Badge>
      }
    >
      <div className="space-y-3">
        <div className="rounded-lg border bg-muted/20 p-3">
          <div className="flex items-center gap-2">
            <IconBook className="size-4 text-primary" />
            <p className="text-sm font-medium">{t("plan.limits.maxCourses")}</p>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {maxCourses === null
              ? t("plan.usage.coursesUnlimited", {
                  count: String(courseCount),
                })
              : t("plan.usage.courses", {
                  count: String(courseCount),
                  max: String(maxCourses),
                })}
          </p>
          {maxCourses !== null && maxCourses !== undefined ? (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border/70">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${usageRatio}%` }}
              />
            </div>
          ) : null}
        </div>
        <div className="rounded-lg border bg-muted/20 p-3">
          <div className="flex items-center gap-2">
            <IconVideo className="size-4 text-primary" />
            <p className="text-sm font-medium">{t("plan.limits.muxHosting")}</p>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {limits?.canUseMuxHosting
              ? t("plan.limits.enabled")
              : t("plan.limits.disabled")}
          </p>
        </div>
      </div>
    </SectionShell>
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
      <SectionShell
        title={t("subscribe.title")}
        description={t("subscribe.description")}
        right={
          <Button onClick={termsDialog.trigger} size="sm">
            {t("subscribe.cta")}
          </Button>
        }
      >
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t("subscribe.highlight")}
          </p>
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
            {t("subscribe.storageNotice")}
          </div>
        </div>
      </SectionShell>
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
                "deletion",
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
                <Spinner />
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

interface BillingCourse {
  courseId: string;
  courseTitle: string;
  totalMinutes: number;
  amountCents: number;
}

export function SubscriptionBillingCard({
  subscription,
  card,
  breakdown,
  t,
}: {
  subscription: {
    status: "active" | "inactive";
    paymobSubscriptionId: number;
    lastRenewalDate: number;
    currentPeriodEnd: number;
  };
  card: CardInfo | null;
  breakdown:
    | {
        base: number;
        courses: Array<BillingCourse>;
        totalAmountCents: number;
      }
    | undefined;
  t: PaymentsT;
}) {
  const isActive = subscription.status === "active";
  const stateLabel = isActive
    ? t("subscription.active")
    : t("subscription.inactive");
  const hasExtras = breakdown?.courses.length ? breakdown.courses.length > 0 : false;

  return (
    <SectionShell
      title={t("subscription.title")}
      right={
        <Badge variant={isActive ? "success" : "warning"} size="sm">
          {stateLabel}
        </Badge>
      }
    >
      <div className="space-y-4">
        {!isActive ? (
          <div className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2.5 text-xs text-warning-foreground">
            {t("subscription.inactiveWarning")}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="mb-1 text-xs text-muted-foreground">
              {t("subscription.nextBilling")}
            </p>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <IconCalendarMonth className="size-4 text-muted-foreground" />
              <span>
                {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="mb-1 text-xs text-muted-foreground">
              {t("subscription.lastRenewal")}
            </p>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <IconCalendarMonth className="size-4 text-muted-foreground" />
              <span>
                {format(new Date(subscription.lastRenewalDate), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>

        <Separator />
        <div className="rounded-xl border border-primary/30 bg-linear-to-r from-primary/10 to-primary/5 p-3.5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/15 p-2 text-primary">
              <IconCreditCard className="size-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/90">
                {t("card.title")}
              </p>
              {card ? (
                <p className="text-sm font-medium">
                  {card.brand} {t("card.endingIn", { pan: card.pan })}
                </p>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">
                  {t("card.noCard")}
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <IconFileInvoice className="size-4 text-muted-foreground" />
            <p className="text-sm font-medium">{t("billing.title")}</p>
          </div>
          {breakdown ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("billing.base")}</span>
                <span className="font-medium">
                  {formatCurrency(breakdown.base, "EGP")}
                </span>
              </div>

              {hasExtras ? (
                <>
                  <Separator />
                  {breakdown.courses.map((course) => (
                    <div
                      key={course.courseId}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <IconVideo className="size-3.5 text-muted-foreground" />
                        <span className="max-w-[220px] truncate text-muted-foreground">
                          {course.courseTitle}
                        </span>
                        <span className="text-xs text-muted-foreground/60">
                          {t("billing.minutes", {
                            count: String(course.totalMinutes),
                          })}
                        </span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(course.amountCents, "EGP")}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">{t("billing.noExtras")}</p>
              )}

              <Separator />
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>{t("billing.total")}</span>
                <span>{formatCurrency(breakdown.totalAmountCents, "EGP")}</span>
              </div>
            </>
          ) : (
            <Skeleton className="h-16 rounded-lg" />
          )}
        </div>
      </div>
    </SectionShell>
  );
}

export function CancelCard({
  t,
  onCancel,
  cancelLoading,
}: {
  t: PaymentsT;
  onCancel: () => void;
  cancelLoading: boolean;
}) {
  return (
    <SectionShell title={t("cancel.title")} description={t("cancel.description")}>
      <div className="space-y-3">
        <div className="rounded-xl border-2 border-destructive/35 bg-destructive/10 p-3">
          <div className="flex items-start gap-2.5">
            <IconAlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-xs font-medium text-destructive/90">
              {t("cancel.warning")}
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="destructive-outline" size="sm" />}
          >
            {t("cancel.cta")}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("cancel.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("cancel.confirmDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel.back")}</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={cancelLoading}
                className="w-32"
                onClick={onCancel}
              >
                {cancelLoading ? <Spinner /> : t("cancel.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SectionShell>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <div className="rounded-xl border p-5">
            <Skeleton className="h-4 w-36" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
            <Skeleton className="mt-4 h-12 rounded-lg" />
            <Skeleton className="mt-4 h-24 rounded-lg" />
          </div>
          <div className="space-y-6">
            <div className="rounded-xl border p-5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-3 h-14 rounded-lg" />
              <Skeleton className="mt-2 h-14 rounded-lg" />
            </div>
            <div className="rounded-xl border p-5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-3 h-14 rounded-lg" />
              <Skeleton className="mt-3 h-9 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
