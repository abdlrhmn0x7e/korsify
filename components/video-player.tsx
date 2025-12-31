"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useAction } from "convex/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import { IconAlertCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const TOKEN_EXPIRY_SECONDS = 3600;
const TOKEN_STALE_TIME_MS = 50 * 60 * 1000;
const TOKEN_GC_TIME_MS = 55 * 60 * 1000;

interface VideoPlayerProps {
  playbackId: string;
  title?: string;
  signed?: boolean;
  accentColor?: string;
  className?: string;
  thumbnailTime?: number;
  autoPlay?: boolean;
  startTime?: number;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

export function VideoPlayer({
  playbackId,
  title,
  signed = true,
  accentColor = "#6366f1",
  className,
  thumbnailTime = 0,
  autoPlay = false,
  startTime,
  onEnded,
  onTimeUpdate,
}: VideoPlayerProps) {
  const getSignedToken = useAction(api.mux.actions.getSignedPlaybackToken);

  const {
    data: tokenData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["mux-playback-token", playbackId],
    queryFn: () =>
      getSignedToken({
        playbackId,
        expiresInSeconds: TOKEN_EXPIRY_SECONDS,
      }),
    enabled: signed,
    staleTime: TOKEN_STALE_TIME_MS,
    gcTime: TOKEN_GC_TIME_MS,
  });

  const isLoading = signed && isPending;

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex aspect-video w-full items-center justify-center rounded-lg bg-muted",
          className
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <Spinner className="size-6" />
          <p className="text-sm text-muted-foreground">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted",
          className
        )}
      >
        <IconAlertCircle className="size-8 text-destructive" />
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load video"}
        </p>
      </div>
    );
  }

  return (
    <MuxPlayer
      playbackId={playbackId}
      tokens={
        signed && tokenData?.token ? { playback: tokenData.token } : undefined
      }
      metadata={{ video_title: title }}
      streamType="on-demand"
      accentColor={accentColor}
      thumbnailTime={thumbnailTime}
      autoPlay={autoPlay}
      startTime={startTime}
      onEnded={onEnded}
      onTimeUpdate={(e) => {
        const target = e.target as HTMLVideoElement;
        onTimeUpdate?.(target.currentTime);
      }}
      className={cn(
        "aspect-video w-full overflow-hidden rounded-lg",
        className
      )}
    />
  );
}

export function VideoPlayerWithToken({
  playbackId,
  title,
  accentColor = "#6366f1",
  className,
  onEnded,
}: Omit<VideoPlayerProps, "signed">) {
  return (
    <VideoPlayer
      playbackId={playbackId}
      title={title}
      signed={true}
      accentColor={accentColor}
      className={className}
      onEnded={onEnded}
    />
  );
}
