"use client";

import { NavItem } from "@/components/sidebar/app-sidebar";
import SidebarLayout from "@/components/sidebar/sidebar-layout";
import { TeacherProvider } from "../../_components/_providers/teacher-provider";

type DashboardLayoutClientProps = {
  children: React.ReactNode;
  navItems: NavItem[];
  dir: "ltr" | "rtl";
  lang: string;
};

export function DashboardLayoutClient({
  children,
  navItems,
  dir,
  lang,
}: DashboardLayoutClientProps) {
  return (
    <TeacherProvider>
      <SidebarLayout data={navItems} dir={dir} lang={lang}>
        {children}
      </SidebarLayout>
    </TeacherProvider>
  );
}
