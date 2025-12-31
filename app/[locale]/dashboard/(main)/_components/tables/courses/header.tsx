import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function CoursesTableHeader() {
  return (
    <TableHeader>
      <TableRow className="sticky top-0 pb-1">
        <TableHead className="w-4/12">Title</TableHead>
        <TableHead className="w-2/12">Price</TableHead>
        <TableHead className="w-1/12">Status</TableHead>
        <TableHead className="w-3/12">Created At</TableHead>
        <TableHead className="w-1/12">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
