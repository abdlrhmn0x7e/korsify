"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconCloudUpload, IconPointer } from "@tabler/icons-react";
import { useCallback, type ReactNode } from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";

export interface DropzoneAreaProps {
  options?: DropzoneOptions;
  className?: string;
  disabled?: boolean;
  onFilesSelected?: (files: File[]) => void;
  emptyContent?: ReactNode;
  activeContent?: ReactNode;
  emptyText?: string;
  activeText?: string;
  buttonText?: string;
  icon?: ReactNode;
}

import { useScopedI18n } from "@/locales/client";

export function DropzoneArea({
  options = {},
  className,
  disabled = false,
  onFilesSelected,
  emptyContent,
  activeContent,
  emptyText,
  activeText,
  buttonText,
  icon,
}: DropzoneAreaProps) {
  const t = useScopedI18n("components.dropzoneArea");

  const finalEmptyText = emptyText ?? t("emptyText");
  const finalActiveText = activeText ?? t("activeText");
  const finalButtonText = buttonText ?? t("buttonText");

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected?.(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDropAccepted,
    disabled,
    noClick: true,
    ...options,
  });

  const defaultIcon = icon ?? <IconCloudUpload size={16} className="text-muted-foreground" />;

  return (
    <div
      className={cn(
        "hover:bg-input/30 bg-input/20 flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center transition-colors duration-100",
        isDragActive && "bg-input/60 border-primary/50",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        activeContent ?? (
          <>
            <IconPointer size={32} className="text-muted-foreground" />
            <p className="text-muted-foreground text-sm select-none">
              {finalActiveText}
            </p>
          </>
        )
      ) : (
        emptyContent ?? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {defaultIcon}
              <p className="text-muted-foreground text-sm select-none">
                {finalEmptyText}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button type="button" size="sm" onClick={open}>
                <IconCloudUpload />
                {finalButtonText}
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
