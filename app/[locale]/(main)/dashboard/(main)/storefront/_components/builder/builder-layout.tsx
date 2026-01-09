"use client";

import { useStorefront } from "./storefront-context";
import { Sidebar } from "./sidebar";
import { PreviewArea } from "./preview-area";
import { WholePageSpinner } from "@/components/whole-page-spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Grid } from "@/components/ui/grid";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  IconDeviceImac,
  IconDeviceMobile,
  IconDeviceTablet,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MockPhone } from "@/components/mock-phone";
import { cn } from "@/lib/utils";
import { MockTablet } from "@/components/mock-tablet";

export function BuilderLayout({ subdomain }: { subdomain?: string }) {
  const { isLoading } = useStorefront();
  const [device, setDevice] = React.useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  if (isLoading) {
    return <WholePageSpinner />;
  }

  return (
    <div className="flex h-full overflow-hidden bg-background">
      <div className="w-80 border-r bg-muted/10 shrink-0 overflow-y-auto">
        <Sidebar />
      </div>

      <div className="size-full relative bg-muted/20">
        <Grid cellSize={24} />
        <div className="absolute z-10 end-4 top-4 flex items-center gap-3">
          <ToggleGroup
            variant="outline"
            value={[theme]}
            onValueChange={(val) => setTheme(val[0] ?? "light")}
          >
            <ToggleGroupItem value="light" aria-label="Light Mode">
              <IconSun />
            </ToggleGroupItem>
            <ToggleGroupItem value="dark">
              <IconMoon />
            </ToggleGroupItem>
          </ToggleGroup>

          <ToggleGroup
            variant="outline"
            value={[device]}
            onValueChange={(val) => setDevice(val[0] ?? "desktop")}
          >
            <ToggleGroupItem value="desktop" aria-label="Desktop View">
              <IconDeviceImac />
            </ToggleGroupItem>
            <ToggleGroupItem value="tablet" aria-label="Tablet View">
              <IconDeviceTablet />
            </ToggleGroupItem>
            <ToggleGroupItem value="mobile" aria-label="Mobile View">
              <IconDeviceMobile />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div
          className={cn(
            "absolute inset-x-12 bottom-4 top-18 overflow-hidden",
            device === "mobile" && "top-12",
            theme === "dark" && "dark"
          )}
        >
          {device === "desktop" && <DesktopPreview subdomain={subdomain} />}
          {device === "mobile" && <MobilePreview />}
          {device === "tablet" && <TabletPreview />}
        </div>
      </div>
    </div>
  );
}

function DesktopPreview({ subdomain }: { subdomain?: string }) {
  return (
    <AspectRatio
      ratio={16 / 9}
      className="@container w-full mx-auto border bg-muted rounded-lg overflow-hidden"
    >
      <header className="flex items-center px-3 py-2 bg-muted sticky top-0 z-50">
        <div className="flex gap-1.5 items-center justify-center">
          <div className="size-3 bg-red-500 rounded-full" />
          <div className="size-3 bg-yellow-500 rounded-full" />
          <div className="size-3 bg-green-500 rounded-full" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">
            {subdomain
              ? `Previewing: http://${subdomain}.localhost:3000`
              : "Storefront Preview"}
          </span>
        </div>
      </header>

      <PreviewArea />
    </AspectRatio>
  );
}

function MobilePreview() {
  return (
    <MockPhone className="h-full" screenClassName="@container">
      <ScrollArea className="h-full">
        <PreviewArea />
      </ScrollArea>
    </MockPhone>
  );
}

function TabletPreview() {
  return (
    <MockTablet className="size-full" screenClassName="@container">
      <ScrollArea className="size-full">
        <PreviewArea />
      </ScrollArea>
    </MockTablet>
  );
}
