import { FONT_PAIRS } from "@/convex/db/storefronts/templates";
import {
  defaultStorefrontStyle,
  defaultStorefrontTypography,
  StorefrontColorPreset,
  StorefrontStyle,
  StorefrontTypography,
} from "@/convex/db/storefronts/validators";

interface StorefrontCssVariableArgs {
  primaryColor: string;
  style: StorefrontStyle;
  cssVariables?: Record<string, string>;
}

interface ResolvedStorefrontStyle extends StorefrontStyle {
  borderRadius: string;
  colorPreset: NonNullable<StorefrontStyle["colorPreset"]>;
  sectionSpacing: NonNullable<StorefrontStyle["sectionSpacing"]>;
  typography: StorefrontTypography;
}

const HEADING_WEIGHT_MAP: Record<
  StorefrontTypography["headingWeight"],
  string
> = {
  semibold: "600",
  bold: "700",
  extrabold: "800",
};

const HEADING_TRACKING_MAP: Record<
  StorefrontTypography["headingTracking"],
  string
> = {
  tight: "-0.025em",
  normal: "0em",
  wide: "0.02em",
};

const BODY_LINE_HEIGHT_MAP: Record<
  StorefrontTypography["bodyLineHeight"],
  string
> = {
  normal: "1.5",
  relaxed: "1.65",
  loose: "1.8",
};

const COLOR_PRESET_MAP: Record<
  Exclude<StorefrontColorPreset, "brand">,
  { primary: string; foreground: string; ring: string }
> = {
  ocean: {
    primary: "oklch(0.61 0.14 240)",
    foreground: "oklch(0.98 0.01 250)",
    ring: "oklch(0.7 0.11 240)",
  },
  sunset: {
    primary: "oklch(0.66 0.2 35)",
    foreground: "oklch(0.98 0.01 45)",
    ring: "oklch(0.73 0.17 35)",
  },
  forest: {
    primary: "oklch(0.58 0.12 155)",
    foreground: "oklch(0.97 0.01 160)",
    ring: "oklch(0.67 0.1 155)",
  },
  violet: {
    primary: "oklch(0.6 0.17 300)",
    foreground: "oklch(0.98 0.01 305)",
    ring: "oklch(0.7 0.14 300)",
  },
  mono: {
    primary: "oklch(0.3 0.01 286)",
    foreground: "oklch(0.99 0 0)",
    ring: "oklch(0.5 0.01 286)",
  },
};

const BUTTON_RADIUS_MAP: Record<StorefrontStyle["buttonStyle"], string> = {
  rounded: "9999px",
  sharp: "0.375rem",
};

const SECTION_SPACING_MAP: Record<
  NonNullable<StorefrontStyle["sectionSpacing"]>,
  string
> = {
  compact: "0.5rem",
  comfortable: "1rem",
  spacious: "2rem",
};

function getColorPresetVariables(
  primaryColor: string,
  colorPreset: NonNullable<StorefrontStyle["colorPreset"]>
): Record<string, string> {
  if (colorPreset === "brand")
    return {
      "--primary": primaryColor,
      "--ring": primaryColor,
      "--storefront-primary": primaryColor,
    };

  const preset = COLOR_PRESET_MAP[colorPreset];
  return {
    "--primary": preset.primary,
    "--primary-foreground": preset.foreground,
    "--ring": preset.ring,
    "--storefront-primary": preset.primary,
  };
}

function resolveTypography(
  typography?: StorefrontTypography
): StorefrontTypography {
  return { ...defaultStorefrontTypography, ...(typography ?? {}) };
}

export function resolveStorefrontStyle(
  style: StorefrontStyle
): ResolvedStorefrontStyle {
  return {
    ...defaultStorefrontStyle,
    ...style,
    typography: resolveTypography(style.typography),
    borderRadius:
      style.borderRadius ?? defaultStorefrontStyle.borderRadius ?? "0.5rem",
    colorPreset:
      style.colorPreset ?? defaultStorefrontStyle.colorPreset ?? "brand",
    sectionSpacing:
      style.sectionSpacing ??
      defaultStorefrontStyle.sectionSpacing ??
      "comfortable",
  };
}

export function getStorefrontCssVariables({
  primaryColor,
  style,
  cssVariables,
}: StorefrontCssVariableArgs): Record<string, string> {
  const resolvedStyle = resolveStorefrontStyle(style);
  const fontPair =
    FONT_PAIRS[resolvedStyle.fontPair] || FONT_PAIRS["geist-geist"];
  const typography = resolveTypography(resolvedStyle.typography);
  const colorPresetVariables = getColorPresetVariables(
    primaryColor,
    resolvedStyle.colorPreset
  );

  return {
    "--font-heading": fontPair.heading,
    "--font-body": fontPair.body,
    "--radius": resolvedStyle.borderRadius,
    "--storefront-button-radius": BUTTON_RADIUS_MAP[resolvedStyle.buttonStyle],
    "--storefront-section-gap":
      SECTION_SPACING_MAP[resolvedStyle.sectionSpacing],
    "--storefront-heading-weight": HEADING_WEIGHT_MAP[typography.headingWeight],
    "--storefront-heading-tracking":
      HEADING_TRACKING_MAP[typography.headingTracking],
    "--storefront-body-line-height":
      BODY_LINE_HEIGHT_MAP[typography.bodyLineHeight],
    ...colorPresetVariables,
    ...(cssVariables ?? {}),
  };
}
