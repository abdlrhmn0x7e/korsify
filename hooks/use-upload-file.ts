"use client";

import { useCallback, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

interface UseUploadFileOptions {
  onSuccess?: (storageId: string) => void;
  onError?: (error: Error) => void;
}

interface UseUploadFileReturn {
  upload: (file: File) => Promise<string | null>;
  isUploading: boolean;
  error: Error | null;
  reset: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  openFilePicker: () => void;
}

export function useUploadFile(
  options: UseUploadFileOptions = {}
): UseUploadFileReturn {
  const { onSuccess, onError } = options;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    mutateAsync: generateUploadUrl,
    isPending: isUploading,
    error: mutationError,
    reset: resetMutation,
  } = useMutation({
    mutationFn: useConvexMutation(api.teachers.mutations.generateUploadUrl),
  });

  const error = mutationError instanceof Error ? mutationError : null;

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        const postUrl = await generateUploadUrl({});
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        const json = await result.json();
        if (!result.ok) {
          throw new Error(`Upload failed: ${JSON.stringify(json)}`);
        }

        const storageId = json.storageId as string;
        onSuccess?.(storageId);
        return storageId;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        onError?.(error);
        return null;
      }
    },
    [generateUploadUrl, onSuccess, onError]
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
    resetMutation();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [resetMutation]);

  return {
    upload,
    isUploading,
    error,
    reset,
    inputRef,
    handleChange,
    openFilePicker,
  };
}
