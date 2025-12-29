import { getStaticParams, getScopedI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import {
  IconBook,
  IconCreditCard,
  IconLayoutDashboardFilled,
  IconSettings,
  IconBuildingStore,
  IconUsers,
} from "@tabler/icons-react";
import SidebarLayout from "@/components/sidebar/sidebar-layout";
import { WelcomeDialog } from "./_components/welcome-dialog";

export function generateStaticParams() {
  return getStaticParams();
}

export default async function DashboardMainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getScopedI18n("dashboard.sidebar");

  const navItems = [
    {
      title: t("title"),
      url: `/dashboard`,
      items: [
        {
          title: t("home"),
          url: `/dashboard`,
          icon: <IconLayoutDashboardFilled />,
        },
        {
          title: t("courses"),
          url: `/dashboard/courses`,
          icon: <IconBook />,
        },
        {
          title: t("students"),
          url: `/dashboard/students`,
          icon: <IconUsers />,
        },
        {
          title: t("payments"),
          url: `/dashboard/payments`,
          icon: <IconCreditCard />,
        },
        {
          title: t("storefront"),
          url: `/dashboard/storefront`,
          icon: <IconBuildingStore />,
        },
        {
          title: t("settings"),
          url: `/dashboard/settings`,
          icon: <IconSettings />,
        },
      ],
    },
  ];

  return (
    <SidebarLayout data={navItems}>
      {children}
      <WelcomeDialog />
    </SidebarLayout>
  );
}
