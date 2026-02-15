"use client";

import { useStorefront } from "../storefront-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  CoursesVariant,
  StorefrontSection,
} from "@/convex/db/storefronts/validators";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

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
  const publishedCoursesQuery = useQuery(
    api.teachers.courses.queries.listPublishedLite
  );
  const publishedCourses = publishedCoursesQuery ?? [];
  const content = section.content;
  const variant = section.variant;
  const selectedCourses = publishedCourses.filter((course) =>
    content.selectedCourseIds.includes(course._id)
  );

  function handleChange<K extends keyof typeof content>(
    key: K,
    value: (typeof content)[K]
  ) {
    const next = { ...content } as Record<string, unknown>;
    if (value !== undefined) {
      next[key as string] = value;
    } else {
      delete next[key as string];
    }
    updateSection(section.id, { content: next as typeof content });
  }

  function handleTemplateChange(nextVariant: CoursesVariant) {
    updateSection(section.id, { variant: nextVariant });
  }

  function handleSelectAllCourses() {
    handleChange(
      "selectedCourseIds",
      publishedCourses.map((course) => course._id)
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
            onCheckedChange={(checked) => handleChange("viewAllLink", checked)}
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

        <Combobox
          multiple
          items={publishedCourses}
          value={selectedCourses}
          itemToStringLabel={(course) => course.title}
          isItemEqualToValue={(course, selected) => course._id === selected._id}
          onValueChange={(value) => {
            const nextSelected = Array.isArray(value) ? value : [];
            handleChange(
              "selectedCourseIds",
              nextSelected.map((course) => course._id)
            );
          }}
        >
          <ComboboxChips className="w-full">
            {selectedCourses.map((course) => (
              <ComboboxChip key={course._id}>{course.title}</ComboboxChip>
            ))}
            <ComboboxChipsInput
              placeholder={
                publishedCoursesQuery === undefined
                  ? "Loading published courses..."
                  : "Search published courses"
              }
              disabled={publishedCoursesQuery === undefined}
            />
          </ComboboxChips>
          <ComboboxContent align="center" className="w-full">
            <ComboboxEmpty>No published courses found.</ComboboxEmpty>
            <ComboboxList>
              {(course) => (
                <ComboboxItem key={course._id} value={course}>
                  <span className="truncate">{course.title}</span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  );
}
