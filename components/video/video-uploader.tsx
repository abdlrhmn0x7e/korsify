"use client";

import { Id } from "@/convex/_generated/dataModel";
import { useUploadVideo } from "@/components/video/use-upload-video";
import { Button } from "@/components/ui/button";
import { DropzoneArea } from "@/components/ui/dropzone-area";
import { Spinner } from "@/components/ui/spinner";
import { IconUpload, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { VideoPlayer } from "@/components/video/video-player";

interface VideoUploaderProps {
  initialVideoId?: Id<"muxAssets">;
  onVideoReady: (muxAssetId: Id<"muxAssets">) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
}

export function VideoUploader({
  initialVideoId,
  onVideoReady,
  onUploadError,
  className,
}: VideoUploaderProps) {
  const {
    status,
    progress,
    video,
    error,
    inputRef,
    handleChange,
    openFilePicker,
    upload,
  } = useUploadVideo({
    initialVideoId,
    onVideoReady,
    onError: onUploadError,
  });

  const handleFilesSelected = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (file) upload(file);
    },
    [upload]
  );

  const isDisabled = status === "uploading" || status === "processing";

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleChange}
        disabled={isDisabled}
      />

      {status === "idle" && (
        <DropzoneArea
          options={{
            accept: { "video/*": [] },
            maxFiles: 1,
          }}
          onFilesSelected={handleFilesSelected}
          emptyText="or click to browse files"
          buttonText="Browse files"
          icon={
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 mb-2">
              <IconUpload className="size-6 text-primary" />
            </div>
          }
          emptyContent={
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <IconUpload className="size-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Drop your video here</p>
                <p className="text-xs text-muted-foreground">
                  or click to browse files
                </p>
              </div>
              <Button type="button" size="sm" onClick={openFilePicker}>
                Browse files
              </Button>
            </div>
          }
        />
      )}

      {status === "uploading" && (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-6">
          <div className="flex items-center gap-3">
            <Spinner className="size-5" />
            <span className="text-sm font-medium">Uploading video...</span>
            <span className="ml-auto text-sm text-muted-foreground">
              {progress}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === "processing" && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-6">
          <Spinner className="size-5" />
          <div>
            <p className="text-sm font-medium">Processing video...</p>
            <p className="text-xs text-muted-foreground">
              This may take a few minutes
            </p>
          </div>
        </div>
      )}

      {status === "ready" && video && video.playbackId && (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <VideoPlayer
            playbackId={video.playbackId}
            signed
            className="rounded-md"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconCheck className="size-4 text-green-600" />
              <span className="text-sm">
                Video ready
                {video.duration && (
                  <span className="text-muted-foreground">
                    {" "}
                    · {formatDuration(video.duration)}
                  </span>
                )}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={openFilePicker}>
              Replace
            </Button>
          </div>
        </div>
      )}

      {status === "errored" && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-destructive/20">
            <IconAlertCircle className="size-5 text-destructive" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">
              Upload failed
            </p>
            {(error?.message || video?.errorMessage) && (
              <p className="text-xs text-destructive/80">
                {error?.message || video?.errorMessage}
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={openFilePicker}>
            <IconUpload className="size-4" />
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
