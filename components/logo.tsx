"use client";
/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import Link from "next/link";

export function Logo({
  variant = "primary",
  className = "h-8",
  layout = "horizontal",
  withText = false,
  textClassName = "",
}: {
  className?: string;
  variant?:
    | "primary"
    | "primary-transparent"
    | "black"
    | "black-transparent"
    | "white"
    | "white-transparent";
  layout?: "horizontal" | "vertical";
  withText?: boolean;
  textClassName?: string;
}) {
  const t = useScopedI18n("landing.logo");

  const getLogoSrc = () => {
    switch (variant) {
      case "primary":
        return "/images/logo.svg";
      case "primary-transparent":
        return "/images/logo-transparent.svg";
      case "black":
        return "/images/logo-black.svg";
      case "black-transparent":
        return "/images/logo-black-transparent.svg";
      case "white":
        return "/images/logo-white.svg";
      case "white-transparent":
        return "/images/logo-white-transparent.svg";
      default:
        return "/images/logo.svg";
    }
  };

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center justify-center gap-2",
        layout === "vertical" && "flex-col"
      )}
    >
      <img
        src={getLogoSrc()}
        alt={t("alt")}
        className={cn(className, layout === "vertical" && "size-10")}
      />
      {withText && (
        <span
          className={cn(
            "text-2xl font-serif font-medium mb-0.5 transition-opacity duration-200",
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
