"use client";

import { useStorefront } from "./storefront-context";
import { Sidebar } from "./sidebar";
import { PreviewArea } from "./preview-area";
import { Loader2 } from "lucide-react";

export function BuilderLayout() {
  const { isLoading } = useStorefront();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] border rounded-lg overflow-hidden bg-background">
      <div className="w-80 border-r bg-muted/10 shrink-0 overflow-y-auto">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-hidden relative bg-gray-100 dark:bg-gray-900">
        <PreviewArea />
      </div>
    </div>
  );
}
