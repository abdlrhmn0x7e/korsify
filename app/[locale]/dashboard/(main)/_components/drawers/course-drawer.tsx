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

const slideVariants: Variants = {
  enterFromRight: { x: "100%", opacity: 0 },
  enterFromLeft: { x: "-100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitToLeft: { x: "-50%", opacity: 0 },
  exitToRight: { x: "50%", opacity: 0 },
};

const slideTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

export function CourseDrawer() {
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
        className="sm:max-w-2xl data-[side=right]:sm:max-w-2xl overflow-hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>
            {hasLesson ? t("lesson.title") : t("course.title")}
          </SheetTitle>
          <SheetDescription>
            {hasLesson ? t("lesson.description") : t("course.description")}
          </SheetDescription>
        </SheetHeader>

        {params.slug && (
          <div className="relative h-full overflow-hidden">
            <MotionConfig transition={{ duration: 0.3, ease: "easeOut" }}>
              <AnimatePresence mode="popLayout" initial={false}>
                {hasLesson ? (
                  <motion.div
                    key="lesson"
                    variants={slideVariants}
                    initial="enterFromRight"
                    animate="center"
                    exit="exitToRight"
                    transition={slideTransition}
                    className="absolute inset-0 p-4 overflow-y-auto pb-12"
                  >
                    <LessonDetails
                      lessonId={params.lessonId as Id<"lessons">}
                      onBack={handleBackToDetails}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="course"
                    variants={slideVariants}
                    initial="enterFromLeft"
                    animate="center"
                    exit="exitToLeft"
                    transition={slideTransition}
                    className="absolute inset-0 p-4 overflow-y-auto pb-12"
                  >
                    <CourseDetails slug={params.slug} />
                  </motion.div>
                )}
              </AnimatePresence>
            </MotionConfig>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
