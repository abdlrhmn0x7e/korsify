"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  function renderBreadcrumbItems() {
    return segments.map((segment, index) => {
      const isLast = index === segments.length - 1;
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      if (isLast) {
        return (
          <BreadcrumbItem key={segment}>
            <BreadcrumbPage>{segment}</BreadcrumbPage>
          </BreadcrumbItem>
        );
      }

      return (
        <Fragment key={segment}>
          <BreadcrumbItem key={segment}>
            <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
          </BreadcrumbItem>
          {!isLast && <BreadcrumbSeparator />}
        </Fragment>
      );
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="capitalize">
        {renderBreadcrumbItems()}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
