"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  IconBookOff,
  IconChevronDown,
  IconChevronRight,
  IconDotsVertical,
  IconPencil,
  IconPlus,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconFileDescription,
  IconPlayerPlay,
} from "@tabler/icons-react";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionHeader,
  AccordionTriggerMinimal,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddLessonDialog } from "./add-lesson-dialog";
import { useScopedI18n } from "@/locales/client";
import { useCourseSearchParams } from "../../_hooks/use-course-search-params";

export function CourseSections({ courseId }: { courseId: Id<"courses"> }) {
  const sections = useQuery(api.teachers.sections.queries.getByCourseId, {
    courseId,
  });
  const t = useScopedI18n("dashboard.courses.sections");
  const isPending = sections === undefined;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h5>{t("title")}</h5>
        <CreateSectionButton courseId={courseId} />
      </div>

      <div className="h-full min-h-32">
        {isPending && (
          <div className="space-y-3 mt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        )}
        {sections &&
          (sections.length > 0 ? (
            <Accordion>
              {sections.map((section) => (
                <SectionAccordionItem section={section} key={section._id} />
              ))}
            </Accordion>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-12">
                  <IconBookOff className="size-6" />
                </EmptyMedia>
                <EmptyTitle>{t("empty")}</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <CreateSectionButton courseId={courseId} variant="outline" />
              </EmptyContent>
            </Empty>
          ))}
      </div>
    </div>
  );
}

function CreateSectionButton({
  courseId,
  variant = "default",
}: {
  courseId: Id<"courses">;
  variant?: "default" | "outline";
}) {
  const t = useScopedI18n("dashboard.courses.sections");
  const addSectionMutation = useMutation({
    mutationFn: useConvexMutation(api.teachers.sections.mutations.create),
  });

  return (
    <Button
      disabled={addSectionMutation.isPending}
      variant={variant}
      size="sm"
      onClick={() => {
        addSectionMutation.mutate({
          courseId,
          title: t("newSectionDefaultTitle"),
        });
      }}
    >
      {addSectionMutation.isPending ? <Spinner /> : <IconPlus />}
      {t("addSection")}
    </Button>
  );
}

function SectionAccordionItem({ section }: { section: Doc<"sections"> }) {
  const [isEditing, setIsEditing] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const t = useScopedI18n("dashboard.courses");

  const lessons = useQuery(api.teachers.lessons.queries.getBySectionId, {
    sectionId: section._id,
  });

  const updateSectionMutation = useMutation({
    mutationFn: useConvexMutation(api.teachers.sections.mutations.update),
    onSettled: () => {
      setIsEditing(false);
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: useConvexMutation(api.teachers.sections.mutations.remove),
  });

  const updateStatusMutation = useMutation({
    mutationFn: useConvexMutation(api.teachers.sections.mutations.updateStatus),
  });

  function exitEditing() {
    const newTitle = titleInputRef.current?.value.trim();

    if (newTitle === "" || newTitle === section.title) {
      setIsEditing(false);
    } else {
      updateSectionMutation.mutate({
        sectionId: section._id,
        title: newTitle,
      });
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      exitEditing();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  }

  function handleBlur() {
    exitEditing();
  }

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditing]);

  function handleUpdateStatus() {
    updateStatusMutation.mutate({
      sectionId: section._id,
      status: section.status === "draft" ? "published" : "draft",
    });
  }

  function handleDelete() {
    deleteSectionMutation.mutate({
      sectionId: section._id,
    });
  }

  const lessonsCount = lessons?.length ?? 0;
  const isLoading =
    updateSectionMutation.isPending ||
    deleteSectionMutation.isPending ||
    updateStatusMutation.isPending;

  return (
    <AccordionItem value={section._id}>
      <AccordionHeader className="flex items-center gap-2 py-1 px-2 text-sm rounded-sm">
        <AccordionTriggerMinimal className="flex-1 py-0 hover:no-underline">
          <div className="flex items-center gap-2 min-h-7">
            {isEditing ? (
              <input
                defaultValue={section.title}
                ref={titleInputRef}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onClick={(e) => e.stopPropagation()}
                disabled={updateSectionMutation.isPending}
                className="bg-transparent outline-none border-b focus:border-primary w-full"
              />
            ) : (
              <span>{section.title}</span>
            )}
          </div>
        </AccordionTriggerMinimal>

        <div className="flex items-center gap-1.5 shrink-0">
          <Badge
            variant={section.status === "published" ? "success" : "outline"}
          >
            {section.status === "published"
              ? t("table.status.published")
              : t("table.status.draft")}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "ghost", size: "xs" })}
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : <IconDotsVertical size={16} />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              <DropdownMenuItem
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <IconPencil />
                {t("table.actions.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleUpdateStatus}>
                {section.status === "published" ? (
                  <>
                    <IconEyeOff />
                    {t("table.actions.draft")}
                  </>
                ) : (
                  <>
                    <IconEye />
                    {t("table.actions.publish")}
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                <IconTrash />
                {t("table.actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <IconChevronDown
            size={16}
            className="transition-transform text-muted-foreground group-data-open/accordion-item:rotate-180"
          />
        </div>
      </AccordionHeader>

      <AccordionContent className="pl-4">
        {lessons === undefined ? (
          <div className="py-4 flex justify-center">
            <Spinner />
          </div>
        ) : lessonsCount > 0 ? (
          <LessonsList
            lessons={lessons}
            courseId={section.courseId}
            sectionId={section._id}
          />
        ) : (
          <Empty className="py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="size-10">
                <IconFileDescription className="size-5" />
              </EmptyMedia>
              <EmptyTitle className="text-base">
                {t("sections.lessons.empty")}
              </EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <AddLessonDialog
                courseId={section.courseId}
                sectionId={section._id}
              />
            </EmptyContent>
          </Empty>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

interface LessonsListProps {
  lessons: Array<{
    _id: Id<"lessons">;
    title: string;
    isFree: boolean;
  }>;
  courseId: Id<"courses">;
  sectionId: Id<"sections">;
}

function LessonsList({ lessons, courseId, sectionId }: LessonsListProps) {
  const [, setParams] = useCourseSearchParams();
  const t = useScopedI18n("dashboard.courses.sections.lessons");

  function handleLessonClick(lessonId: Id<"lessons">) {
    void setParams((prev) => ({ ...prev, lessonId }));
  }

  return (
    <div className="space-y-1">
      <ul className="space-y-0.5">
        {lessons.map((lesson, index) => (
          <li key={lesson._id}>
            <button
              onClick={() => handleLessonClick(lesson._id)}
              className="w-full flex items-center gap-3 py-2 px-3 text-sm rounded-md
                         hover:bg-accent transition-colors text-left group cursor-pointer"
            >
              <span
                className="flex items-center justify-center size-5
                          rounded-full bg-muted text-xs font-medium
                          text-muted-foreground shrink-0"
              >
                {index + 1}
              </span>
              <IconPlayerPlay
                size={14}
                className="text-muted-foreground shrink-0"
              />
              <span className="flex-1 truncate">{lesson.title}</span>
              {lesson.isFree && (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {t("free")}
                </Badge>
              )}
              <IconChevronRight
                size={14}
                className="text-muted-foreground opacity-0
                           group-hover:opacity-100 transition-opacity shrink-0"
              />
            </button>
          </li>
        ))}
      </ul>
      <div className="pt-2 border-t mt-2">
        <AddLessonDialog
          courseId={courseId}
          sectionId={sectionId}
          variant="ghost"
        />
      </div>
    </div>
  );
}
