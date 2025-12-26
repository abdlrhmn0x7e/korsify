import { requireAdmin } from "@/lib/auth-server";
import { CreateAccessTokenButton } from "./_components/create-access-token-button";
import { Suspense } from "react";
import {
  AccessTokensTable,
  AccessTokensTableSkeleton,
} from "../_components/tables/tokens";
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame";

export default async function AccessTokensPage() {
  await requireAdmin();

  return (
    <section className="space-y-6">
      <Frame>
        <FrameHeader>
          <div className="flex items-center justify-between gap-2">
            <FrameTitle>Access Tokens</FrameTitle>

            <CreateAccessTokenButton />
          </div>
        </FrameHeader>

        <FramePanel>
          <Suspense fallback={<AccessTokensTableSkeleton />}>
            <AccessTokensTable />
          </Suspense>
        </FramePanel>
      </Frame>
    </section>
  );
}
