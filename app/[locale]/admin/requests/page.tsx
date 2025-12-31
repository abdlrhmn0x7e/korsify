import { requireAdmin } from "@/lib/auth-server";
import { Suspense } from "react";
import {
  RequestsTable,
  RequestsTableSkeleton,
} from "../_components/tables/requests";
import { PageHeader } from "@/components/dashboard/page-header";
import { IconUserPlus } from "@tabler/icons-react";
import { PageLayout } from "@/components/dashboard/page-layout";

export default async function RequestsPage() {
  await requireAdmin();

  return (
    <PageLayout>
      <PageHeader title="Early Access Requests" Icon={IconUserPlus} />

      <Suspense fallback={<RequestsTableSkeleton />}>
        <RequestsTable />
      </Suspense>
    </PageLayout>
  );
}
