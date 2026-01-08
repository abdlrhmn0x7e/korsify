"use client";

import { useStorefront } from "./storefront-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DynamicSection } from "@/app/[locale]/storefront/[subdomain]/_components/sections/dynamic-section";
import { cn } from "@/lib/utils";
import { Edit2 } from "lucide-react";

export function PreviewArea() {
  const { storefront, activeSectionId, setActiveSectionId } = useStorefront();

  if (!storefront) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="bg-background border-b px-4 py-2 flex justify-between items-center text-xs text-muted-foreground">
        <span>Live Preview</span>
        <div className="flex gap-2">
          <span>Desktop</span>
          <span>Tablet</span>
          <span>Mobile</span>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-white">
        <div className="min-h-full">
          {storefront.sections
            .filter((s: any) => s.visible)
            .map((section: any) => (
              <div 
                key={section.id}
                className={cn(
                  "relative group transition-all",
                  activeSectionId === section.id && "ring-2 ring-primary ring-inset z-10"
                )}
                onClick={() => setActiveSectionId(section.id)}
              >
                <div className={cn(
                  "absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 border-transparent group-hover:border-primary/20",
                  activeSectionId === section.id && "opacity-100 border-none bg-transparent"
                )} />

                <div className={cn(
                  "absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20 flex items-center gap-1",
                  activeSectionId === section.id && "opacity-100"
                )}>
                  <Edit2 className="w-3 h-3" />
                  {activeSectionId === section.id ? "Editing" : "Click to edit"}
                </div>

                <div className="pointer-events-none">
                  <DynamicSection 
                    section={section} 
                    courses={[]}
                  />
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
