"use client";

import { useStorefront } from "../storefront-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  StorefrontSection,
  TestimonialItem,
} from "@/convex/db/storefronts/validators";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { IconPlus, IconStar, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface TestimonialsEditorProps {
  section: StorefrontSection & { type: "testimonials" };
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function TestimonialsEditor({ section }: TestimonialsEditorProps) {
  const { updateSection } = useStorefront();
  const [content, setContent] = useState(section.content);

  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    if (JSON.stringify(debouncedContent) !== JSON.stringify(section.content)) {
      updateSection(section.id, { content: debouncedContent });
    }
  }, [debouncedContent, section.id, section.content, updateSection]);

  function handleTitleChange(value: string) {
    setContent((prev) => ({ ...prev, title: value }));
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

  function handleUpdateItem(
    id: string,
    field: keyof Omit<TestimonialItem, "id" | "avatarStorageId">,
    value: string | number | undefined
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
        <Label>Section Title</Label>
        <Input
          value={content.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="What Students Say"
        />
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label>Testimonials</Label>
          <Button variant="outline" size="sm" onClick={handleAddTestimonial}>
            <IconPlus className="h-4 w-4 mr-1" />
            Add Testimonial
          </Button>
        </div>

        {content.items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No testimonials added yet. Click "Add Testimonial" to create one.
          </p>
        )}

        {content.items.map((item, index) => (
          <div
            key={item.id}
            className="p-3 border rounded-lg bg-muted/30 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Testimonial {index + 1}
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
                placeholder="Write what the student said..."
                rows={3}
              />
            </div>

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
          </div>
        ))}
      </div>
    </div>
  );
}
