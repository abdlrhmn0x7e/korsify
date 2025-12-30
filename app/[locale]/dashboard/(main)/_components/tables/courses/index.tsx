import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { CoursesTableClient } from "./table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CoursesTableHeader } from "./header";
import { Skeleton } from "@/components/ui/skeleton";

export async function CoursesTable() {
  const preloadedCoursesQuery = await preloadAuthQuery(
    api.teachers.courses.queries.getAll,
    {},
  );

  return <CoursesTableClient preloadedCoursesQuery={preloadedCoursesQuery} />;
}

export function CoursesTableSkeleton() {
  return (
    <Table>
      <CoursesTableHeader />

      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
