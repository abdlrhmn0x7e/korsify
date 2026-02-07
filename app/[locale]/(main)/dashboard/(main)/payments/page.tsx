import { PageHeader } from "@/components/dashboard/page-header";
import { IconBook } from "@tabler/icons-react";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { PageLayout } from "@/components/dashboard/page-layout";
import { getScopedI18n, getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { PaymobCheckout } from "./_components/paymob-checkout";

export function generateStaticParams() {
  return getStaticParams();
}

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getScopedI18n("dashboard.courses");
  const [teacher] = await Promise.all([
    fetchAuthQuery(api.teachers.queries.getTeacher),
  ]);
  if (!teacher) return redirect("/dashboard/onboarding");

  return (
    <PageLayout>
      <PageHeader title={t("title")} Icon={IconBook}></PageHeader>

      <PaymobCheckout />
    </PageLayout>
  );
}
