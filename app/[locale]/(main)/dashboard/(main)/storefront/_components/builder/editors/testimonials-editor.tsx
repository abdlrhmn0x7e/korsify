"use client";

import { useStorefront } from "../storefront-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  StorefrontSection,
  TestimonialItem,
  TestimonialsVariant,
} from "@/convex/db/storefronts/validators";
import { useDebounce } from "@/hooks/use-debounce";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { IconPhoto, IconPlus, IconStar, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useUploadFile } from "@/hooks/use-upload-file";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { LazyStorageImage } from "@/components/lazy-storage-image";

interface TestimonialsEditorProps {
  section: StorefrontSection & { type: "testimonials" };
}

const TESTIMONIAL_TEMPLATE_OPTIONS: Array<{
  value: TestimonialsVariant;
  label: string;
  description: string;
}> = [
  {
    value: "cards",
    label: "Cards",
    description:
      "Horizontal testimonial cards with optional star ratings and avatars.",
  },
  {
    value: "carousel",
    label: "Carousel",
    description:
      "Slide-based testimonials focused on quote, person, and role details.",
  },
  {
    value: "quotes",
    label: "Quotes Wall",
    description:
      "Multi-column quote wall with richer social proof and star ratings.",
  },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

interface TestimonialAvatarUploaderProps {
  storageId: Id<"_storage"> | undefined;
  name: string;
  onChange: (storageId: Id<"_storage"> | undefined) => void;
}

function TestimonialAvatarUploader({
  storageId,
  name,
  onChange,
}: TestimonialAvatarUploaderProps) {
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
    toast.success("Avatar uploaded");
    event.target.value = "";
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs">Avatar (optional)</Label>
      <div className="space-y-2 rounded-md border p-2">
        <div className="size-14 overflow-hidden rounded-full border bg-muted/30">
          {storageId ? (
            <LazyStorageImage
              storageId={storageId}
              alt={name || "Testimonial avatar"}
              className="h-full w-full object-cover"
              fallback={
                <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                  Unavailable
                </div>
              }
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <IconPhoto className="size-4" />
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
            {isUploading ? "Uploading..." : storageId ? "Change" : "Upload"}
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
    </div>
  );
}

export function TestimonialsEditor({ section }: TestimonialsEditorProps) {
  const { updateSection } = useStorefront();
  const [content, setContent] = useState(section.content);
  const variant = section.variant;

  const debouncedContent = useDebounce(content, 500);
  const supportsRatings = variant === "cards" || variant === "quotes";
  const activeTemplate = TESTIMONIAL_TEMPLATE_OPTIONS.find(
    (option) => option.value === variant
  );

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

  function handleTemplateChange(nextVariant: TestimonialsVariant) {
    updateSection(section.id, { variant: nextVariant });
  }

  function handleAddTestimonial() {
    const newItem: TestimonialItem = {
      id: generateId(),
      name: "",
      content: "",
      rating: 5,
    };
    setContent((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  }

  function handleUpdateItem<K extends keyof Omit<TestimonialItem, "id">>(
    id: string,
    field: K,
    value: Omit<TestimonialItem, "id">[K]
  ) {
    setContent((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }

  function handleRemoveItem(id: string) {
    setContent((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Template</Label>
        <div className="grid gap-2">
          {TESTIMONIAL_TEMPLATE_OPTIONS.map((option) => (
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
        <Label>Section Title</Label>
        <Input
          value={content.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder={
            variant === "carousel" ? "Student Stories" : "What Students Say"
          }
        />
      </div>

      {!supportsRatings && (
        <p className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          Carousel focuses on quote content and identity details, so star rating
          is hidden in this template.
        </p>
      )}

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label>
            {variant === "carousel" ? "Carousel Slides" : "Testimonials"}
          </Label>
          <Button variant="outline" size="sm" onClick={handleAddTestimonial}>
            <IconPlus className="h-4 w-4 mr-1" />
            {variant === "carousel" ? "Add Slide" : "Add Testimonial"}
          </Button>
        </div>

        {content.items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            {variant === "carousel"
              ? 'No slides added yet. Click "Add Slide" to create one.'
              : 'No testimonials added yet. Click "Add Testimonial" to create one.'}
          </p>
        )}

        {content.items.map((item, index) => (
          <div
            key={item.id}
            className="p-3 border rounded-lg bg-muted/30 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {variant === "carousel" ? "Slide" : "Testimonial"} {index + 1}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => handleRemoveItem(item.id)}
              >
                <IconTrash className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Name</Label>
                <Input
                  value={item.name}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "name", e.target.value)
                  }
                  placeholder="John Doe"
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Role (optional)</Label>
                <Input
                  value={item.role ?? ""}
                  onChange={(e) =>
                    handleUpdateItem(
                      item.id,
                      "role",
                      e.target.value || undefined
                    )
                  }
                  placeholder="Student"
                  className="h-8"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Testimonial Content</Label>
              <Textarea
                value={item.content}
                onChange={(e) =>
                  handleUpdateItem(item.id, "content", e.target.value)
                }
                placeholder={
                  variant === "carousel"
                    ? "Write a short quote that works well in a slide..."
                    : "Write what the student said..."
                }
                rows={3}
              />
            </div>

            <TestimonialAvatarUploader
              storageId={item.avatarStorageId}
              name={item.name}
              onChange={(storageId) =>
                handleUpdateItem(item.id, "avatarStorageId", storageId)
              }
            />

            {supportsRatings && (
              <div className="space-y-1">
                <Label className="text-xs">Rating</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleUpdateItem(item.id, "rating", star)}
                      className="p-0.5 hover:scale-110 transition-transform"
                    >
                      <IconStar
                        className={cn(
                          "h-5 w-5",
                          star <= (item.rating ?? 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
