import { CreateAccessTokenButton } from "./_components/create-access-token-button";
import { AccessTokensTableSkeleton } from "../_components/tables/access-tokens";
import { PageHeader } from "@/components/dashboard/page-header";
import { Icon24Hours } from "@tabler/icons-react";
import { PageLayout } from "@/components/dashboard/page-layout";

export default function AccessTokensPageLoading() {
  return (
    <PageLayout>
      <PageHeader title="Access Tokens" Icon={Icon24Hours}>
        <CreateAccessTokenButton />
      </PageHeader>

      <AccessTokensTableSkeleton />
    </PageLayout>
  );
}
