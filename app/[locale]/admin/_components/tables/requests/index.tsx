import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { RequestsTableClient } from "./table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { RequestsTableHeader } from "./header";
import { Skeleton } from "@/components/ui/skeleton";

export async function RequestsTable() {
  const preloadedRequestsQuery = await preloadAuthQuery(
    api.earlyAccess.admin.requests.getAll
  );

  return <RequestsTableClient preloadedRequestsQuery={preloadedRequestsQuery} />;
}

export function RequestsTableSkeleton() {
  return (
    <Table>
      <RequestsTableHeader />

      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
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
