"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { api } from "@/convex/_generated/api";
import { IconCalendar, IconPhone } from "@tabler/icons-react";
import { type FunctionReturnType } from "convex/server";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const requestsColumns: ColumnDef<
  FunctionReturnType<typeof api.earlyAccess.admin.requests.getAll>[number]
>[] = [
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      return (
        <Badge>
          <IconPhone />
          {row.original.phoneNumber}
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
];
