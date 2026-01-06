"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  type Variants,
} from "motion/react";
import { useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScopedI18n } from "@/locales/client";
import { useCourseSearchParams } from "../../_hooks/use-course-search-params";
import { CourseDetails } from "../../courses/_components/course-details";
import { LessonDetails } from "../../courses/_components/lesson-details";
import { Id } from "@/convex/_generated/dataModel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const slideVariants: Variants = {
  enterFromRight: { x: "100%", opacity: 0 },
  enterFromLeft: { x: "-100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitToLeft: { x: "-50%", opacity: 0 },
  exitToRight: { x: "50%", opacity: 0 },
};

export function CourseSheet() {
  const isMobile = useIsMobile();
  const [params, setParams] = useCourseSearchParams();
  const t = useScopedI18n("dashboard.courses.drawer");

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        return;
      }

      void setParams(() => ({ slug: null, lessonId: null }));
    },
    [setParams]
  );

  const handleBackToDetails = useCallback(() => {
    void setParams((prev) => ({ ...prev, lessonId: null }));
  }, [setParams]);

  const hasLesson = !!params.lessonId;

  return (
    <Sheet open={!!params.slug} onOpenChange={handleOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="sm:max-w-2xl data-[side=right]:sm:max-w-2xl h-screen overflow-x-hidden overflow-y-auto"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>
            {hasLesson ? t("lesson.title") : t("course.title")}
          </SheetTitle>
          <SheetDescription>
            {hasLesson ? t("lesson.description") : t("course.description")}
          </SheetDescription>
        </SheetHeader>

        <div className="h-full overflow-y-auto px-4 mt-12 pb-12">
          {params.slug && (
            <MotionConfig transition={{ duration: 0.2, ease: "easeOut" }}>
              <AnimatePresence mode="popLayout" initial={false}>
                {hasLesson ? (
                  <motion.div
                    key="lesson-details"
                    variants={slideVariants}
                    initial="enterFromRight"
                    animate="center"
                    exit="exitToRight"
                  >
                    <LessonDetails
                      lessonId={params.lessonId as Id<"lessons">}
                      onBack={handleBackToDetails}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="course-details"
                    variants={slideVariants}
                    initial="enterFromLeft"
                    animate="center"
                    className="h-full"
                    exit="exitToLeft"
                  >
                    <CourseDetails slug={params.slug} />
                  </motion.div>
                )}
              </AnimatePresence>
            </MotionConfig>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
