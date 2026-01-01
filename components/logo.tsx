"use client";
/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";

const logoVariants = cva("", {
  variants: {
    variant: {
      primary: "",
      "primary-transparent": "",
      black: "",
      "black-transparent": "",
      white: "",
      "white-transparent": "",
    },
    size: {
      xs: "h-4",
      sm: "h-6",
      default: "h-8",
      lg: "h-10",
      xl: "h-12",
    },
    layout: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
    layout: "horizontal",
  },
});

const logoTextVariants = cva(
  "font-sans mb-0.5 transition-opacity duration-200",
  {
    variants: {
      size: {
        xs: "text-sm",
        sm: "text-base",
        default: "text-lg",
        lg: "text-2xl",
        xl: "text-3xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const logoSrcMap: Record<
  NonNullable<VariantProps<typeof logoVariants>["variant"]>,
  string
> = {
  primary: "/images/logo.svg",
  "primary-transparent": "/images/logo-transparent.svg",
  black: "/images/logo-black.svg",
  "black-transparent": "/images/logo-black-transparent.svg",
  white: "/images/logo-white.svg",
  "white-transparent": "/images/logo-white-transparent.svg",
};

interface LogoProps extends VariantProps<typeof logoVariants> {
  className?: string;
  withText?: boolean;
  textClassName?: string;
}

export function Logo({
  variant = "primary",
  size = "default",
  layout = "horizontal",
  className,
  withText = false,
  textClassName,
}: LogoProps) {
  const t = useScopedI18n("components.logo");

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center justify-center gap-2",
        logoVariants({ layout })
      )}
    >
      <img
        src={logoSrcMap[variant!]}
        alt={t("alt")}
        className={cn(logoVariants({ size, className }))}
      />
      {withText && (
        <span
          className={cn(
            logoTextVariants({ size }),
            withText ? "opacity-100" : "opacity-0",
            textClassName
          )}
        >
          {t("text")}
        </span>
      )}
    </Link>
  );
}

export { logoVariants };
