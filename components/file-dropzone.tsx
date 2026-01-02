"use client";

import { DropzoneArea } from "@/components/ui/dropzone-area";
import { Spinner } from "@/components/ui/spinner";
import type { FileUploadState } from "@/hooks/use-upload-files";
import { cn } from "@/lib/utils";
import { IconFile, IconX } from "@tabler/icons-react";
import { useCallback, type ReactNode } from "react";
import type { DropzoneOptions } from "react-dropzone";
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
  pendingContent?: ReactNode;
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
  pendingContent,
}: FileDropZoneProps) {
  const successCount = fileStates.filter((s) => s.status === "success").length;

  const handleFilesSelected = useCallback(
    (acceptedFiles: File[]) => {
      if (maxFiles && successCount >= maxFiles) {
        toastManager.add({
          title: "You've reached the maximum number of files",
          type: "error",
        });
        return;
      }

      const remainingSlots = maxFiles
        ? maxFiles - successCount
        : acceptedFiles.length;
      const filesToUpload = acceptedFiles.slice(0, remainingSlots);

      onDrop?.(filesToUpload);
    },
    [onDrop, maxFiles, successCount]
  );

  const defaultPendingContent = (
    <>
      <Spinner />
      <p className="text-muted-foreground text-sm select-none">
        {uploadingText}
      </p>
    </>
  );

  return (
    <div className="space-y-3">
      {isPending ? (
        <div
          className={cn(
            "bg-input/20 flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center pointer-events-none opacity-50",
            className
          )}
        >
          {pendingContent ?? defaultPendingContent}
        </div>
      ) : (
        <DropzoneArea
          options={options}
          className={className}
          disabled={isPending}
          onFilesSelected={handleFilesSelected}
          emptyText={emptyText}
          activeText={dragActiveText}
        />
      )}

      {showFileList && fileStates.length > 0 && (
        <div className="rounded-lg border divide-y">
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

  const iconStyles = {
    pending: "text-muted-foreground",
    uploading: "text-blue-500",
    success: "text-muted-foreground",
    error: "text-red-500",
  };

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function getStatusText(): string | null {
    if (status === "error" && error) return error.message;
    if (status === "uploading") return "Uploading...";
    return null;
  }

  const statusText = getStatusText();

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div className={cn("shrink-0", iconStyles[status])}>
        {status === "uploading" ? (
          <Spinner className="size-4" />
        ) : status === "error" ? (
          <IconX className="size-4" />
        ) : (
          <IconFile className="size-4" />
        )}
      </div>

      <span className="flex-1 min-w-0 text-sm truncate">{file.name}</span>

      {statusText ? (
        <span
          className={cn(
            "shrink-0 text-xs",
            status === "error" ? "text-red-500" : "text-muted-foreground"
          )}
        >
          {statusText}
        </span>
      ) : file.size > 0 ? (
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </span>
      ) : null}

      {onRemove && status !== "uploading" && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-muted/50 transition-colors"
        >
          <IconX className="size-3.5" />
        </button>
      )}
    </div>
  );
}
