"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUploadFiles } from "@/hooks/use-upload-files";
import { cn } from "@/lib/utils";
import { IconCloudUpload, IconPointer } from "@tabler/icons-react";
import { useCallback } from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { toastManager } from "./ui/toast";

export interface FileDropZoneProps {
  options?: DropzoneOptions;
  className?: string;
  onChange?: () => void;
  maxFiles?: number;
  showFiles?: boolean;
}

export function FileDropzone({
  options = {},
  onChange,
  maxFiles,
  className,
}: FileDropZoneProps) {
  const { uploadFiles, isPending, urls } = useUploadFiles({
    onFileSuccess: () => {
      onChange?.();
    },
  });
  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      if (maxFiles && urls.length >= maxFiles) {
        toastManager.add({
          title: "You've reached the maximum number of files",
          type: "error",
        });
        return;
      }
      uploadFiles(acceptedFiles);
    },
    [uploadFiles, maxFiles, urls]
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDropAccepted,
    disabled: isPending,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
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
        {/*
					This input has it's own state away from any
					external state which could be a problem
				*/}
        <input {...getInputProps()} />

        {isDragActive ? (
          <>
            <IconPointer size={32} className="text-muted-foreground" />

            <p className="text-muted-foreground text-sm select-none">
              Drop files here to upload
            </p>
          </>
        ) : isPending ? (
          <>
            <Spinner />

            <p className="text-muted-foreground text-sm select-none">
              Uploading files...
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <IconCloudUpload size={16} className="text-muted-foreground" />

              <p className="text-muted-foreground text-sm select-none">
                Drag and drop files here, click to select files
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
    </div>
  );
}
