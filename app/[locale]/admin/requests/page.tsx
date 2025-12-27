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

export default async function RequestsPage() {
  await requireAdmin();

  return (
    <section className="space-y-6">
      <Frame>
        <FrameHeader>
          <div className="flex items-center justify-between gap-2">
            <FrameTitle>Early Access Requests</FrameTitle>
          </div>
        </FrameHeader>

        <FramePanel>
          <Suspense fallback={<RequestsTableSkeleton />}>
            <RequestsTable />
          </Suspense>
        </FramePanel>
      </Frame>
    </section>
  );
}
