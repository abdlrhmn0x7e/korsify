"use client";

import { useState, useCallback, useRef } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  IconUpload,
  IconVideo,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface VideoUploaderProps {
  lessonId: Id<"lessons">;
  teacherId: Id<"teachers">;
  onUploadComplete?: () => void;
  onUploadError?: (error: Error) => void;
  className?: string;
}

type UploadState = "idle" | "uploading" | "processing" | "ready" | "error";

export function VideoUploader({
  lessonId,
  teacherId,
  onUploadComplete,
  onUploadError,
  className,
}: VideoUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createDirectUpload = useAction(api.mux.actions.createDirectUpload);
  const linkVideoToLesson = useMutation(
    api.teachers.mux.mutations.linkVideoToLesson
  );
  const video = useQuery(api.teachers.mux.queries.getVideoForLesson, {
    lessonId,
  });

  // Update state based on video status
  const currentState: UploadState =
    uploadState === "uploading"
      ? "uploading"
      : video?.status === "processing"
        ? "processing"
        : video?.status === "ready"
          ? "ready"
          : video?.status === "errored"
            ? "error"
            : "idle";

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("video/")) {
        setErrorMessage("Please select a video file");
        return;
      }

      setUploadState("uploading");
      setProgress(0);
      setErrorMessage(null);

      try {
        // Get upload URL from Mux via action
        const { uploadUrl, muxAssetId } = await createDirectUpload({
          teacherId,
        });

        // Link the video to the lesson immediately
        await linkVideoToLesson({
          lessonId,
          muxAssetId,
        });

        // Upload directly to Mux
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        });

        await new Promise<void>((resolve, reject) => {
          xhr.open("PUT", uploadUrl);

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.send(file);
        });

        setUploadState("processing");
        onUploadComplete?.();
      } catch (error) {
        setUploadState("error");
        const err = error instanceof Error ? error : new Error("Upload failed");
        setErrorMessage(err.message);
        onUploadError?.(err);
      }
    },
    [
      teacherId,
      lessonId,
      createDirectUpload,
      linkVideoToLesson,
      onUploadComplete,
      onUploadError,
    ]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleInputChange}
        disabled={currentState === "uploading" || currentState === "processing"}
      />

      {/* Upload Zone */}
      {currentState === "idle" && (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary/50 hover:bg-muted/50"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <IconUpload className="size-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Drop your video here</p>
            <p className="text-xs text-muted-foreground">
              or click to browse files
            </p>
          </div>
        </div>
      )}

      {/* Uploading State */}
      {currentState === "uploading" && (
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

      {/* Processing State */}
      {currentState === "processing" && (
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

      {/* Ready State */}
      {currentState === "ready" && video && (
        <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-green-500/20">
            <IconCheck className="size-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              Video ready
            </p>
            {video.duration && (
              <p className="text-xs text-green-600/80 dark:text-green-500/80">
                Duration: {formatDuration(video.duration)}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClick}
            className="text-muted-foreground hover:text-foreground"
          >
            <IconVideo className="size-4" />
            Replace
          </Button>
        </div>
      )}

      {/* Error State */}
      {currentState === "error" && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-destructive/20">
            <IconAlertCircle className="size-5 text-destructive" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">
              Upload failed
            </p>
            {(errorMessage || video?.errorMessage) && (
              <p className="text-xs text-destructive/80">
                {errorMessage || video?.errorMessage}
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleClick}>
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
