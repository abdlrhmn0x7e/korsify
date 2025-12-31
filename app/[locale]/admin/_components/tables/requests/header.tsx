import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RequestsTableHeader() {
  return (
    <TableHeader>
      <TableRow className="sticky top-0 pb-1">
        <TableHead className="w-1/2">Phone Number</TableHead>
        <TableHead className="w-1/2">Created At</TableHead>
      </TableRow>
    </TableHeader>
  );
}
