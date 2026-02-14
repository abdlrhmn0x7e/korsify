"use client";

import { useStorefront } from "../storefront-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { StorefrontSection } from "@/convex/db/storefronts/validators";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

interface CoursesEditorProps {
  section: StorefrontSection & { type: "courses" };
}

export function CoursesEditor({ section }: CoursesEditorProps) {
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input
          value={content.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Our Courses"
        />
      </div>

      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input
          value={content.subtitle ?? ""}
          onChange={(e) =>
            handleChange("subtitle", e.target.value || undefined)
          }
          placeholder="Browse our collection of courses"
        />
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Show Price</Label>
            <p className="text-xs text-muted-foreground">
              Display course prices on cards
            </p>
          </div>
          <Switch
            checked={content.showPrice}
            onCheckedChange={(checked) => handleChange("showPrice", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Show Duration</Label>
            <p className="text-xs text-muted-foreground">
              Display course duration on cards
            </p>
          </div>
          <Switch
            checked={content.showDuration}
            onCheckedChange={(checked) => handleChange("showDuration", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Show View All Link</Label>
            <p className="text-xs text-muted-foreground">
              Display a link to view all courses
            </p>
          </div>
          <Switch
            checked={content.viewAllLink ?? false}
            onCheckedChange={(checked) =>
              handleChange("viewAllLink", checked || undefined)
            }
          />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Label>Course Limit</Label>
        <Input
          type="number"
          min={1}
          max={12}
          value={content.limit ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            handleChange("limit", value ? parseInt(value, 10) : undefined);
          }}
          placeholder="Leave empty to show all"
        />
        <p className="text-xs text-muted-foreground">
          Maximum number of courses to display (1-12)
        </p>
      </div>
    </div>
  );
}
