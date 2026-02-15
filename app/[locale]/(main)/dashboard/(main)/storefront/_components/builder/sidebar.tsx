"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useStorefront } from "./storefront-context";
import { Button } from "@/components/ui/button";
import {
  defaultSectionVariant,
  StorefrontSection,
} from "@/convex/db/storefronts/validators";
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
  IconAlertTriangle,
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
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    reorderSections,
  } = useStorefront();

  const sectionIds = useMemo(
    () => storefront?.sections.map((section) => section.id) ?? [],
    [storefront?.sections]
  );

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!storefront || !over || active.id === over.id) {
      return;
    }

    const activeIndex = storefront.sections.findIndex(
      (section) => section.id === active.id
    );
    const overIndex = storefront.sections.findIndex(
      (section) => section.id === over.id
    );

    if (activeIndex === -1 || overIndex === -1) {
      return;
    }

    const newSectionIds = arrayMove(sectionIds, activeIndex, overIndex);
    reorderSections(newSectionIds);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="h-12 border-b px-3 py-1 bg-background flex items-center gap-2 shrink-0">
        <IconBorderCorners className="size-4" />
        <span className="text-sm font-medium">Sections</span>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="p-2 space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sectionIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {storefront?.sections.map((section) => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    onClick={() => setActiveSectionId(section.id)}
                    onToggleVisibility={() =>
                      toggleSectionVisibility(section.id, !section.visible)
                    }
                    onDelete={() => removeSection(section.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

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
    <div className="flex h-full min-h-0 flex-col">
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

      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4 grid gap-2">
          {(
            ["hero", "courses", "about", "testimonials", "faq", "cta"] as const
          ).map((type) => (
            <Button
              key={type}
              variant="outline"
              className="justify-start capitalize"
              onClick={() => {
                addSection(type, defaultSectionVariant[type]);
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

function SortableSectionItem({
  section,
  onClick,
  onToggleVisibility,
  onDelete,
}: {
  section: StorefrontSection;
  onClick: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={cn(
          "group flex items-center gap-2 p-3 rounded-lg border bg-card transition-colors hover:border-primary/50 cursor-pointer"
        )}
        onClick={onClick}
      >
        <Button
          variant="ghost"
          size="icon-xs"
          className="cursor-grab text-muted-foreground hover:text-foreground"
          {...listeners}
          {...attributes}
          onClick={(event) => event.stopPropagation()}
        >
          <IconGripVertical className="h-4 w-4" />
        </Button>

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
            onClick={(event) => {
              event.stopPropagation();
              onToggleVisibility();
            }}
          >
            {section.visible ? (
              <IconEye className="h-3.5 w-3.5" />
            ) : (
              <IconEyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="hover:text-destructive hover:bg-destructive/10"
                  onClick={(event) => event.stopPropagation()}
                />
              }
            >
              <IconTrash className="h-3.5 w-3.5" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <IconAlertTriangle className="text-destructive" />
                </AlertDialogMedia>
                <AlertDialogTitle>Remove section?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove the section from your storefront draft. You
                  can add it back later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={onDelete}>
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function SectionEditorView({ section }: { section: StorefrontSection }) {
  const { setActiveSectionId, removeSection } = useStorefront();

  return (
    <div className="flex h-full min-h-0 flex-col">
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
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:bg-destructive/10"
              />
            }
          >
            <IconTrash />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia>
                <IconAlertTriangle className="text-destructive" />
              </AlertDialogMedia>
              <AlertDialogTitle>Remove section?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the section from your storefront draft. You can
                add it back later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => removeSection(section.id)}
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ScrollArea className="h-[calc(100vh-10rem)]">
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

  return (
    <div className="flex h-full min-h-0 flex-col">
      {activeSectionId === "add-new" ? (
        <AddSectionView />
      ) : activeSection ? (
        <SectionEditorView section={activeSection} />
      ) : (
        <SectionListView />
      )}
    </div>
  );
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
      <div className="flex h-full min-h-0 w-80 flex-col">
        <BuilderSidebarContent />
      </div>
    </div>
  );
}

function MobileSidebar() {
  const { isOpen, setIsOpen } = useBuilderSidebar();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="flex h-full min-h-0 w-80 flex-col p-0"
        showCloseButton={false}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Customization Panel</SheetTitle>
          <SheetDescription>
            Customize your storefront sections
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1">
          <BuilderSidebarContent />
        </div>
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
