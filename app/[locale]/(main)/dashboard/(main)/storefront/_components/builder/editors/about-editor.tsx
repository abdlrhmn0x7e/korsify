"use client";

import { useStorefront } from "../storefront-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { StorefrontSection, StatItem } from "@/convex/db/storefronts/validators";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { IconPlus, IconTrash } from "@tabler/icons-react";

interface AboutEditorProps {
  section: StorefrontSection & { type: "about" };
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function AboutEditor({ section }: AboutEditorProps) {
  const { updateSection } = useStorefront();
  const [content, setContent] = useState(section.content);

  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    if (JSON.stringify(debouncedContent) !== JSON.stringify(section.content)) {
      updateSection(section.id, { content: debouncedContent });
    }
  }, [debouncedContent, section.id, section.content, updateSection]);

  function handleChange<K extends keyof typeof content>(
    key: K,
    value: (typeof content)[K]
  ) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  function handleAddStat() {
    const newStat: StatItem = {
      id: generateId(),
      value: "0",
      label: "New Stat",
    };
    const currentStats = content.stats ?? [];
    handleChange("stats", [...currentStats, newStat]);
  }

  function handleUpdateStat(
    id: string,
    field: keyof Omit<StatItem, "id">,
    value: string
  ) {
    const currentStats = content.stats ?? [];
    const updatedStats = currentStats.map((stat) =>
      stat.id === id ? { ...stat, [field]: value } : stat
    );
    handleChange("stats", updatedStats);
  }

  function handleRemoveStat(id: string) {
    const currentStats = content.stats ?? [];
    const filteredStats = currentStats.filter((stat) => stat.id !== id);
    handleChange("stats", filteredStats.length > 0 ? filteredStats : undefined);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input
          value={content.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="About Me"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={content.description ?? ""}
          onChange={(e) =>
            handleChange("description", e.target.value || undefined)
          }
          placeholder="Tell your students about yourself..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Profile Image</Label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
          <p>Click to upload image</p>
          <p className="text-xs mt-1">Recommended: 400x400px</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="space-y-0.5">
          <Label>Show Statistics</Label>
          <p className="text-xs text-muted-foreground">
            Display stats like students, courses, etc.
          </p>
        </div>
        <Switch
          checked={content.showStats}
          onCheckedChange={(checked) => handleChange("showStats", checked)}
        />
      </div>

      {content.showStats && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label>Statistics</Label>
            <Button variant="outline" size="sm" onClick={handleAddStat}>
              <IconPlus className="h-4 w-4 mr-1" />
              Add Stat
            </Button>
          </div>

          {(content.stats ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No statistics added yet. Click "Add Stat" to create one.
            </p>
          )}

          {(content.stats ?? []).map((stat) => (
            <div
              key={stat.id}
              className="flex items-start gap-2 p-3 border rounded-lg bg-muted/30"
            >
              <div className="flex-1 space-y-2">
                <Input
                  value={stat.value}
                  onChange={(e) =>
                    handleUpdateStat(stat.id, "value", e.target.value)
                  }
                  placeholder="100+"
                  className="h-8"
                />
                <Input
                  value={stat.label}
                  onChange={(e) =>
                    handleUpdateStat(stat.id, "label", e.target.value)
                  }
                  placeholder="Students"
                  className="h-8"
                />
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:bg-destructive/10 shrink-0"
                onClick={() => handleRemoveStat(stat.id)}
              >
                <IconTrash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
