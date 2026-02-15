"use client";

import { useStorefront } from "../storefront-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  CtaVariant,
  StorefrontSection,
} from "@/convex/db/storefronts/validators";
import { type ChangeEvent, useRef } from "react";
import { cn } from "@/lib/utils";
import { useUploadFile } from "@/hooks/use-upload-file";
import { Id } from "@/convex/_generated/dataModel";
import { LazyStorageImage } from "@/components/lazy-storage-image";
import { IconPhoto, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

interface CtaEditorProps {
  section: StorefrontSection & { type: "cta" };
}

const CTA_TEMPLATE_OPTIONS: Array<{
  value: CtaVariant;
  label: string;
  description: string;
}> = [
  {
    value: "simple",
    label: "Simple",
    description: "Compact two-column call to action with clean styling.",
  },
  {
    value: "gradient",
    label: "Gradient",
    description: "Centered high-contrast banner with bold visual emphasis.",
  },
  {
    value: "image",
    label: "Image",
    description: "Split layout with text on one side and image on the other.",
  },
];

interface CtaImageUploaderProps {
  label: string;
  hint: string;
  storageId: Id<"_storage"> | undefined;
  onChange: (storageId: Id<"_storage"> | undefined) => void;
}

function CtaImageUploader({
  label,
  hint,
  storageId,
  onChange,
}: CtaImageUploaderProps) {
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
        <div className="aspect-video overflow-hidden rounded-md border bg-muted/30">
          {storageId ? (
            <LazyStorageImage
              storageId={storageId}
              alt="CTA background"
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
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

interface CtaVariantDetails {
  headlineLabel: string;
  headlinePlaceholder: string;
  subheadlineLabel: string;
  subheadlinePlaceholder: string;
  buttonTextLabel: string;
  buttonTextPlaceholder: string;
  buttonLinkLabel: string;
  buttonLinkPlaceholder: string;
  imageLabel?: string;
  imageHint?: string;
}

const CTA_VARIANT_DETAILS: Record<CtaVariant, CtaVariantDetails> = {
  simple: {
    headlineLabel: "Headline",
    headlinePlaceholder: "Ready to get started?",
    subheadlineLabel: "Support Text",
    subheadlinePlaceholder:
      "Join hundreds of students already learning with us...",
    buttonTextLabel: "Primary Button Text",
    buttonTextPlaceholder: "Get Started",
    buttonLinkLabel: "Primary Button Link",
    buttonLinkPlaceholder: "/courses",
  },
  gradient: {
    headlineLabel: "Banner Headline",
    headlinePlaceholder: "Start your learning journey today",
    subheadlineLabel: "Banner Subheadline",
    subheadlinePlaceholder: "Big promise, clear next step, and urgency.",
    buttonTextLabel: "Primary CTA Text",
    buttonTextPlaceholder: "Enroll Now",
    buttonLinkLabel: "Primary CTA Link",
    buttonLinkPlaceholder: "/courses",
    imageLabel: "Background Texture",
    imageHint:
      "Optional image overlay. Recommended: 1920x1080px for best quality.",
  },
  image: {
    headlineLabel: "Offer Headline",
    headlinePlaceholder: "Ready to transform your life?",
    subheadlineLabel: "Offer Subheadline",
    subheadlinePlaceholder: "Give context for the image and the next action.",
    buttonTextLabel: "Primary CTA Text",
    buttonTextPlaceholder: "Book Now",
    buttonLinkLabel: "Primary CTA Link",
    buttonLinkPlaceholder: "/courses",
    imageLabel: "Visual Side Image",
    imageHint:
      "Displayed in the right panel. Recommended: 1600x900px or larger.",
  },
};

export function CtaEditor({ section }: CtaEditorProps) {
  const { updateSection } = useStorefront();
  const content = section.content;
  const variant = section.variant;
  const supportsBackgroundImage = variant === "gradient" || variant === "image";
  const activeTemplate = CTA_TEMPLATE_OPTIONS.find(
    (option) => option.value === variant
  );
  const variantDetails = CTA_VARIANT_DETAILS[variant];

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

  function handleTemplateChange(nextVariant: CtaVariant) {
    updateSection(section.id, { variant: nextVariant });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Template</Label>
        <div className="grid gap-2">
          {CTA_TEMPLATE_OPTIONS.map((option) => (
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
        <Label>Editing</Label>
        <p className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          {activeTemplate?.label}: {activeTemplate?.description}
        </p>
      </div>

      <div className="space-y-2">
        <Label>{variantDetails.headlineLabel}</Label>
        <Input
          value={content.headline}
          onChange={(e) => handleChange("headline", e.target.value)}
          placeholder={variantDetails.headlinePlaceholder}
        />
      </div>

      <div className="space-y-2">
        <Label>{variantDetails.subheadlineLabel}</Label>
        <Textarea
          value={content.subheadline ?? ""}
          onChange={(e) =>
            handleChange("subheadline", e.target.value || undefined)
          }
          placeholder={variantDetails.subheadlinePlaceholder}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{variantDetails.buttonTextLabel}</Label>
          <Input
            value={content.buttonText}
            onChange={(e) => handleChange("buttonText", e.target.value)}
            placeholder={variantDetails.buttonTextPlaceholder}
          />
        </div>
        <div className="space-y-2">
          <Label>{variantDetails.buttonLinkLabel}</Label>
          <Input
            value={content.buttonLink}
            onChange={(e) => handleChange("buttonLink", e.target.value)}
            placeholder={variantDetails.buttonLinkPlaceholder}
          />
        </div>
      </div>

      {variant === "simple" && (
        <p className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          The Simple template uses only text and buttons.
        </p>
      )}

      {supportsBackgroundImage && (
        <div className="space-y-2">
          <CtaImageUploader
            label={variantDetails.imageLabel ?? "Background Image"}
            hint={
              variantDetails.imageHint ??
              "Recommended: 1920x1080px for best visual quality."
            }
            storageId={content.backgroundImageStorageId}
            onChange={(storageId) =>
              handleChange("backgroundImageStorageId", storageId)
            }
          />

          {variant === "image" && !content.backgroundImageStorageId && (
            <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
              Add an image to make the Image template render as intended.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
