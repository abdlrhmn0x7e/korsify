"use client";

import { useState, useEffect } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import { IconAlertCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  /** The Mux playback ID */
  playbackId: string;
  /** Video title for analytics */
  title?: string;
  /** Whether this video requires a signed token */
  signed?: boolean;
  /** Custom accent color for the player */
  accentColor?: string;
  /** Additional class names */
  className?: string;
  /** Thumbnail time in seconds */
  thumbnailTime?: number;
  /** Auto play the video */
  autoPlay?: boolean;
  /** Start time in seconds */
  startTime?: number;
  /** Callback when video ends */
  onEnded?: () => void;
  /** Callback for time updates */
  onTimeUpdate?: (currentTime: number) => void;
}

/**
 * Video player component using Mux Player.
 * Supports both public and signed playback.
 */
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(signed);
  const [error, setError] = useState<string | null>(null);

  const getSignedToken = useAction(api.mux.actions.getSignedPlaybackToken);

  // Fetch signed token if needed
  useEffect(() => {
    if (!signed) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function fetchToken() {
      try {
        const result = await getSignedToken({
          playbackId,
          expiresInSeconds: 3600, // 1 hour
        });

        if (mounted) {
          setToken(result.token);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load video");
          setLoading(false);
        }
      }
    }

    fetchToken();

    return () => {
      mounted = false;
    };
  }, [playbackId, signed, getSignedToken]);

  // Loading state
  if (loading) {
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

  // Error state
  if (error) {
    return (
      <div
        className={cn(
          "flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted",
          className
        )}
      >
        <IconAlertCircle className="size-8 text-destructive" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <MuxPlayer
      playbackId={playbackId}
      tokens={signed && token ? { playback: token } : undefined}
      metadata={{
        video_title: title,
      }}
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
        "aspect-video w-full rounded-lg overflow-hidden",
        className
      )}
    />
  );
}

interface VideoPlayerWithLessonProps {
  /** The lesson ID to fetch video for */
  lessonId: string;
  /** Video title for analytics */
  title?: string;
  /** Custom accent color for the player */
  accentColor?: string;
  /** Additional class names */
  className?: string;
  /** Callback when video ends */
  onEnded?: () => void;
}

/**
 * Video player that fetches the video token for a specific lesson.
 * Use this when you have a lesson ID and want to handle token fetching automatically.
 */
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
