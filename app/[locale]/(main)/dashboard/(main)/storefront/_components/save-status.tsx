"use client";

import { Button } from "@/components/ui/button";
import { useStorefront } from "./builder/storefront-context";
import { IconDeviceFloppy } from "@tabler/icons-react";

export function SaveStatus() {
  const { hasUnsavedChanges, isSaving, saveChanges } = useStorefront();

  return (
    <Button
      size="sm"
      onClick={saveChanges}
      disabled={!hasUnsavedChanges || isSaving}
    >
      <IconDeviceFloppy className="h-4 w-4" />
      {isSaving ? "Saving..." : "Save changes"}
    </Button>
  );
}
