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
  IconDotsVertical,
  IconPencil,
  IconPlus,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconFileDescription,
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
import { WholePageSpinner } from "@/components/whole-page-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CourseSections({ courseId }: { courseId: Id<"courses"> }) {
  const sections = useQuery(api.teachers.sections.queries.getByCourseId, {
    courseId,
  });
  const isPending = sections === undefined;

  return (
    <Card className="gap-0 p-4">
      <CardHeader className="p-0">
        <div className="ms-1 flex items-center justify-between">
          <CardTitle>Sections</CardTitle>
          <CreateSectionButton courseId={courseId} />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isPending && <WholePageSpinner />}
        {sections &&
          (sections.length > 0 ? (
            <Accordion>
              {sections.map((section) => (
                <SectionAccordionItem section={section} key={section._id} />
              ))}
            </Accordion>
          ) : (
            <Empty className="mb-12">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-12">
                  <IconBookOff className="size-6" />
                </EmptyMedia>
                <EmptyTitle>No Section Yet</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <CreateSectionButton courseId={courseId} variant="outline" />
              </EmptyContent>
            </Empty>
          ))}
      </CardContent>
    </Card>
  );
}

function CreateSectionButton({
  courseId,
  variant = "default",
}: {
  courseId: Id<"courses">;
  variant?: "default" | "outline";
}) {
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
          title: "New Section",
        });
      }}
    >
      {addSectionMutation.isPending ? <Spinner /> : <IconPlus />}
      Add Section{" "}
    </Button>
  );
}

function SectionAccordionItem({ section }: { section: Doc<"sections"> }) {
  const [isEditing, setIsEditing] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

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
            {section.status === "published" ? "Published" : "Draft"}
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
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleUpdateStatus}>
                {section.status === "published" ? (
                  <>
                    <IconEyeOff />
                    Unpublish
                  </>
                ) : (
                  <>
                    <IconEye />
                    Publish
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                <IconTrash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <IconChevronDown
            size={16}
            className="transition-transform text-muted-foreground group-data-[open]/accordion-item:rotate-180"
          />
        </div>
      </AccordionHeader>

      <AccordionContent className="pl-4">
        {lessons === undefined ? (
          <div className="py-4 flex justify-center">
            <Spinner />
          </div>
        ) : lessonsCount > 0 ? (
          <div className="space-y-1">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="flex items-center gap-2 py-1 px-2 text-sm text-muted-foreground hover:bg-muted rounded-sm"
              >
                <IconFileDescription size={16} />
                <span>{lesson.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <Empty className="py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="size-10">
                <IconFileDescription className="size-5" />
              </EmptyMedia>
              <EmptyTitle className="text-base">No Lessons Yet</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
