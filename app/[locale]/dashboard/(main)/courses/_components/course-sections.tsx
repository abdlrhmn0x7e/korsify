import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  IconCheck,
  IconChevronsDown,
  IconDeviceFloppy,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

export function CourseSections({ courseId }: { courseId: Id<"courses"> }) {
  const sections = useQuery(api.teachers.sections.queries.getByCourseId, {
    courseId,
  });

  const addSectionMutation = useMutation({
    mutationFn: useConvexMutation(api.teachers.sections.mutations.create),
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">Sections</p>
        <Button
          disabled={addSectionMutation.isPending}
          onClick={() => {
            addSectionMutation.mutate({
              courseId,
              title: "New Section",
            });
          }}
        >
          Add Section{" "}
          {addSectionMutation.isPending ? <Spinner /> : <IconPlus />}
        </Button>
      </div>

      {sections ? (
        sections.map((section) => (
          <SectionAccordion section={section} key={section._id} />
        ))
      ) : (
        <p className="text-center text-muted-foreground text-sm">
          No sections yet.
        </p>
      )}
    </div>
  );
}

function SectionAccordion({ section }: { section: Doc<"sections"> }) {
  const [isEditing, setIsEditing] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const updateSectionMutation = useMutation({
    mutationFn: useConvexMutation(api.teachers.sections.mutations.update),
    onSettled: () => {
      setIsEditing(false);
    },
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
  }

  function handleEdit() {
    if (isEditing) {
      exitEditing();
    } else {
      setIsEditing(true);
    }
  }

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
    }
  }, [isEditing]);

  const updateStatusMutation = useMutation({
    mutationFn: useConvexMutation(api.teachers.sections.mutations.updateStatus),
  });

  function handleUpdateStatus() {
    updateStatusMutation.mutate({
      sectionId: section._id,
      status: section.status === "draft" ? "published" : "draft",
    });
  }

  return (
    <Collapsible className="flex w-full flex-col gap-2 group/collapsible">
      <div className="text-sm [&:hover:not(:has(button:hover))]:bg-muted py-1 px-2 rounded-sm flex items-center justify-between">
        <CollapsibleTrigger
          className="flex-1"
          render={<div />}
          nativeButton={false}
        >
          {isEditing ? (
            <input
              defaultValue={section.title}
              ref={titleInputRef}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              disabled={updateSectionMutation.isPending}
              className="bg-transparent outline-none border-b focus:border-primary"
            />
          ) : (
            <span>{section.title}</span>
          )}
        </CollapsibleTrigger>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="xs"
            disabled={updateSectionMutation.isPending}
            onClick={handleEdit}
          >
            {isEditing ? (
              updateSectionMutation.isPending ? (
                <Spinner />
              ) : (
                <IconDeviceFloppy />
              )
            ) : (
              <IconPencil />
            )}
          </Button>

          <Button
            variant={section.status === "published" ? "success" : "outline"}
            size="xs"
            onClick={handleUpdateStatus}
            disabled={updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending ? (
              <Spinner />
            ) : section.status === "published" ? (
              <IconCheck />
            ) : (
              <IconPencil />
            )}
            <span className="capitalize">{section.status}</span>
          </Button>
          <CollapsibleTrigger>
            <IconChevronsDown
              size={16}
              className="transition-transform text-muted-foreground group-data-open/collapsible:rotate-180"
            />
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>lessons w bta3</CollapsibleContent>
    </Collapsible>
  );
}
