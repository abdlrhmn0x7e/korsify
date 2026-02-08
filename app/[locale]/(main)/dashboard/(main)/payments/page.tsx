import { PageHeader } from "@/components/dashboard/page-header";
import { IconCreditCard } from "@tabler/icons-react";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { PageLayout } from "@/components/dashboard/page-layout";
import { getScopedI18n, getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { PaymentsContent } from "./_components/payments-content";

export function generateStaticParams() {
  return getStaticParams();
}

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getScopedI18n("dashboard.payments");
  const teacher = await fetchAuthQuery(api.teachers.queries.getTeacher);
  if (!teacher) return redirect("/dashboard/onboarding");

  return (
    <PageLayout>
      <PageHeader title={t("title")} Icon={IconCreditCard} />
      <PaymentsContent />
    </PageLayout>
  );
}
