"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useConvexMutation } from "@convex-dev/react-query";
import {
  IconCheck,
  IconDots,
  IconEye,
  IconPencil,
  IconShare,
  IconShareOff,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";

export function CoursesTableActions({
  courseId,
  status,
}: {
  courseId: Id<"courses">;
  status: Doc<"courses">["status"];
}) {
  const updateStatusMutation = useMutation({
    mutationFn: useConvexMutation(api.teachers.courses.mutations.updateStatus),
  });

  function handleUpdateStatus() {
    updateStatusMutation.mutate({
      courseId,
      status: status === "draft" ? "published" : "draft",
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <IconDots className="size-4" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <IconEye className="size-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={updateStatusMutation.isPending}
          onClick={handleUpdateStatus}
        >
          {updateStatusMutation.isPending ? (
            <Spinner />
          ) : status === "draft" ? (
            <IconShare />
          ) : (
            <IconShareOff />
          )}
          <span>{status === "draft" ? "Publish" : "Draft"}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <IconTrash className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CourseStatusBadge({
  status,
  courseId,
}: {
  status: Doc<"courses">["status"];
  courseId: Id<"courses">;
}) {
  const updateStatusMutation = useMutation({
    mutationFn: useConvexMutation(api.teachers.courses.mutations.updateStatus),
  });

  function handleUpdateStatus() {
    updateStatusMutation.mutate({
      courseId,
      status: status === "draft" ? "published" : "draft",
    });
  }

  return (
    <Button
      variant={status === "published" ? "success" : "outline"}
      size="xs"
      onClick={handleUpdateStatus}
      disabled={updateStatusMutation.isPending}
    >
      {updateStatusMutation.isPending ? (
        <Spinner />
      ) : status === "published" ? (
        <IconCheck />
      ) : (
        <IconPencil />
      )}
      <span className="capitalize">{status}</span>
    </Button>
  );
}
