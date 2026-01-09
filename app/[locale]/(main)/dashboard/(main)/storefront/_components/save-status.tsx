"use client";

import { Spinner } from "@/components/ui/spinner";
import { useStorefront } from "./builder/storefront-context";
import { IconCheck } from "@tabler/icons-react";

export function SaveStatus() {
  const { hasUnsavedChanges, isSaving } = useStorefront();

  if (isSaving) {
    return (
      <div className="sm:flex items-center text-xs text-muted-foreground hidden">
        <Spinner />
        Saving...
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className="hidden sm:flex items-center text-xs text-yellow-600">
        <div className="mr-1 h-2 w-2 rounded-full bg-yellow-600" />
        Unsaved changes
      </div>
    );
  }

  return (
    <div className="hidden sm:flex items-center text-xs text-green-600">
      <IconCheck className="mr-1 h-3 w-3" />
      All changes saved
    </div>
  );
}
