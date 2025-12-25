import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { TokensTableClient } from "./table";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TokensTableHeader } from "./header";
import { Skeleton } from "@/components/ui/skeleton";

export async function TokensTable() {
  const preloadedTokensQuery = await preloadAuthQuery(api.admin.tokens.get);

  return <TokensTableClient preloadedTokensQuery={preloadedTokensQuery} />;
}

export function TokensTableSkeleton() {
  return (
    <Card className="gap-1 py-2">
      <CardContent className="px-2">
        <div className="bg-background overflow-hidden rounded-md border">
          <Table containerClassName="scroll-shadow">
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
        </div>
      </CardContent>
    </Card>
  );
}
