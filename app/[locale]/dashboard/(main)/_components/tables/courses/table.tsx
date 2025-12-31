"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useMemo } from "react";

import { IconBook } from "@tabler/icons-react";
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
import { coursesColumns } from "./columns";
import { CoursesTableHeader } from "./header";
import { AddCourseButton } from "../../../courses/_components/add-course-button";
import { cn } from "@/lib/utils";

export function CoursesTableClient({
  preloadedCoursesQuery,
}: {
  preloadedCoursesQuery: Preloaded<typeof api.teachers.courses.queries.getAll>;
}) {
  const courses = usePreloadedAuthQuery(preloadedCoursesQuery);
  const coursesData = useMemo(() => courses ?? [], [courses]);

  const table = useReactTable({
    data: coursesData,
    columns: coursesColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table className={cn(coursesData.length === 0 && "h-full")}>
      <CoursesTableHeader />

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
            <TableCell colSpan={coursesColumns.length}>
              <Empty className="mb-12">
                <EmptyHeader>
                  <EmptyMedia variant="icon" className="size-12">
                    <IconBook className="size-6" />
                  </EmptyMedia>
                  <EmptyTitle>No Courses Found.</EmptyTitle>
                </EmptyHeader>
                <EmptyContent>
                  <AddCourseButton variant="default" />
                </EmptyContent>
              </Empty>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
