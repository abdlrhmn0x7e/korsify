"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCourseSearchParams } from "../../_hooks/use-course-search-params";
import { CourseDetails } from "../../courses/_components/course-details";

export function CourseDrawer() {
  const isMobile = useIsMobile();
  const [params, setParams] = useCourseSearchParams();

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        return;
      }

      void setParams(() => ({ slug: null }));
    },
    [setParams]
  );

  return (
    <Sheet open={!!params.slug} onOpenChange={handleOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="sm:max-w-2xl data-[side=right]:sm:max-w-2xl"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Course Details</SheetTitle>
          <SheetDescription>View and manage your course</SheetDescription>
        </SheetHeader>

        {params.slug && (
          <div className="mr-2 p-4 overflow-y-auto pb-12 flex-1">
            <CourseDetails slug={params.slug} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
