"use client";

import { useState } from "react";
import { IconTypeface } from "@tabler/icons-react";
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
import { FONT_PAIRS } from "@/convex/db/storefronts/templates";
import {
  defaultStorefrontTypography,
  StorefrontTypography,
} from "@/convex/db/storefronts/validators";
import { useStorefront } from "./storefront-context";

const headingWeightOptions: Array<{
  value: StorefrontTypography["headingWeight"];
  label: string;
}> = [
  { value: "semibold", label: "Semi Bold" },
  { value: "bold", label: "Bold" },
  { value: "extrabold", label: "Extra Bold" },
];

const headingTrackingOptions: Array<{
  value: StorefrontTypography["headingTracking"];
  label: string;
}> = [
  { value: "tight", label: "Tight" },
  { value: "normal", label: "Normal" },
  { value: "wide", label: "Wide" },
];

const bodyLineHeightOptions: Array<{
  value: StorefrontTypography["bodyLineHeight"];
  label: string;
}> = [
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Relaxed" },
  { value: "loose", label: "Loose" },
];

export function TypographySettingsDialog() {
  const { storefront, updateStyle, updateTypography } = useStorefront();
  const [open, setOpen] = useState(false);

  if (!storefront) return null;

  const typography = storefront.style.typography ?? defaultStorefrontTypography;
  const fontPairOptions = Object.entries(FONT_PAIRS).map(
    ([value, fontPair]) => ({
      value,
      label: fontPair.name,
    })
  );

  function handleTypographyUpdate(
    key: keyof StorefrontTypography,
    value: string
  ) {
    updateTypography({
      [key]: value,
    } as Partial<StorefrontTypography>);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="w-full justify-start" />
        }
      >
        <IconTypeface />
        Typography
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Typography</DialogTitle>
          <DialogDescription>
            Control the font pairing and text rhythm across your storefront.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Font Pair</p>
            <Select
              items={fontPairOptions}
              value={storefront.style.fontPair}
              onValueChange={(value) => {
                if (!value) return;
                updateStyle({
                  style: { ...storefront.style, fontPair: value },
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {fontPairOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Heading Weight</p>
            <Select
              items={headingWeightOptions}
              value={typography.headingWeight}
              onValueChange={(value) => {
                if (!value) return;
                handleTypographyUpdate("headingWeight", value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {headingWeightOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Heading Spacing</p>
            <Select
              items={headingTrackingOptions}
              value={typography.headingTracking}
              onValueChange={(value) => {
                if (!value) return;
                handleTypographyUpdate("headingTracking", value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {headingTrackingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Body Line Height</p>
            <Select
              items={bodyLineHeightOptions}
              value={typography.bodyLineHeight}
              onValueChange={(value) => {
                if (!value) return;
                handleTypographyUpdate("bodyLineHeight", value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {bodyLineHeightOptions.map((option) => (
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
