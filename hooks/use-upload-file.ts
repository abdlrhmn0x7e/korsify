"use client";

import { useCallback, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { Id } from "@/convex/_generated/dataModel";

interface UploadResult {
  storageId: string;
  url: string | null;
}

interface UseUploadFileOptions {
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

interface UseUploadFileReturn {
  upload: (file: File) => Promise<string | null>;
  isUploading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
  error: Error | null;
  data: UploadResult | null;
  reset: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  openFilePicker: () => void;
}

export function useUploadFile(
  options: UseUploadFileOptions = {}
): UseUploadFileReturn {
  const { onSuccess, onError, onSettled } = options;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const generateUploadUrlFn = useConvexMutation(
    api.storage.mutations.generateUploadUrl
  );
  const getStorageUrlFn = useConvexMutation(api.storage.mutations.getUrl);

  const mutation = useMutation({
    mutationFn: async (file: File): Promise<UploadResult> => {
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

      return { storageId, url };
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (err) => {
      const error = err instanceof Error ? err : new Error(String(err));
      onError?.(error);
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        const result = await mutation.mutateAsync(file);
        return result.storageId;
      } catch {
        return null;
      }
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
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [mutation]);

  return {
    upload,
    isUploading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    isIdle: mutation.isIdle,
    error: mutation.error instanceof Error ? mutation.error : null,
    data: mutation.data ?? null,
    reset,
    inputRef,
    handleChange,
    openFilePicker,
  };
}
