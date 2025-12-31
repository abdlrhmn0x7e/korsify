import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { RequestsTableClient } from "./table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { RequestsTableHeader } from "./header";
import { Spinner } from "@/components/ui/spinner";

export async function RequestsTable() {
  const preloadedRequestsQuery = await preloadAuthQuery(
    api.earlyAccess.admin.requests.getAll
  );

  return (
    <RequestsTableClient preloadedRequestsQuery={preloadedRequestsQuery} />
  );
}

export function RequestsTableSkeleton() {
  return (
    <Table className="h-full">
      <RequestsTableHeader />

      <TableBody>
        <TableRow>
          <TableCell colSpan={2}>
            <div className="h-full flex flex-col items-center justify-center">
              <Spinner className="size-6" />
              <span className="text-lg">Loading Data</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
