"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { api } from "@/convex/_generated/api";
import { IconCalendar } from "@tabler/icons-react";
import { type FunctionReturnType } from "convex/server";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CoursesTableActions } from "./actions";

export const coursesColumns: ColumnDef<
  FunctionReturnType<typeof api.teachers.courses.queries.getAll>[number]
>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="rounded-sm overflow-hidden max-w-32 object-contain">
            <img
              src={row.original.thumbnailUrl ?? ""}
              alt={row.original.title}
            />
          </div>
          <span className="font-bold">{row.original.title}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "pricing",
    header: "Price",
    cell: ({ row }) => {
      const pricing = row.original.pricing;
      return (
        <div className="flex items-center gap-2">
          {pricing.overridePrice ? (
            <>
              <span className="font-bold text-primary">
                EGP {pricing.overridePrice}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                EGP {pricing.price}
              </span>
            </>
          ) : (
            <span className="font-bold">EGP {pricing.price}</span>
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
          {status}
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
          <span>{format(row.original._creationTime, "dd MMM")}</span>
        </div>
      );
    },
  },

  {
    header: "Actions",
    cell: ({ row }) => {
      return <CoursesTableActions id={row.original._id} />;
    },
  },
];
