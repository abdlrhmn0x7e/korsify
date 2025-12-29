import { getScopedI18n, getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { PageHeader } from "@/components/page-header";
import { IconLayoutDashboard } from "@tabler/icons-react";

export function generateStaticParams() {
  return getStaticParams();
}

export default async function DashboardPage({
  params,
}: PageProps<"/[locale]/dashboard">) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getScopedI18n("dashboard.home");

  return (
    <div className="space-y-4">
      <PageHeader title={t("title")} Icon={IconLayoutDashboard} />

      <div className="px-2 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title={t("stats.courses")} value="0" />
        <DashboardCard title={t("stats.students")} value="0" />
        <DashboardCard title={t("stats.revenue")} value="EGP 0" />
        <DashboardCard title={t("stats.pendingPayments")} value="0" />
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
