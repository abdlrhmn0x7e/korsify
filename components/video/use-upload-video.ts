"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type VideoStatus = "idle" | "uploading" | "processing" | "ready" | "errored";

interface UploadVideoResult {
  muxAssetId: Id<"muxAssets">;
}

interface UseUploadVideoOptions {
  initialVideoId?: Id<"muxAssets">;
  onUploadStart?: (muxAssetId: Id<"muxAssets">) => void;
  onVideoReady?: (muxAssetId: Id<"muxAssets">) => void;
  onError?: (error: Error) => void;
}

interface UseUploadVideoReturn {
  upload: (file: File) => Promise<Id<"muxAssets"> | null>;
  uploadVideo: (file: File) => void;
  status: VideoStatus;
  progress: number;
  isUploading: boolean;
  isProcessing: boolean;
  isReady: boolean;
  isError: boolean;
  isIdle: boolean;
  error: Error | null;
  muxAssetId: Id<"muxAssets"> | null;
  video: {
    duration?: number;
    aspectRatio?: string;
    playbackId?: string;
    errorMessage?: string;
  } | null;
  reset: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  openFilePicker: () => void;
}

export function useUploadVideo(
  options: UseUploadVideoOptions = {}
): UseUploadVideoReturn {
  const { initialVideoId, onUploadStart, onError } = options;

  // Use ref for onVideoReady to avoid dependency in useEffect
  const onVideoReadyRef = useRef(options.onVideoReady);
  onVideoReadyRef.current = options.onVideoReady;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [muxAssetId, setMuxAssetId] = useState<Id<"muxAssets"> | null>(
    initialVideoId ?? null
  );
  const [lastReadyId, setLastReadyId] = useState<Id<"muxAssets"> | null>(null);

  const createDirectUpload = useAction(api.mux.actions.createDirectUpload);

  const video = useQuery(
    api.teachers.mux.queries.getVideo,
    muxAssetId ? { muxAssetId } : "skip"
  );

  useEffect(() => {
    if (video?.status === "ready" && muxAssetId && lastReadyId !== muxAssetId) {
      setLastReadyId(muxAssetId);
      onVideoReadyRef.current?.(muxAssetId);
    }
  }, [video?.status, muxAssetId, lastReadyId]);

  const mutation = useMutation({
    mutationFn: async (file: File): Promise<UploadVideoResult> => {
      if (!file.type.startsWith("video/")) {
        throw new Error("Please select a video file");
      }

      setProgress(0);

      const { uploadUrl, muxAssetId: newAssetId } = await createDirectUpload(
        {}
      );

      setMuxAssetId(newAssetId);
      onUploadStart?.(newAssetId);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        });

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.open("PUT", uploadUrl);
        xhr.send(file);
      });

      return { muxAssetId: newAssetId };
    },
    onError: (err) => {
      const error = err instanceof Error ? err : new Error(String(err));
      onError?.(error);
    },
  });

  const computedStatus: VideoStatus = mutation.isPending
    ? "uploading"
    : video?.status === "processing" || video?.status === "waiting_upload"
      ? "processing"
      : video?.status === "ready"
        ? "ready"
        : video?.status === "errored" || mutation.isError
          ? "errored"
          : "idle";

  const upload = useCallback(
    async (file: File): Promise<Id<"muxAssets"> | null> => {
      try {
        const result = await mutation.mutateAsync(file);
        return result.muxAssetId;
      } catch {
        return null;
      }
    },
    [mutation]
  );

  const uploadVideo = useCallback(
    (file: File) => {
      mutation.mutate(file);
    },
    [mutation]
  );

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file = e.target.files?.[0];
      if (!file) return;
      await upload(file);
    },
    [upload]
  );

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const reset = useCallback(() => {
    mutation.reset();
    setProgress(0);
    setMuxAssetId(initialVideoId ?? null);
    setLastReadyId(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [mutation, initialVideoId]);

  return {
    upload,
    uploadVideo,
    status: computedStatus,
    progress,
    isUploading: computedStatus === "uploading",
    isProcessing: computedStatus === "processing",
    isReady: computedStatus === "ready",
    isError: computedStatus === "errored",
    isIdle: computedStatus === "idle",
    error: mutation.error instanceof Error ? mutation.error : null,
    muxAssetId,
    video: video
      ? {
          duration: video.duration,
          aspectRatio: video.aspectRatio,
          playbackId: video.playbackId,
          errorMessage: video.errorMessage,
        }
      : null,
    reset,
    inputRef,
    handleChange,
    openFilePicker,
  };
}
