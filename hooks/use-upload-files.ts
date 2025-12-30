"use client";

import { useCallback, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import type { Id } from "@/convex/_generated/dataModel";

export type FileUploadStatus = "pending" | "uploading" | "success" | "error";

export interface FileUploadState {
  file: File;
  status: FileUploadStatus;
  storageId: string | null;
  url: string | null;
  error: Error | null;
}

interface UploadFilesResult {
  results: FileUploadState[];
  storageIds: string[];
  urls: string[];
  successCount: number;
  errorCount: number;
}

interface UseUploadFilesOptions {
  onFileSuccess?: (file: File, storageId: string, url: string) => void;
  onFileError?: (file: File, error: Error) => void;
  maxConcurrent?: number;
}

interface UseUploadFilesReturn {
  upload: (files: File[]) => Promise<UploadFilesResult>;
  uploadFiles: (files: File[]) => void;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
  error: Error | null;
  data: UploadFilesResult | null;
  fileStates: FileUploadState[];
  successCount: number;
  errorCount: number;
  storageIds: string[];
  urls: string[];
  reset: () => void;
}

export function useUploadFiles(
  options: UseUploadFilesOptions = {}
): UseUploadFilesReturn {
  const { onFileSuccess, onFileError, maxConcurrent = 3 } = options;

  const [fileStates, setFileStates] = useState<FileUploadState[]>([]);

  const generateUploadUrlFn = useConvexMutation(
    api.storage.mutations.generateUploadUrl
  );
  const getStorageUrlFn = useConvexMutation(
    api.storage.mutations.getUrl
  );

  const uploadSingleFile = useCallback(
    async (file: File): Promise<FileUploadState> => {
      try {
        setFileStates((prev) =>
          prev.map((s) =>
            s.file === file ? { ...s, status: "uploading" as const } : s
          )
        );

        const postUrl = await generateUploadUrlFn({});

        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        const json = await result.json();
        if (!result.ok) {
          throw new Error(`Upload failed: ${JSON.stringify(json)}`);
        }

        const storageId = json.storageId as Id<"_storage">;
        const url = await getStorageUrlFn({ storageId });

        const successState: FileUploadState = {
          file,
          status: "success",
          storageId,
          url,
          error: null,
        };

        setFileStates((prev) =>
          prev.map((s) => (s.file === file ? successState : s))
        );

        if (url) {
          onFileSuccess?.(file, storageId, url);
        }
        return successState;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        const errorState: FileUploadState = {
          file,
          status: "error",
          storageId: null,
          url: null,
          error,
        };

        setFileStates((prev) =>
          prev.map((s) => (s.file === file ? errorState : s))
        );

        onFileError?.(file, error);
        return errorState;
      }
    },
    [generateUploadUrlFn, getStorageUrlFn, onFileSuccess, onFileError]
  );

  const mutation = useMutation({
    mutationFn: async (files: File[]): Promise<UploadFilesResult> => {
      if (files.length === 0) {
        return { results: [], storageIds: [], urls: [], successCount: 0, errorCount: 0 };
      }

      const initialStates: FileUploadState[] = files.map((file) => ({
        file,
        status: "pending" as const,
        storageId: null,
        url: null,
        error: null,
      }));
      setFileStates(initialStates);

      const results: FileUploadState[] = [];
      const queue = [...files];

      const processNext = async (): Promise<void> => {
        const file = queue.shift();
        if (!file) return;

        const result = await uploadSingleFile(file);
        results.push(result);

        if (queue.length > 0) {
          await processNext();
        }
      };

      const workers = Array(Math.min(maxConcurrent, files.length))
        .fill(null)
        .map(() => processNext());

      await Promise.all(workers);

      const storageIds = results
        .filter((r) => r.storageId !== null)
        .map((r) => r.storageId as string);
      const urls = results
        .filter((r) => r.url !== null)
        .map((r) => r.url as string);
      const successCount = results.filter((r) => r.status === "success").length;
      const errorCount = results.filter((r) => r.status === "error").length;

      if (errorCount > 0 && successCount === 0) {
        throw new Error(`All ${errorCount} file(s) failed to upload`);
      }

      return { results, storageIds, urls, successCount, errorCount };
    },
  });

  const upload = useCallback(
    async (files: File[]): Promise<UploadFilesResult> => {
      return mutation.mutateAsync(files);
    },
    [mutation]
  );

  const uploadFiles = useCallback(
    (files: File[]) => {
      mutation.mutate(files);
    },
    [mutation]
  );

  const reset = useCallback(() => {
    mutation.reset();
    setFileStates([]);
  }, [mutation]);

  const successCount = fileStates.filter((s) => s.status === "success").length;
  const errorCount = fileStates.filter((s) => s.status === "error").length;
  const storageIds = fileStates
    .filter((s) => s.storageId !== null)
    .map((s) => s.storageId as string);
  const urls = fileStates
    .filter((s) => s.url !== null)
    .map((s) => s.url as string);

  return {
    upload,
    uploadFiles,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    isIdle: mutation.isIdle,
    error: mutation.error instanceof Error ? mutation.error : null,
    data: mutation.data ?? null,
    fileStates,
    successCount,
    errorCount,
    storageIds,
    urls,
    reset,
  };
}
