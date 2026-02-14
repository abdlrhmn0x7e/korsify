"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { IconPlayerPlay } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface VideoModalProps {
  videoUrl: string;
}

function getYouTubeEmbedUrl(videoUrl: string): string | null {
  if (!videoUrl) return null;

  try {
    const url = new URL(videoUrl);
    const host = url.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (url.pathname.startsWith("/embed/")) {
        const id = url.pathname.replace("/embed/", "").split("/")[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function VideoModal({ videoUrl }: VideoModalProps) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="secondary"
            className="size-12 rounded-full lg:size-16"
            size="icon-lg"
          />
        }
      >
        <IconPlayerPlay className="size-4 lg:size-6" />
      </DialogTrigger>

      <DialogContent className="overflow-hidden p-0 lg:max-w-5xl">
        {embedUrl ? (
          <div className="relative aspect-video w-full">
            <iframe
              src={embedUrl}
              className="h-full w-full"
              title="Hero video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-muted px-6 text-center text-sm text-muted-foreground">
            Add a valid YouTube URL in the hero editor to preview this video.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
