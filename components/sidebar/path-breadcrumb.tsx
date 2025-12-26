"use client";

import { IconFileDescription, IconFolderFilled } from "@tabler/icons-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react/jsx-runtime";

interface PathBreadcrumbProps {
  path: string;
  className?: string;
}

export function PathBreadcrumb({ path, className }: PathBreadcrumbProps) {
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isFirst = index === 0;
          const isLast = index === segments.length - 1;
          const isSingle = segments.length === 1;

          const Icon =
            isSingle || isFirst
              ? IconFolderFilled
              : isLast
                ? IconFileDescription
                : null;

          return (
            <Fragment key={`${segment}-${index}`}>
              {index > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize inline-flex items-center gap-1">
                  {Icon && <Icon className="size-4" />}
                  {segment}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
