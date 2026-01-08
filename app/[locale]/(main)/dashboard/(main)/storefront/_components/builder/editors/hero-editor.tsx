"use client";

import { useStorefront } from "../storefront-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StorefrontSection } from "@/convex/db/storefronts/validators";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

interface HeroEditorProps {
  section: StorefrontSection & { type: "hero" };
}

export function HeroEditor({ section }: HeroEditorProps) {
  const { updateSection } = useStorefront();
  const [content, setContent] = useState(section.content);

  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    if (JSON.stringify(debouncedContent) !== JSON.stringify(section.content)) {
      updateSection(section.id, { content: debouncedContent });
    }
  }, [debouncedContent, section.id, updateSection]);

  const handleChange = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Headline</Label>
        <Input 
          value={content.headline} 
          onChange={(e) => handleChange("headline", e.target.value)} 
        />
      </div>
      
      <div className="space-y-2">
        <Label>Subheadline</Label>
        <Textarea 
          value={content.subheadline} 
          onChange={(e) => handleChange("subheadline", e.target.value)} 
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Button Text</Label>
          <Input 
            value={content.ctaText} 
            onChange={(e) => handleChange("ctaText", e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label>Button Link</Label>
          <Input 
            value={content.ctaLink} 
            onChange={(e) => handleChange("ctaLink", e.target.value)} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Background Image</Label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
          <p>Click to upload image</p>
          <p className="text-xs mt-1">Recommended: 1920x1080px</p>
        </div>
      </div>
    </div>
  );
}
