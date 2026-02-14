"use client";

import { useStorefront } from "../storefront-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  HeroVariant,
  StorefrontSection,
} from "@/convex/db/storefronts/validators";
import { useDebounce } from "@/hooks/use-debounce";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useUploadFile } from "@/hooks/use-upload-file";
import { Id } from "@/convex/_generated/dataModel";
import { LazyStorageImage } from "@/components/lazy-storage-image";
import { IconPhoto, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

interface HeroEditorProps {
  section: StorefrontSection & { type: "hero" };
}

const HERO_TEMPLATE_OPTIONS: Array<{
  value: HeroVariant;
  label: string;
  description: string;
}> = [
  {
    value: "centered",
    label: "Centered",
    description: "Classic centered heading with optional background image",
  },
  {
    value: "split",
    label: "Split",
    description: "Two-column layout with text and supporting image",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Compact simple hero focused on text and one CTA",
  },
  {
    value: "video",
    label: "Video",
    description: "Split layout with play button and YouTube video modal",
  },
];

interface HeroImageUploaderProps {
  label: string;
  helperText: string;
  storageId: Id<"_storage"> | undefined;
  previewClassName: string;
  onChange: (storageId: Id<"_storage"> | undefined) => void;
}

function HeroImageUploader({
  label,
  helperText,
  storageId,
  previewClassName,
  onChange,
}: HeroImageUploaderProps) {
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
      <Label>{label}</Label>
      <div className="space-y-3 rounded-lg border p-3">
        <div className={cn("overflow-hidden rounded-md border bg-muted/30", previewClassName)}>
          {storageId ? (
            <LazyStorageImage
              storageId={storageId}
              alt={label}
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
            {isUploading ? "Uploading..." : storageId ? "Change image" : "Upload image"}
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
      <p className="text-xs text-muted-foreground">{helperText}</p>
    </div>
  );
}

export function HeroEditor({ section }: HeroEditorProps) {
  const { updateSection } = useStorefront();
  const [content, setContent] = useState(section.content);
  const variant = section.variant;

  const debouncedContent = useDebounce(content, 500);
  const hasImageArea =
    variant === "centered" || variant === "split" || variant === "video";

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
      if (value !== undefined) {
        return { ...prev, [key]: value };
      }

      const next = { ...prev } as Record<string, unknown>;
      delete next[key as string];
      return next as typeof prev;
    });
  }

  function handleTemplateChange(nextVariant: HeroVariant) {
    const nextContent = ((): typeof content => {
      if (nextVariant !== "video") return content;
      if (content.videoUrl !== undefined) return content;
      return { ...content, videoUrl: "" };
    })();

    setContent((prev) => {
      if (nextVariant !== "video") return prev;
      if (prev.videoUrl !== undefined) return prev;
      return { ...prev, videoUrl: "" };
    });

    updateSection(section.id, {
      variant: nextVariant,
      content: nextContent,
    });
  }

  function getImageFieldConfig() {
    if (variant === "centered") {
      return {
        label: "Background Image",
        helperText: "Recommended: 1920x1080px",
        previewClassName: "aspect-video",
      };
    }
    if (variant === "split") {
      return {
        label: "Supporting Image",
        helperText: "Recommended: 1080x1080px",
        previewClassName: "aspect-square",
      };
    }
    return {
      label: "Video Thumbnail",
      helperText: "Recommended: 1080x1080px",
      previewClassName: "aspect-square",
    };
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Template</Label>
        <div className="grid gap-2">
          {HERO_TEMPLATE_OPTIONS.map((option) => (
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
        <Label>Headline</Label>
        <Input
          value={content.headline}
          onChange={(e) => handleChange("headline", e.target.value)}
          placeholder="Write a clear value-focused headline"
        />
      </div>

      <div className="space-y-2">
        <Label>Subheadline</Label>
        <Textarea
          value={content.subheadline}
          onChange={(e) => handleChange("subheadline", e.target.value)}
          rows={3}
          placeholder="Add a short supporting description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Button Text</Label>
          <Input
            value={content.ctaText}
            onChange={(e) => handleChange("ctaText", e.target.value)}
            placeholder="Get Started"
          />
        </div>
        <div className="space-y-2">
          <Label>Button Link</Label>
          <Input
            value={content.ctaLink}
            onChange={(e) => handleChange("ctaLink", e.target.value)}
            placeholder="/courses"
          />
        </div>
      </div>

      {variant === "video" && (
        <div className="space-y-2">
          <Label>YouTube Video URL</Label>
          <Input
            value={content.videoUrl ?? ""}
            onChange={(e) => handleChange("videoUrl", e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="text-xs text-muted-foreground">
            Paste a full YouTube link. It will open in a modal on the video
            template.
          </p>
        </div>
      )}

      {hasImageArea && (
        <HeroImageUploader
          {...getImageFieldConfig()}
          storageId={content.backgroundImageStorageId}
          onChange={(storageId) => {
            handleChange("backgroundImageStorageId", storageId);

            if (storageId === undefined) {
              updateSection(section.id, {
                content: {
                  backgroundImageStorageId: null,
                } as unknown as typeof section.content,
              });
            }
          }}
        />
      )}
    </div>
  );
}
