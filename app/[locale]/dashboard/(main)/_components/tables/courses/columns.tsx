"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { api } from "@/convex/_generated/api";
import { IconCalendar, IconCheck, IconPencil } from "@tabler/icons-react";
import { type FunctionReturnType } from "convex/server";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CoursesTableActions } from "./actions";
import { formatPrice } from "@/lib/format-price";

export const coursesColumns: ColumnDef<
  FunctionReturnType<typeof api.teachers.courses.queries.getAll>[number]
>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <span className="font-normal">{row.original.title}</span>;
    },
  },

  {
    accessorKey: "pricing",
    header: "Price",
    cell: ({ row }) => {
      const pricing = row.original.pricing;
      return (
        <div className="flex items-center gap-1">
          {pricing.overridePrice ? (
            <>
              <span className="font-medium">
                {formatPrice(pricing.overridePrice)}
              </span>
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(pricing.price)}
              </span>
            </>
          ) : (
            <span className="font-medium">EGP {pricing.price}</span>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "published" ? "success" : "secondary"}>
          {status === "published" ? <IconCheck /> : <IconPencil />}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },

  {
    accessorKey: "_creationTime",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <IconCalendar className="size-4" />
          <span>{format(row.original._creationTime, "dd MMM yyyy")}</span>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <CoursesTableActions id={row.original._id} />;
    },
  },
];
