"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCourseSearchParams } from "../../_hooks/use-course-search-params";

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
    [setParams],
  );

  return (
    <Drawer
      open={!!params.slug}
      onOpenChange={handleOpenChange}
      direction={isMobile ? "bottom" : "right"}
      handleOnly={!isMobile}
    >
      <DrawerContent className="data-[vaul-drawer-direction=right]:sm:max-w-2xl">
        <DrawerHeader className="items-center justify-between gap-2 lg:flex-row">
          <div className="space-y-1">
            <DrawerTitle>Course Details</DrawerTitle>
            <DrawerDescription>View and manage your course</DrawerDescription>
          </div>
        </DrawerHeader>

        <div className="mr-2 overflow-y-auto pb-12">hello world</div>
      </DrawerContent>
    </Drawer>
  );
}
