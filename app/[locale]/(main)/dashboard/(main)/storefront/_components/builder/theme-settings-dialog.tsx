"use client";

import { useState } from "react";
import { IconPalette } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StorefrontStyle,
} from "@/convex/db/storefronts/validators";
import { resolveStorefrontStyle } from "@/lib/storefront-style";
import { useStorefront } from "./storefront-context";

const colorPresetOptions: Array<{
  value: NonNullable<StorefrontStyle["colorPreset"]>;
  label: string;
  swatch: string;
}> = [
  { value: "brand", label: "Brand Color", swatch: "#3b82f6" },
  { value: "ocean", label: "Ocean", swatch: "#3b82f6" },
  { value: "sunset", label: "Sunset", swatch: "#f97316" },
  { value: "forest", label: "Forest", swatch: "#10b981" },
  { value: "violet", label: "Violet", swatch: "#8b5cf6" },
  { value: "mono", label: "Monochrome", swatch: "#334155" },
];

const buttonStyleOptions: Array<{
  value: StorefrontStyle["buttonStyle"];
  label: string;
}> = [
  { value: "rounded", label: "Rounded" },
  { value: "sharp", label: "Sharp" },
];

const borderRadiusOptions: Array<{
  value: string;
  label: string;
}> = [
  { value: "0.25rem", label: "Small" },
  { value: "0.5rem", label: "Medium" },
  { value: "0.75rem", label: "Large" },
  { value: "1rem", label: "Extra Large" },
];

const sectionSpacingOptions: Array<{
  value: NonNullable<StorefrontStyle["sectionSpacing"]>;
  label: string;
}> = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
];

export function ThemeSettingsDialog() {
  const { storefront, teacher, updateStyle } = useStorefront();
  const [open, setOpen] = useState(false);

  if (!storefront) return null;

  const style = resolveStorefrontStyle(storefront.style);

  function updateStorefrontStyle(updates: Partial<StorefrontStyle>) {
    updateStyle({
      style: {
        ...style,
        ...updates,
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="w-full justify-start" />
        }
      >
        <IconPalette />
        Theme & Colors
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Theme & Colors</DialogTitle>
          <DialogDescription>
            Choose a look and feel for your storefront with color, spacing, and
            shape controls.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Color Palette</p>
            <Select
              items={colorPresetOptions}
              value={style.colorPreset}
              onValueChange={(value) => {
                if (!value) return;
                updateStorefrontStyle({
                  colorPreset: value,
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {colorPresetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="size-2.5 rounded-full border"
                          style={{
                            backgroundColor:
                              option.value === "brand"
                                ? (teacher?.branding?.primaryColor ?? option.swatch)
                                : option.swatch,
                          }}
                        />
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Button Shape</p>
            <Select
              items={buttonStyleOptions}
              value={style.buttonStyle}
              onValueChange={(value) => {
                if (!value) return;
                updateStorefrontStyle({
                  buttonStyle: value,
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {buttonStyleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Corner Radius</p>
            <Select
              items={borderRadiusOptions}
              value={style.borderRadius}
              onValueChange={(value) => {
                if (!value) return;
                updateStorefrontStyle({ borderRadius: value });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {borderRadiusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Section Spacing</p>
            <Select
              items={sectionSpacingOptions}
              value={style.sectionSpacing}
              onValueChange={(value) => {
                if (!value) return;
                updateStorefrontStyle({
                  sectionSpacing: value,
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {sectionSpacingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
