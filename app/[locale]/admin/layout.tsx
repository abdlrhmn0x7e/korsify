import { NavItem } from "@/components/sidebar/app-sidebar";
import SidebarLayout from "@/components/sidebar/sidebar-layout";
import { Icon24Hours, IconLayoutDashboardFilled } from "@tabler/icons-react";

const data: NavItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    items: [
      {
        title: "Home",
        url: "/admin",
        icon: <IconLayoutDashboardFilled />,
      },
      {
        title: "Tokens",
        url: "/admin/tokens",
        icon: <Icon24Hours />,
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout data={data} dir="ltr" lang="en">
      {children}
    </SidebarLayout>
  );
}
