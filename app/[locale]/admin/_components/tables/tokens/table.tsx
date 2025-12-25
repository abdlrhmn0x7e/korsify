"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useMemo } from "react";

import { IconPackage } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { Preloaded } from "convex/react";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { api } from "@/convex/_generated/api";
import { tokensColumns } from "./columns";
import { cn } from "@/lib/utils";
import { TokensTableHeader } from "./header";

export function TokensTableClient({
  preloadedTokensQuery,
}: {
  preloadedTokensQuery: Preloaded<typeof api.admin.tokens.get>;
}) {
  const tokens = usePreloadedAuthQuery(preloadedTokensQuery);
  const tokensData = useMemo(() => tokens ?? [], [tokens]);

  const table = useReactTable({
    data: tokensData,
    columns: tokensColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="gap-2 py-2">
      <CardContent className="px-2">
        <div
          className={cn(
            "bg-background overflow-hidden rounded-lg border transition-opacity",
          )}
        >
          <Table containerClassName="h-fit max-h-[75svh] overflow-y-auto">
            <TokensTableHeader />

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tokensColumns.length}
                    className="text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 py-32">
                      <IconPackage size={64} />
                      <p className="text-lg font-medium">No Tokens Found.</p>
                      <p className="text-muted-foreground text-sm">
                        Generate some
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
