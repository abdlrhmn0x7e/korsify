"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useStorefront } from "./storefront-context";
import { Button } from "@/components/ui/button";
import { StorefrontSection } from "@/convex/db/storefronts/validators";
import { HeroEditor } from "./editors/hero-editor";
import { CoursesEditor } from "./editors/courses-editor";
import { AboutEditor } from "./editors/about-editor";
import { TestimonialsEditor } from "./editors/testimonials-editor";
import { FaqEditor } from "./editors/faq-editor";
import { CtaEditor } from "./editors/cta-editor";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  IconBorderCorners,
  IconEye,
  IconEyeOff,
  IconGripVertical,
  IconLayoutSidebar,
  IconPalette,
  IconPlug,
  IconTrash,
  IconTypeface,
} from "@tabler/icons-react";
import { DirectedArrow } from "@/components/directed-arrow";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface BuilderSidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
}

const BuilderSidebarContext = createContext<BuilderSidebarContextType | null>(
  null
);

export function useBuilderSidebar() {
  const context = useContext(BuilderSidebarContext);
  if (!context) {
    throw new Error(
      "useBuilderSidebar must be used within a BuilderSidebarProvider"
    );
  }
  return context;
}

export function BuilderSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <BuilderSidebarContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      {children}
    </BuilderSidebarContext.Provider>
  );
}

function SectionListView() {
  const {
    storefront,
    setActiveSectionId,
    toggleSectionVisibility,
    removeSection,
  } = useStorefront();

  return (
    <div className="flex flex-col h-full">
      <div className="h-12 border-b px-3 py-1 bg-background flex items-center gap-2 shrink-0">
        <IconBorderCorners className="size-4" />
        <span className="text-sm font-medium">Sections</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {storefront?.sections.map((section) => (
            <div
              key={section.id}
              className={cn(
                "group flex items-center gap-2 p-3 rounded-lg border bg-card transition-colors hover:border-primary/50 cursor-pointer"
              )}
              onClick={() => setActiveSectionId(section.id)}
            >
              <div className="cursor-grab text-muted-foreground hover:text-foreground">
                <IconGripVertical className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm capitalize truncate">
                  {section.type} Section
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {section.variant || "Default"}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSectionVisibility(section.id, !section.visible);
                  }}
                >
                  {section.visible ? (
                    <IconEye className="h-3.5 w-3.5" />
                  ) : (
                    <IconEyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSection(section.id);
                  }}
                >
                  <IconTrash className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            className="w-full"
            onClick={() => setActiveSectionId("add-new")}
          >
            <IconPlug />
            Add Section
          </Button>
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background shrink-0 space-y-2">
        <h3 className="font-semibold text-sm mb-2">Global Settings</h3>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <IconPalette />
          Theme & Colors
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <IconTypeface />
          Typography
        </Button>
      </div>
    </div>
  );
}

function AddSectionView() {
  const { addSection, setActiveSectionId } = useStorefront();

  return (
    <div className="flex flex-col h-full">
      <div className="h-12 border-b px-2 flex items-center gap-2 bg-background shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActiveSectionId(null)}
        >
          <DirectedArrow inverse />
        </Button>
        <span className="font-semibold">Add Section</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 grid gap-2">
          {(
            ["hero", "courses", "about", "testimonials", "faq", "cta"] as const
          ).map((type) => (
            <Button
              key={type}
              variant="outline"
              className="justify-start capitalize"
              onClick={() => {
                addSection(type, "default");
                setActiveSectionId(null);
              }}
            >
              {type}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function SectionEditorView({ section }: { section: StorefrontSection }) {
  const { setActiveSectionId, removeSection } = useStorefront();

  return (
    <div className="flex flex-col h-full">
      <div className="h-12 px-2 py-1 border-b flex items-center justify-between bg-background shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setActiveSectionId(null)}
          >
            <DirectedArrow inverse />
          </Button>
          <span className="text-sm capitalize">{section.type}</span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => removeSection(section.id)}
        >
          <IconTrash />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {section.type === "hero" && <HeroEditor section={section} />}
          {section.type === "courses" && <CoursesEditor section={section} />}
          {section.type === "about" && <AboutEditor section={section} />}
          {section.type === "testimonials" && (
            <TestimonialsEditor section={section} />
          )}
          {section.type === "faq" && <FaqEditor section={section} />}
          {section.type === "cta" && <CtaEditor section={section} />}
        </div>
      </ScrollArea>
    </div>
  );
}

function BuilderSidebarContent() {
  const { storefront, activeSectionId } = useStorefront();

  if (!storefront) return null;

  const activeSection = storefront.sections.find(
    (s: StorefrontSection) => s.id === activeSectionId
  );

  if (activeSectionId === "add-new") {
    return <AddSectionView />;
  }

  if (activeSection) {
    return <SectionEditorView section={activeSection} />;
  }

  return <SectionListView />;
}

function DesktopSidebar() {
  const { isOpen } = useBuilderSidebar();

  return (
    <div
      className={cn(
        "hidden sm:block h-full bg-background border-s transition-[width] duration-200 ease-in-out overflow-hidden",
        isOpen ? "w-80" : "w-0"
      )}
    >
      <div className="w-80 h-full">
        <BuilderSidebarContent />
      </div>
    </div>
  );
}

function MobileSidebar() {
  const { isOpen, setIsOpen } = useBuilderSidebar();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-80 p-0" showCloseButton={false}>
        <SheetHeader className="sr-only">
          <SheetTitle>Customization Panel</SheetTitle>
          <SheetDescription>
            Customize your storefront sections
          </SheetDescription>
        </SheetHeader>
        <BuilderSidebarContent />
      </SheetContent>
    </Sheet>
  );
}

export function BuilderSidebarTrigger({ className }: { className?: string }) {
  const { isOpen, toggle } = useBuilderSidebar();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      className={cn("shrink-0", className)}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      <IconLayoutSidebar />
    </Button>
  );
}

export function BuilderSidebar() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileSidebar />;
  }

  return <DesktopSidebar />;
}
