"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { StorefrontProvider, useStorefront } from "./storefront-context";
import { BuilderLayout } from "./builder-layout";
import { Button } from "@/components/ui/button";
import { ExternalLink, Save, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface StorefrontBuilderProps {
  teacher: Doc<"teachers">;
}

function BuilderHeader({ teacher }: { teacher: Doc<"teachers"> }) {
  const { hasUnsavedChanges, isSaving } = useStorefront();

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Storefront Builder</h1>
        <p className="text-muted-foreground text-sm">
          Customize your storefront appearance and content
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          render={
            <a 
              href={`http://${teacher.subdomain}.localhost:3000`} 
              target="_blank" 
              rel="noopener noreferrer"
            />
          }
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Live
        </Button>
      </div>
    </div>
  );
}

function SaveStatus() {
  const { hasUnsavedChanges, isSaving } = useStorefront();
  
  if (isSaving) {
    return (
      <div className="flex items-center text-xs text-muted-foreground">
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        Saving...
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className="flex items-center text-xs text-yellow-600">
        <div className="mr-1 h-2 w-2 rounded-full bg-yellow-600" />
        Unsaved changes
      </div>
    );
  }

  return (
    <div className="flex items-center text-xs text-green-600">
      <Check className="mr-1 h-3 w-3" />
      All changes saved
    </div>
  );
}

export function StorefrontBuilder({ teacher }: StorefrontBuilderProps) {
  return (
    <StorefrontProvider>
      <div className="flex flex-col h-[calc(100vh-2rem)] gap-4">
        <BuilderHeader teacher={teacher} />
        <div className="flex justify-end px-4">
          <SaveStatus />
        </div>
        <BuilderLayout />
      </div>
    </StorefrontProvider>
  );
}
