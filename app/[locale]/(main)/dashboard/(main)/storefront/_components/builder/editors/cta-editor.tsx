"use client";

import { useStorefront } from "../storefront-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { StorefrontSection } from "@/convex/db/storefronts/validators";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

interface CtaEditorProps {
  section: StorefrontSection & { type: "cta" };
}

export function CtaEditor({ section }: CtaEditorProps) {
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
        <Label>Headline</Label>
        <Input
          value={content.headline}
          onChange={(e) => handleChange("headline", e.target.value)}
          placeholder="Ready to get started?"
        />
      </div>

      <div className="space-y-2">
        <Label>Subheadline</Label>
        <Textarea
          value={content.subheadline ?? ""}
          onChange={(e) =>
            handleChange("subheadline", e.target.value || undefined)
          }
          placeholder="Join hundreds of students already learning with us..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Button Text</Label>
          <Input
            value={content.buttonText}
            onChange={(e) => handleChange("buttonText", e.target.value)}
            placeholder="Get Started"
          />
        </div>
        <div className="space-y-2">
          <Label>Button Link</Label>
          <Input
            value={content.buttonLink}
            onChange={(e) => handleChange("buttonLink", e.target.value)}
            placeholder="/courses"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="space-y-0.5">
          <Label>Show WhatsApp Button</Label>
          <p className="text-xs text-muted-foreground">
            Display a WhatsApp contact button
          </p>
        </div>
        <Switch
          checked={content.showWhatsApp}
          onCheckedChange={(checked) => handleChange("showWhatsApp", checked)}
        />
      </div>

      <div className="space-y-2 pt-2">
        <Label>Background Image</Label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
          <p>Click to upload image</p>
          <p className="text-xs mt-1">Recommended: 1920x600px</p>
        </div>
      </div>
    </div>
  );
}
