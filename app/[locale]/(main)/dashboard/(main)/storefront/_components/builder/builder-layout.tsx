"use client";

import { useStorefront } from "./storefront-context";
import {
  BuilderSidebar,
  BuilderSidebarProvider,
  BuilderSidebarTrigger,
} from "./sidebar";
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
import { useIsMobile } from "@/hooks/use-mobile";

export function BuilderLayout({ subdomain }: { subdomain?: string }) {
  const { isLoading } = useStorefront();
  const isMobile = useIsMobile();
  const [device, setDevice] = React.useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  if (isLoading) {
    return <WholePageSpinner />;
  }

  return (
    <BuilderSidebarProvider>
      <div className="flex h-full overflow-hidden">
        <div className="flex-1 relative bg-muted/20 overflow-hidden">
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
              className="hidden sm:flex"
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

            <BuilderSidebarTrigger />
          </div>

          <div
            className={cn(
              "absolute inset-x-4 max-w-[75svw] mx-auto sm:inset-x-12 bottom-4 top-18",
              device === "mobile" && "top-12 w-xs",
              theme === "dark" && "dark"
            )}
          >
            {device === "desktop" && !isMobile && (
              <DesktopPreview subdomain={subdomain} />
            )}
            {(device === "mobile" || isMobile) && <MobilePreview />}
            {device === "tablet" && !isMobile && <TabletPreview />}
          </div>
        </div>

        <BuilderSidebar />
      </div>
    </BuilderSidebarProvider>
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
