import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { AccessTokensTableClient } from "./table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { AccessTokensTableHeader } from "./header";
import { WholePageSpinner } from "@/components/whole-page-spinner";

export async function AccessTokensTable() {
  const preloadedAccessTokensQuery = await preloadAuthQuery(
    api.earlyAccess.admin.accessTokens.get
  );

  return (
    <AccessTokensTableClient
      preloadedAccessTokensQuery={preloadedAccessTokensQuery}
    />
  );
}

export function AccessTokensTableSkeleton() {
  return (
    <Table className="h-full">
      <AccessTokensTableHeader />

      <TableBody>
        <TableRow>
          <TableCell colSpan={4}>
            <WholePageSpinner />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
