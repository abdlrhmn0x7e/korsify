import { PageHeader } from "@/components/dashboard/page-header";
import { IconUserPlus } from "@tabler/icons-react";
import { PageLayout } from "@/components/dashboard/page-layout";
import { RequestsTableSkeleton } from "../_components/tables/requests";

export default function RequestsPageLoading() {
  return (
    <PageLayout>
      <PageHeader title="Early Access Requests" Icon={IconUserPlus} />

      <RequestsTableSkeleton />
    </PageLayout>
  );
}
