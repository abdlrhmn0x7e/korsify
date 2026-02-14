"use client";

import { useStorefront } from "../storefront-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CoursesVariant,
  StorefrontSection,
} from "@/convex/db/storefronts/validators";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface CoursesEditorProps {
  section: StorefrontSection & { type: "courses" };
}

const COURSES_TEMPLATE_OPTIONS: Array<{
  value: CoursesVariant;
  label: string;
  description: string;
}> = [
  {
    value: "grid",
    label: "Grid",
    description: "Balanced card layout across multiple columns.",
  },
  {
    value: "list",
    label: "List",
    description: "Detailed stacked rows with more text context.",
  },
  {
    value: "carousel",
    label: "Carousel",
    description: "Horizontal scroll with progress and navigation.",
  },
  {
    value: "featured",
    label: "Featured",
    description: "One highlighted course with secondary supporting cards.",
  },
];

export function CoursesEditor({ section }: CoursesEditorProps) {
  const { updateSection } = useStorefront();
  const teacherCourses = useQuery(api.teachers.courses.queries.getAll) ?? [];
  const [content, setContent] = useState(section.content);
  const variant = section.variant;

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
    setContent((prev) => {
      if (value !== undefined) return { ...prev, [key]: value };

      const next = { ...prev } as Record<string, unknown>;
      delete next[key as string];
      return next as typeof prev;
    });
  }

  function handleTemplateChange(nextVariant: CoursesVariant) {
    updateSection(section.id, { variant: nextVariant });
  }

  function handleCourseToggle(courseId: Id<"courses">, checked: boolean) {
    const selectedCourseIds = new Set(content.selectedCourseIds);
    if (checked) {
      selectedCourseIds.add(courseId);
    } else {
      selectedCourseIds.delete(courseId);
    }

    handleChange("selectedCourseIds", Array.from(selectedCourseIds));
  }

  function handleSelectAllCourses() {
    handleChange(
      "selectedCourseIds",
      teacherCourses.map((course) => course._id)
    );
  }

  function handleClearSelection() {
    handleChange("selectedCourseIds", []);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Template</Label>
        <div className="grid gap-2">
          {COURSES_TEMPLATE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleTemplateChange(option.value)}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-left transition-colors",
                variant === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-muted/40"
              )}
            >
              <p className="text-sm font-medium">{option.label}</p>
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </div>

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
              handleChange("viewAllLink", checked)
            }
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <Label>Displayed Courses</Label>
            <p className="text-xs text-muted-foreground">
              Toggle which courses appear in this section.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAllCourses}
            >
              Select all
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearSelection}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border p-2">
          {teacherCourses.length === 0 && (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              No courses found yet.
            </p>
          )}

          {teacherCourses.map((course) => {
            const isChecked = content.selectedCourseIds.includes(course._id);

            return (
              <div
                key={course._id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{course.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {course.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{course.slug}</p>
                  </div>
                </div>
                <Switch
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleCourseToggle(course._id, checked)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
