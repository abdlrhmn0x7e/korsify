import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { TokensTableClient } from "./table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TokensTableHeader } from "./header";
import { Skeleton } from "@/components/ui/skeleton";

export async function TokensTable() {
  const preloadedTokensQuery = await preloadAuthQuery(
    api.earlyAccess.admin.queries.getTokens
  );

  return <TokensTableClient preloadedTokensQuery={preloadedTokensQuery} />;
}

export function TokensTableSkeleton() {
  return (
    <Table>
      <TokensTableHeader />

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
