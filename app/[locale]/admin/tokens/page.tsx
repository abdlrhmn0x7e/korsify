import { requireAdmin } from "@/lib/auth-server";
import { CreateTokenButton } from "./_components/create-token-button";
import { Suspense } from "react";
import { TokensTable, TokensTableSkeleton } from "../_components/tables/tokens";
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame";

export default async function TokensPage() {
  await requireAdmin();

  return (
    <section className="space-y-6">
      <Frame>
        <FrameHeader>
          <div className="flex items-center justify-between gap-2">
            <FrameTitle>Tokens</FrameTitle>

            <CreateTokenButton />
          </div>
        </FrameHeader>

        <FramePanel>
          <Suspense fallback={<TokensTableSkeleton />}>
            <TokensTable />
          </Suspense>
        </FramePanel>
      </Frame>
    </section>
  );
}
