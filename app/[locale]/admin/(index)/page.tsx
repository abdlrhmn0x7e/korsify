import { PageHeader } from "@/components/dashboard/page-header";
import { requireAdmin } from "@/lib/auth-server";
import { IconLayoutDashboardFilled } from "@tabler/icons-react";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <section>
      <PageHeader title="Admin" Icon={IconLayoutDashboardFilled}>
        <p>hello</p>
      </PageHeader>
      admin
    </section>
  );
}
