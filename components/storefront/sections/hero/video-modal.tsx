"use client";

import { useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { IconPlayerPlay } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface VideoModalProps {
  videoUrl: string;
}

export function VideoModal({ videoUrl }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
        <div className="relative aspect-video w-full">
          <video
            ref={videoRef}
            className="h-full w-full"
            controls
            controlsList="nodownload"
            playsInline
            autoPlay
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
