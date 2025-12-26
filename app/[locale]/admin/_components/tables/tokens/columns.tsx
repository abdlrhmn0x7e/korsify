"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { api } from "@/convex/_generated/api";
import {
  IconBrandOauth,
  IconCalendar,
  IconUser,
  IconUserOff,
} from "@tabler/icons-react";
import { type FunctionReturnType } from "convex/server";
import { format } from "date-fns";
import { TokensTableActions } from "./actions";
import { Badge } from "@/components/ui/badge";

export const tokensColumns: ColumnDef<
  FunctionReturnType<typeof api.admin.tokens.get>[number]
>[] = [
  {
    accessorKey: "token",
    header: "Address",
    cell: ({ row }) => {
      return (
        <Badge>
          <IconBrandOauth />
          {row.original.token}
        </Badge>
      );
    },
  },

  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      return row.original.user ? (
        <div className="flex flex-col gap-1">
          <Badge variant="outline">
            <IconUser />
            {row.original.user.id}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {format(row.original.user.usedAt, "dd MMM, hh:mm a")}
          </span>
        </div>
      ) : (
        <Badge variant="outline">
          <IconUserOff />
          No user yet.
        </Badge>
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
          <span>{format(row.original._creationTime, "dd MMM, hh:mm a")}</span>
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
