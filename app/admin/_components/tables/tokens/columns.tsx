"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { IconCalendar } from "@tabler/icons-react";
import { type FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { TokensTableActions } from "./actions";
import { format } from "date-fns";

export const tokensColumns: ColumnDef<
  FunctionReturnType<typeof api.admin.tokens.get>[number]
>[] = [
  {
    accessorKey: "token",
    header: "Address",
    cell: ({ row }) => {
      return (
        <span className="font-mono bg-primary text-primary-foreground p-1 rounded-sm font-semibold">
          {row.original.token}
        </span>
      );
    },
  },

  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      return row.original.user ? (
        <div className="flex flex-col gap-1">
          <span className="font-mono">{row.original.user.id}</span>
          <span className="text-xs text-muted-foreground">
            {format(row.original.user.usedAt, "dd MMM, HH:mm:ss")}
          </span>
        </div>
      ) : (
        <span>No user yet.</span>
      );
    },
  },

  {
    accessorKey: "_creationTime",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <IconCalendar className="size-4" />
          <span>{format(row.original._creationTime, "dd MMM, HH:mm:ss")}</span>
        </div>
      );
    },
  },

  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <TokensTableActions id={row.original._id} token={row.original.token} />
      );
    },
  },
];
