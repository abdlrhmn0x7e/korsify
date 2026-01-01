"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { useScopedI18n } from "@/locales/client";

import { api } from "@/convex/_generated/api";
import { IconCalendar } from "@tabler/icons-react";
import { type FunctionReturnType } from "convex/server";
import { format } from "date-fns";
import { CoursesTableActions, CourseStatusButton } from "./actions";
import { formatPrice } from "@/lib/format-price";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCourseSearchParams } from "../../../_hooks/use-course-search-params";

export const CoursesColumns = () => {
  const t = useScopedI18n("dashboard.courses.table.headers");

  const columns: ColumnDef<
    FunctionReturnType<typeof api.teachers.courses.queries.getAll>[number]
  >[] = [
    {
      accessorKey: "title",
      header: t("title"),
      cell: ({ row }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [, setParams] = useCourseSearchParams();
        return (
          <Button
            variant="link"
            className="font-normal"
            onClick={() => void setParams({ slug: row.original.slug })}
          >
            {row.original.title}
          </Button>
        );
      },
    },

    {
      accessorKey: "pricing",
      header: t("price"),
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
      header: t("status"),
      cell: ({ row }) => {
        return (
          <CourseStatusButton
            status={row.original.status}
            courseId={row.original._id}
          />
        );
      },
    },

    {
      accessorKey: "_creationTime",
      header: t("createdAt"),
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
      header: t("actions"),
      cell: ({ row }) => {
        return <CoursesTableActions course={row.original} />;
      },
    },
  ];

  return columns;
};
