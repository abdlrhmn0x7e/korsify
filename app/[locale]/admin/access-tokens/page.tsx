import { requireAdmin } from "@/lib/auth-server";
import { CreateAccessTokenButton } from "./_components/create-access-token-button";
import { Suspense } from "react";
import {
  AccessTokensTable,
  AccessTokensTableSkeleton,
} from "../_components/tables/access-tokens";
import { PageHeader } from "@/components/page-header";
import { Icon24Hours } from "@tabler/icons-react";

export default async function AccessTokensPage() {
  await requireAdmin();

  return (
    <section>
      <PageHeader title="Access Tokens" Icon={Icon24Hours}>
        <CreateAccessTokenButton />
      </PageHeader>

      <Suspense fallback={<AccessTokensTableSkeleton />}>
        <AccessTokensTable />
      </Suspense>
    </section>
  );
}
