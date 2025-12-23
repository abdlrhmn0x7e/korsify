import { IconTicket } from "@tabler/icons-react";
import Header from "../_components/header";
import { requireAdmin } from "@/lib/auth-server";
import { CreateTokenButton } from "./_components/create-token-button";
import { Suspense } from "react";
import { TokensTable, TokensTableSkeleton } from "../_components/tables/tokens";

export default async function TokensPage() {
  await requireAdmin();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <Header
          title="Tokens"
          description="Manager teacher tokens."
          Icon={IconTicket}
        />

        <CreateTokenButton />
      </div>

      <Suspense fallback={<TokensTableSkeleton />}>
        <TokensTable />
      </Suspense>
    </section>
  );
}
