import { getStaticParams, getScopedI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import {
  IconBook,
  IconCreditCard,
  IconSettings,
  IconBuildingStore,
  IconUsers,
  IconHome,
} from "@tabler/icons-react";
import SidebarLayout from "@/components/dashboard/sidebar/sidebar-layout";
import { WelcomeDialog } from "./_components/dialogs/welcome-dialog";
import { SettingsDialog } from "./_components/dialogs/settings/dialog";
import { preloadAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";

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
  void preloadAuthQuery(api.teachers.queries.getTeacher);

  const dir = locale === "ar" ? "rtl" : "ltr";

  const navItems = [
    {
      title: t("title"),
      url: `/dashboard`,
      items: [
        {
          title: t("home"),
          url: `/dashboard`,
          icon: <IconHome />,
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
      ],
    },
  ];

  const secondary = [
    {
      title: t("settings"),
      url: `/dashboard/settings`,
      icon: <IconSettings />,
      component: <SettingsDialog />,
    },
  ];

  return (
    <SidebarLayout data={navItems} secondary={secondary} dir={dir}>
      {children}
      <WelcomeDialog />
    </SidebarLayout>
  );
}
