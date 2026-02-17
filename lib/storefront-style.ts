import { FONT_PAIRS } from "@/convex/db/storefronts/templates";
import {
  defaultStorefrontTypography,
  StorefrontStyle,
  StorefrontTheme,
  StorefrontTypography,
} from "@/convex/db/storefronts/validators";

interface StorefrontCssVariableArgs {
  primaryColor: string;
  theme: StorefrontTheme;
  style: StorefrontStyle;
  cssVariables?: Record<string, string>;
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

function getThemeColors(theme: StorefrontTheme): Record<string, string> {
  switch (theme) {
    case "dark":
      return {
        "--background": "222.2 84% 4.9%",
        "--foreground": "210 40% 98%",
        "--muted": "217.2 32.6% 17.5%",
        "--muted-foreground": "215 20.2% 65.1%",
      };
    case "soft":
      return {
        "--background": "30 50% 98%",
        "--foreground": "20 14.3% 4.1%",
        "--muted": "30 30% 92%",
        "--muted-foreground": "25 5.3% 44.7%",
      };
    default:
      return {};
  }
}

function resolveTypography(
  typography?: StorefrontTypography
): StorefrontTypography {
  return { ...defaultStorefrontTypography, ...(typography ?? {}) };
}

export function getStorefrontCssVariables({
  primaryColor,
  theme,
  style,
  cssVariables,
}: StorefrontCssVariableArgs): Record<string, string> {
  const fontPair = FONT_PAIRS[style.fontPair] || FONT_PAIRS["geist-geist"];
  const typography = resolveTypography(style.typography);
  const themeColors = getThemeColors(theme);

  return {
    "--storefront-primary": primaryColor,
    "--font-heading": fontPair.heading,
    "--font-body": fontPair.body,
    "--radius": style.borderRadius || "0.5rem",
    "--storefront-heading-weight": HEADING_WEIGHT_MAP[typography.headingWeight],
    "--storefront-heading-tracking":
      HEADING_TRACKING_MAP[typography.headingTracking],
    "--storefront-body-line-height":
      BODY_LINE_HEIGHT_MAP[typography.bodyLineHeight],
    ...themeColors,
    ...(cssVariables ?? {}),
  };
}
