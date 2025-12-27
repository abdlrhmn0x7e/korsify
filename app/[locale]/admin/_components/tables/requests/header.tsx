import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RequestsTableHeader() {
  return (
    <TableHeader>
      <TableRow className="sticky top-0 pb-1">
        <TableHead>Phone Number</TableHead>
        <TableHead>Created At</TableHead>
      </TableRow>
    </TableHeader>
  );
}
