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
import { accessTokensColumns } from "./columns";
import { AccessTokensTableHeader } from "./header";

export function AccessTokensTableClient({
  preloadedAccessTokensQuery,
}: {
  preloadedAccessTokensQuery: Preloaded<
    typeof api.earlyAccess.admin.accessTokens.get
  >;
}) {
  const accessTokens = usePreloadedAuthQuery(preloadedAccessTokensQuery);
  const accessTokensData = useMemo(() => accessTokens ?? [], [accessTokens]);

  const table = useReactTable({
    data: accessTokensData,
    columns: accessTokensColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <AccessTokensTableHeader />

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
            <TableCell
              colSpan={accessTokensColumns.length}
              className="text-center"
            >
              <div className="flex flex-col items-center justify-center gap-2 py-32">
                <IconPackage size={64} />
                <p className="text-lg font-medium">No Access Tokens Found.</p>
                <p className="text-muted-foreground text-sm">Generate some</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
