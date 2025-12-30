"use client";

import { useCallback, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

interface UploadResult {
  storageId: string;
}

interface UseUploadFileOptions {
  onSuccess?: (storageId: string) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

interface UseUploadFileReturn {
  upload: (file: File) => Promise<string | null>;
  uploadFile: (file: File) => void;
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

      return { storageId: json.storageId as string };
    },
    onSuccess: (data) => {
      onSuccess?.(data.storageId);
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

  const uploadFile = useCallback(
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
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [mutation]);

  return {
    upload,
    uploadFile,
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
