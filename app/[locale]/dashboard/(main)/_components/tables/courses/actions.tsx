"use client";

import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { IconEye, IconTrash } from "@tabler/icons-react";

export function CoursesTableActions({ id }: { id: Id<"courses"> }) {
  return (
    <div className="space-x-2">
      <Button>
        <IconEye />
      </Button>
      <Button variant="destructive-outline">
        <IconTrash />
      </Button>
    </div>
  );
}
