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
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { Preloaded } from "convex/react";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { api } from "@/convex/_generated/api";
import { accessTokensColumns } from "./columns";
import { AccessTokensTableHeader } from "./header";
import { cn } from "@/lib/utils";
import { CreateAccessTokenButton } from "../../../access-tokens/_components/create-access-token-button";

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
    <Table className={cn(accessTokensData.length === 0 && "h-full")}>
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
            <TableCell colSpan={accessTokensColumns.length}>
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconPackage />
                  </EmptyMedia>
                  <EmptyTitle>No Access Tokens Found.</EmptyTitle>
                </EmptyHeader>
                <EmptyContent>
                  <CreateAccessTokenButton variant="default" />
                </EmptyContent>
              </Empty>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
