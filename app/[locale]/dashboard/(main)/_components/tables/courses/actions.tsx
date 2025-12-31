"use client";

import { useState } from "react";
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
import { EditCourseDialog } from "../../../courses/_components/edit-course-dialog";
import { useCourseSearchParams } from "../../../_hooks/use-course-search-params";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type CourseWithThumbnail = Doc<"courses"> & { thumbnailUrl: string | null };

interface CoursesTableActionsProps {
  course: CourseWithThumbnail;
}

export function CoursesTableActions({ course }: CoursesTableActionsProps) {
  const [, setParams] = useCourseSearchParams();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const updateStatusMutation = useMutation({
    mutationFn: useConvexMutation(api.teachers.courses.mutations.updateStatus),
  });
  function handleUpdateStatus() {
    updateStatusMutation.mutate({
      courseId: course._id,
      status: course.status === "draft" ? "published" : "draft",
    });
  }

  const { props, dismiss } = useDialog();
  const removeCourseMutation = useMutation({
    mutationFn: useConvexMutation(api.teachers.courses.mutations.remove),
    onSettled: dismiss,
  });
  function handleRemoveCourse() {
    removeCourseMutation.mutate({
      courseId: course._id,
    });
  }

  return (
    <>
      <AlertDialog {...props}>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <IconDots className="size-4" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();

                setParams({
                  slug: course.slug,
                });
              }}
            >
              <IconEye className="size-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={updateStatusMutation.isPending}
              onClick={handleUpdateStatus}
            >
              {updateStatusMutation.isPending ? (
                <Spinner />
              ) : course.status === "draft" ? (
                <IconShare />
              ) : (
                <IconShareOff />
              )}
              <span>{course.status === "draft" ? "Publish" : "Draft"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
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

      <EditCourseDialog
        course={course}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}

const MotionButton = motion(Button);

export function CourseStatusButton({
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
    <MotionButton
      variant={status === "published" ? "success" : "outline"}
      size="xs"
      onClick={handleUpdateStatus}
      disabled={updateStatusMutation.isPending}
      initial="initial"
      whileHover="hovered"
      className={cn(
        "relative min-w-24 justify-start overflow-hidden transition-all",
        status !== "published"
          ? "hover:border-success hover:bg-success/20 hover:text-success"
          : "hover:border-destructive hover:bg-destructive/20 hover:text-destructive"
      )}
    >
      {updateStatusMutation.isPending ? (
        <Spinner />
      ) : status === "published" ? (
        <IconCheck />
      ) : (
        <IconPencil />
      )}
      <motion.span
        variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="capitalize"
      >
        {status}
      </motion.span>
      <motion.span
        variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="absolute left-5 capitalize"
      >
        {status === "published" ? "draft" : "publish"}
      </motion.span>
    </MotionButton>
  );
}
