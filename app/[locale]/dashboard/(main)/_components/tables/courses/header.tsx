"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useScopedI18n } from "@/locales/client";

export function CoursesTableHeader() {
  const t = useScopedI18n("dashboard.courses.table.headers");

  return (
    <TableHeader>
      <TableRow className="sticky top-0 pb-1">
        <TableHead className="w-4/12">{t("title")}</TableHead>
        <TableHead className="w-2/12">{t("price")}</TableHead>
        <TableHead className="w-1/12">{t("status")}</TableHead>
        <TableHead className="w-3/12">{t("createdAt")}</TableHead>
        <TableHead className="w-1/12">{t("actions")}</TableHead>
      </TableRow>
    </TableHeader>
  );
}
