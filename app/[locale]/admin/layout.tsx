import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AdminBreadcrumb } from "./_components/admin-breadcrumb";
import { Suspense } from "react";
import { AdminSidebar } from "./_components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <SidebarProvider>
        <AdminSidebar />

        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b pr-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <AdminBreadcrumb />
            </div>
          </header>

          <main className="flex-1 p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
}
