import { requireAdmin } from "@/lib/auth-server";
import { Suspense } from "react";
import {
  RequestsTable,
  RequestsTableSkeleton,
} from "../_components/tables/requests";
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame";
import { PageHeader } from "@/components/page-header";
import { IconUserPlus } from "@tabler/icons-react";

export default async function RequestsPage() {
  await requireAdmin();

  return (
    <section>
      <PageHeader title="Early Access Requests" Icon={IconUserPlus} />

      <Suspense fallback={<RequestsTableSkeleton />}>
        <RequestsTable />
      </Suspense>
    </section>
  );
}
