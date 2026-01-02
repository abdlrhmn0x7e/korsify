"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { IconSettings } from "@tabler/icons-react";
import { SettingsForm } from "./form";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { toast } from "sonner";
import { SettingsFormValues } from "./types";
import { Spinner } from "@/components/ui/spinner";
import { useDialog } from "@/hooks/use-dialog";

export function SettingsDialog() {
  const dialog = useDialog();
  const teacher = useQuery(api.teachers.queries.getTeacher);
  const updateTeacher = useMutation({
    mutationFn: useConvexMutation(api.teachers.mutations.update),
    onSuccess: () => {
      toast.success("Settings updated", {
        description: "Your settings have been updated successfully.",
      });
      dialog.dismiss();
    },
    onError: (error) => {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to update settings",
      });
    },
  });

  function onSubmit(values: SettingsFormValues) {
    updateTeacher.mutate(values);
  }

  return (
    <Dialog {...dialog.props}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="w-full justify-start" />
        }
      >
        <IconSettings />
        Settings
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="h-96">
          {teacher && <SettingsForm teacher={teacher} onSubmit={onSubmit} />}
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>

          <Button
            type="submit"
            form="settings-form"
            disabled={updateTeacher.isPending}
            className="w-24"
          >
            {updateTeacher.isPending ? <Spinner /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
