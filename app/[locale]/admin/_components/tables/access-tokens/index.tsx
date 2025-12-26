import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { AccessTokensTableClient } from "./table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { AccessTokensTableHeader } from "./header";
import { Skeleton } from "@/components/ui/skeleton";

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
    <Table>
      <AccessTokensTableHeader />

      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
