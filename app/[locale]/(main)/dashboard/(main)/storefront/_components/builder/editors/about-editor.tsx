"use client";

import { useStorefront } from "../storefront-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AboutVariant,
  StorefrontSection,
  StatItem,
} from "@/convex/db/storefronts/validators";
import { useDebounce } from "@/hooks/use-debounce";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { IconPhoto, IconPlus, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useUploadFile } from "@/hooks/use-upload-file";
import { Id } from "@/convex/_generated/dataModel";
import { LazyStorageImage } from "@/components/lazy-storage-image";
import { toast } from "sonner";

interface AboutEditorProps {
  section: StorefrontSection & { type: "about" };
}

const ABOUT_TEMPLATE_OPTIONS: Array<{
  value: AboutVariant;
  label: string;
  description: string;
}> = [
  {
    value: "side-by-side",
    label: "Side by Side",
    description: "Two-column layout with text and a supporting profile image.",
  },
  {
    value: "centered",
    label: "Centered",
    description: "Centered profile block with optional avatar and intro text.",
  },
  {
    value: "stats-focus",
    label: "Stats Focus",
    description: "High-impact numbers-first section on a strong background.",
  },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

interface AboutImageUploaderProps {
  storageId: Id<"_storage"> | undefined;
  onChange: (storageId: Id<"_storage"> | undefined) => void;
}

function AboutImageUploader({ storageId, onChange }: AboutImageUploaderProps) {
  const { upload, isUploading } = useUploadFile({
    onError: (error) => toast.error(error.message),
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedStorageId = await upload(file);
    if (!uploadedStorageId) return;

    onChange(uploadedStorageId as Id<"_storage">);
    toast.success("Image uploaded");
    event.target.value = "";
  }

  return (
    <div className="space-y-2">
      <Label>Profile Image</Label>
      <div className="space-y-3 rounded-lg border p-3">
        <div className="aspect-square overflow-hidden rounded-md border bg-muted/30">
          {storageId ? (
            <LazyStorageImage
              storageId={storageId}
              alt="Profile image"
              className="h-full w-full object-cover"
              fallback={
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  Image unavailable
                </div>
              }
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <IconPhoto className="size-5" />
              <p>No image selected</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading
              ? "Uploading..."
              : storageId
                ? "Change image"
                : "Upload image"}
          </Button>

          {storageId && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(undefined)}
            >
              <IconTrash className="size-4" />
              Remove
            </Button>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Recommended: square image (400x400px or larger).
      </p>
    </div>
  );
}

export function AboutEditor({ section }: AboutEditorProps) {
  const { updateSection } = useStorefront();
  const [content, setContent] = useState(section.content);
  const variant = section.variant;

  const debouncedContent = useDebounce(content, 500);
  const canShowDescription =
    variant === "side-by-side" || variant === "centered";
  const canShowImage = variant === "side-by-side" || variant === "centered";
  const canToggleStats = variant === "side-by-side" || variant === "centered";
  const shouldShowStatsEditor = variant === "stats-focus" || content.showStats;

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

  function handleTemplateChange(nextVariant: AboutVariant) {
    const nextContent =
      nextVariant === "stats-focus" ? { ...content, showStats: true } : content;

    setContent(nextContent);
    updateSection(section.id, {
      variant: nextVariant,
      content: nextVariant === "stats-focus" ? nextContent : undefined,
    });
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
        <Label>Template</Label>
        <div className="grid gap-2">
          {ABOUT_TEMPLATE_OPTIONS.map((option) => (
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
          placeholder="About Me"
        />
      </div>

      {canShowDescription && (
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
      )}

      {canShowImage && (
        <AboutImageUploader
          storageId={content.imageStorageId}
          onChange={(storageId) => {
            handleChange("imageStorageId", storageId);

            if (storageId === undefined) {
              updateSection(section.id, {
                content: {
                  imageStorageId: null,
                } as unknown as typeof section.content,
              });
            }
          }}
        />
      )}

      {canToggleStats && (
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <Label>Show Statistics</Label>
            <p className="text-xs text-muted-foreground">
              Display stats like students, courses, and outcomes.
            </p>
          </div>
          <Switch
            checked={content.showStats}
            onCheckedChange={(checked) => handleChange("showStats", checked)}
          />
        </div>
      )}

      {variant === "stats-focus" && (
        <p className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          This template is built around statistics, so stats are always shown.
        </p>
      )}

      {shouldShowStatsEditor && (
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
              No statistics added yet. Click &quot;Add Stat&quot; to create one.
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
