import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TokensTableHeader() {
  return (
    <TableHeader>
      <TableRow className="sticky top-0 pb-1">
        <TableHead>Token</TableHead>
        <TableHead>User</TableHead>
        <TableHead>Created At</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
