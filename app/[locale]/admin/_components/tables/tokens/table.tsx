"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useMemo } from "react";

import { IconPackage } from "@tabler/icons-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { Preloaded } from "convex/react";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { api } from "@/convex/_generated/api";
import { tokensColumns } from "./columns";
import { TokensTableHeader } from "./header";

export function TokensTableClient({
  preloadedTokensQuery,
}: {
  preloadedTokensQuery: Preloaded<
    typeof api.earlyAccess.admin.queries.getTokens
  >;
}) {
  const tokens = usePreloadedAuthQuery(preloadedTokensQuery);
  const tokensData = useMemo(() => tokens ?? [], [tokens]);

  const table = useReactTable({
    data: tokensData,
    columns: tokensColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TokensTableHeader />

      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={tokensColumns.length} className="text-center">
              <div className="flex flex-col items-center justify-center gap-2 py-32">
                <IconPackage size={64} />
                <p className="text-lg font-medium">No Tokens Found.</p>
                <p className="text-muted-foreground text-sm">Generate some</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
