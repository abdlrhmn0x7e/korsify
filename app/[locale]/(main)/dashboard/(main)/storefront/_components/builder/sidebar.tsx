"use client";

import { useStorefront } from "./storefront-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Trash2, GripVertical, Plus, Eye, EyeOff, Palette, Type } from "lucide-react";
import { StorefrontSection } from "@/convex/db/storefronts/validators";
import { HeroEditor } from "./editors/hero-editor";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

function SectionListView() {
    const { 
        storefront, 
        setActiveSectionId, 
        toggleSectionVisibility,
        removeSection
    } = useStorefront();

    return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-background">
        <h2 className="font-semibold mb-1">Page Sections</h2>
        <p className="text-xs text-muted-foreground">
          Drag to reorder, click to edit
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {storefront.sections.map((section: any) => (
            <div
              key={section.id}
              className={cn(
                "group flex items-center gap-2 p-3 rounded-lg border bg-card transition-colors hover:border-primary/50 cursor-pointer"
              )}
              onClick={() => setActiveSectionId(section.id)}
            >
              <div className="cursor-grab text-muted-foreground hover:text-foreground">
                <GripVertical className="h-4 w-4" />
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
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
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
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}

          <Button 
            variant="outline" 
            className="w-full border-dashed"
            onClick={() => setActiveSectionId("add-new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background mt-auto space-y-2">
        <h3 className="font-semibold text-sm mb-2">Global Settings</h3>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Palette className="mr-2 h-4 w-4" />
          Theme & Colors
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Type className="mr-2 h-4 w-4" />
          Typography
        </Button>
      </div>
    </div>
    );
}

export function Sidebar() {
  const { 
    storefront, 
    activeSectionId, 
    setActiveSectionId, 
    removeSection,
    addSection,
  } = useStorefront();

  if (!storefront) return null;

  const activeSection = storefront.sections.find((s: StorefrontSection) => s.id === activeSectionId);

  if (activeSectionId === "add-new") {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setActiveSectionId(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold">Add Section</span>
        </div>
        <div className="p-4 grid gap-2">
          {["hero", "courses", "about", "testimonials", "faq", "cta"].map((type) => (
            <Button 
              key={type} 
              variant="outline" 
              className="justify-start capitalize"
              onClick={() => {
                addSection(type as any, "default");
                setActiveSectionId(null);
              }}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (activeSection) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex items-center justify-between bg-background z-10">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setActiveSectionId(null)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold capitalize">{activeSection.type}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:bg-destructive/10"
            onClick={() => removeSection(activeSection.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
           {activeSection.type === "hero" && <HeroEditor section={activeSection} />}
           {activeSection.type !== "hero" && (
             <div className="text-center text-muted-foreground py-8">
               Editor for {activeSection.type} coming soon
             </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <SectionListView /> 
  );
}
