import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AccessTokensTableHeader() {
  return (
    <TableHeader>
      <TableRow className="sticky top-0 pb-1">
        <TableHead className="w-1/4">Token</TableHead>
        <TableHead className="w-1/4">User</TableHead>
        <TableHead className="w-1/4">Created At</TableHead>
        <TableHead className="w-1/4">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
