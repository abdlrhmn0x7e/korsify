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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useMutation } from "@tanstack/react-query";
import { useDialog } from "@/hooks/use-dialog";

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

  const { props, dismiss } = useDialog();
  const removeCourseMutation = useMutation({
    mutationFn: useConvexMutation(api.teachers.courses.mutations.remove),
    onSettled: dismiss,
  });
  function handleRemoveCourse() {
    removeCourseMutation.mutate({
      courseId,
    });
  }

  return (
    <AlertDialog {...props}>
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
          <DropdownMenuItem>
            <IconPencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger
            render={<DropdownMenuItem variant="destructive" />}
            nativeButton={false}
          >
            <IconTrash /> Delete
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            course and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemoveCourse}
            disabled={removeCourseMutation.isPending}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
