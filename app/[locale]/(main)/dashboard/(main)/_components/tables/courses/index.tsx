import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { CoursesTableClient } from "./table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CoursesTableHeader } from "./header";
import { WholePageSpinner } from "@/components/whole-page-spinner";

export async function CoursesTable() {
  const preloadedCoursesQuery = await preloadAuthQuery(
    api.teachers.courses.queries.getAll,
    {}
  );

  return <CoursesTableClient preloadedCoursesQuery={preloadedCoursesQuery} />;
}

export function CoursesTableSkeleton() {
  return (
    <Table className="h-full">
      <CoursesTableHeader />

      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>
            <WholePageSpinner />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
