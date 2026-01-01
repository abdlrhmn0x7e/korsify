"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { FileUploadState } from "@/hooks/use-upload-files";
import { cn } from "@/lib/utils";
import { IconCloudUpload, IconFile, IconPointer, IconTrash, IconX } from "@tabler/icons-react";
import { useCallback } from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { toastManager } from "./ui/toast";

export interface FileDropZoneProps {
  options?: DropzoneOptions;
  className?: string;
  maxFiles?: number;
  isPending?: boolean;
  fileStates?: FileUploadState[];
  onDrop?: (files: File[]) => void;
  onRemove?: (index: number) => void;
  showFileList?: boolean;
  emptyText?: string;
  dragActiveText?: string;
  uploadingText?: string;
}

export function FileDropzone({
  options = {},
  className,
  maxFiles,
  isPending = false,
  fileStates = [],
  onDrop,
  onRemove,
  showFileList = true,
  emptyText = "Drag and drop files here, or click to select files",
  dragActiveText = "Drop files here to upload",
  uploadingText = "Uploading files...",
}: FileDropZoneProps) {
  const successCount = fileStates.filter((s) => s.status === "success").length;

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      if (maxFiles && successCount >= maxFiles) {
        toastManager.add({
          title: "You've reached the maximum number of files",
          type: "error",
        });
        return;
      }

      const remainingSlots = maxFiles ? maxFiles - successCount : acceptedFiles.length;
      const filesToUpload = acceptedFiles.slice(0, remainingSlots);

      onDrop?.(filesToUpload);
    },
    [onDrop, maxFiles, successCount]
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDropAccepted,
    disabled: isPending,
    noClick: true,
    ...options,
  });

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "hover:bg-input/30 bg-input/20 flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg border-1 border-dashed p-4 text-center transition-colors duration-100",
          isDragActive && "bg-input/60",
          isPending && "pointer-events-none opacity-50",
          className
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <>
            <IconPointer size={32} className="text-muted-foreground" />
            <p className="text-muted-foreground text-sm select-none">
              {dragActiveText}
            </p>
          </>
        ) : isPending ? (
          <>
            <Spinner />
            <p className="text-muted-foreground text-sm select-none">
              {uploadingText}
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <IconCloudUpload size={16} className="text-muted-foreground" />
              <p className="text-muted-foreground text-sm select-none">
                {emptyText}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button type="button" size="sm" onClick={open}>
                <IconCloudUpload />
                Click to select files
              </Button>
            </div>
          </div>
        )}
      </div>

      {showFileList && fileStates.length > 0 && (
        <div className="space-y-2">
          {fileStates.map((state, index) => (
            <FileItem
              key={`${state.file.name}-${index}`}
              state={state}
              onRemove={() => onRemove?.(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FileItemProps {
  state: FileUploadState;
  onRemove?: () => void;
}

function FileItem({ state, onRemove }: FileItemProps) {
  const { file, status, error } = state;

  const statusStyles = {
    pending: "border-muted bg-muted/10",
    uploading: "border-blue-500/30 bg-blue-500/10",
    success: "border-green-500/30 bg-green-500/10",
    error: "border-red-500/30 bg-red-500/10",
  };

  const iconStyles = {
    pending: "bg-muted/20 text-muted-foreground",
    uploading: "bg-blue-500/20 text-blue-600",
    success: "bg-green-500/20 text-green-600",
    error: "bg-red-500/20 text-red-600",
  };

  const textStyles = {
    pending: "text-muted-foreground",
    uploading: "text-blue-700 dark:text-blue-400",
    success: "text-green-700 dark:text-green-400",
    error: "text-red-700 dark:text-red-400",
  };

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3",
        statusStyles[status]
      )}
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-full",
          iconStyles[status]
        )}
      >
        {status === "uploading" ? (
          <Spinner className="size-5" />
        ) : status === "error" ? (
          <IconX className="size-5" />
        ) : (
          <IconFile className="size-5" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", textStyles[status])}>
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {status === "error" && error
            ? error.message
            : status === "uploading"
              ? "Uploading..."
              : status === "success"
                ? "Uploaded"
                : formatFileSize(file.size)}
        </p>
      </div>

      {onRemove && status !== "uploading" && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <IconTrash className="size-4" />
        </Button>
      )}
    </div>
  );
}
