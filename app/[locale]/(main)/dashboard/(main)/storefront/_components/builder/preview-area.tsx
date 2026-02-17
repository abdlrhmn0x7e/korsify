"use client";

import { useStorefront } from "./storefront-context";
import { DynamicSection } from "@/components/storefront/sections/dynamic-section";
import { cn } from "@/lib/utils";
import { IconEdit } from "@tabler/icons-react";
import { Navbar } from "@/components/storefront/navbar";
import { TeacherContextProvider } from "@/components/storefront/teacher-context-provider";
import { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  getStorefrontCssVariables,
  resolveStorefrontStyle,
} from "@/lib/storefront-style";

export function PreviewArea() {
  const container = useRef<HTMLDivElement>(null);
  const { storefront, teacher, activeSectionId, setActiveSectionId } =
    useStorefront();
  const courses = useQuery(api.teachers.courses.queries.getAll);

  if (!storefront || !teacher) return null;

  const resolvedStyle = resolveStorefrontStyle(storefront.style);
  const cssVariables = getStorefrontCssVariables({
    primaryColor: teacher.branding?.primaryColor || "#3b82f6",
    style: resolvedStyle,
    cssVariables: storefront.cssVariables,
  });

  return (
    <TeacherContextProvider teacher={teacher}>
      <div
        className="storefront-shell h-full bg-background"
        style={cssVariables as React.CSSProperties}
      >
        <ScrollArea
          className="h-full overflow-y-auto bg-background"
          viewportRef={container}
        >
          <Navbar className="pointer-events-none" container={container} />
          <div className="flex flex-col gap-(--storefront-section-gap,1rem)">
            {storefront.sections
              .filter((s) => s.visible)
              .map((section) => (
                <div
                  key={section.id}
                  className={cn(
                    "storefront-section relative group transition-all",
                    activeSectionId === section.id &&
                      "ring-2 ring-primary ring-inset z-10"
                  )}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 border-transparent group-hover:border-primary/20",
                      activeSectionId === section.id &&
                        "opacity-100 border-none bg-transparent"
                    )}
                  />

                  <div
                    className={cn(
                      "absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20 flex items-center gap-1",
                      activeSectionId === section.id && "opacity-100"
                    )}
                  >
                    <IconEdit className="w-3 h-3" />
                    {activeSectionId === section.id
                      ? "Editing"
                      : "Click to edit"}
                  </div>

                  <div
                    className={cn(
                      section.type === "hero" && section.variant === "video"
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                    )}
                  >
                    <DynamicSection
                      section={section}
                      courses={courses ?? []}
                      isBuilderPreview
                    />
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>
    </TeacherContextProvider>
  );
}
