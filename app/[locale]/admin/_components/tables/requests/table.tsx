"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useMemo } from "react";

import { IconPackage } from "@tabler/icons-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { Preloaded } from "convex/react";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { api } from "@/convex/_generated/api";
import { requestsColumns } from "./columns";
import { RequestsTableHeader } from "./header";

export function RequestsTableClient({
  preloadedRequestsQuery,
}: {
  preloadedRequestsQuery: Preloaded<
    typeof api.earlyAccess.admin.requests.getAll
  >;
}) {
  const requests = usePreloadedAuthQuery(preloadedRequestsQuery);
  const requestsData = useMemo(() => requests ?? [], [requests]);

  const table = useReactTable({
    data: requestsData,
    columns: requestsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <RequestsTableHeader />

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
            <TableCell colSpan={requestsColumns.length}>
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconPackage />
                  </EmptyMedia>
                  <EmptyTitle>No Requests Found.</EmptyTitle>
                </EmptyHeader>
              </Empty>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
