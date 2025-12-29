import { getStaticParams, getScopedI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { DashboardLayoutClient } from "./_components/dashboard-layout-client";
import {
  IconBook,
  IconCreditCard,
  IconLayoutDashboardFilled,
  IconSettings,
  IconBuildingStore,
  IconUsers,
} from "@tabler/icons-react";

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
      url: `/${locale}/dashboard`,
      items: [
        {
          title: t("home"),
          url: `/${locale}/dashboard`,
          icon: <IconLayoutDashboardFilled />,
        },
        {
          title: t("courses"),
          url: `/${locale}/dashboard/courses`,
          icon: <IconBook />,
        },
        {
          title: t("students"),
          url: `/${locale}/dashboard/students`,
          icon: <IconUsers />,
        },
        {
          title: t("payments"),
          url: `/${locale}/dashboard/payments`,
          icon: <IconCreditCard />,
        },
        {
          title: t("storefront"),
          url: `/${locale}/dashboard/storefront`,
          icon: <IconBuildingStore />,
        },
        {
          title: t("settings"),
          url: `/${locale}/dashboard/settings`,
          icon: <IconSettings />,
        },
      ],
    },
  ];

  return (
    <DashboardLayoutClient
      navItems={navItems}
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
    >
      {children}
    </DashboardLayoutClient>
  );
}
