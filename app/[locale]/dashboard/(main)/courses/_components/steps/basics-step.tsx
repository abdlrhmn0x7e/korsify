"use client";

import { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { IconPhoto, IconUpload } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUploadFile } from "@/hooks/use-upload-file";
import { cn } from "@/lib/utils";

import type { CourseFormValues } from "../course-form-types";

export function BasicsStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CourseFormValues>();

  const thumbnailStorageId = watch("thumbnailStorageId");
  const [thumbnailObjectUrl, setThumbnailObjectUrl] = useState<string | null>(
    null
  );

  const { inputRef, isUploading, openFilePicker, upload } = useUploadFile({
    onSuccess: (storageId) => setValue("thumbnailStorageId", storageId),
  });

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Show preview immediately
      setThumbnailObjectUrl(URL.createObjectURL(file));

      // Upload the file
      await upload(file);
    },
    [upload]
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Course Basics</h3>
        <p className="text-sm text-muted-foreground">
          Start with the essentials - give your course a compelling title and an
          eye-catching thumbnail.
        </p>
      </div>

      <Field data-invalid={!!errors.title}>
        <FieldLabel htmlFor="title">Course Title</FieldLabel>
        <FieldDescription>
          Choose a clear, descriptive title that tells students what
          they&apos;ll learn.
        </FieldDescription>
        <Input
          {...register("title")}
          id="title"
          placeholder="e.g., Complete JavaScript Masterclass"
          aria-invalid={!!errors.title}
        />
        {errors.title && <FieldError errors={[errors.title]} />}
      </Field>

      <Field data-invalid={!!errors.thumbnailStorageId}>
        <FieldContent>
          <FieldLabel>Course Thumbnail</FieldLabel>
          <FieldDescription>
            Upload an image that represents your course. Recommended size:
            1280x720 pixels.
          </FieldDescription>
        </FieldContent>

        <div
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
            thumbnailObjectUrl
              ? "border-primary/50 bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
        >
          {thumbnailObjectUrl ? (
            <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-md">
              <Image
                src={thumbnailObjectUrl}
                alt="Course thumbnail preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={openFilePicker}
                  disabled={isUploading}
                >
                  {isUploading ? <Spinner className="size-4" /> : "Change"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-full bg-muted p-3">
                <IconPhoto className="size-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Upload thumbnail</p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or WebP up to 5MB
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFilePicker}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Spinner className="size-4 me-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <IconUpload className="size-4 me-2" />
                    Select Image
                  </>
                )}
              </Button>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {errors.thumbnailStorageId && (
          <FieldError errors={[errors.thumbnailStorageId]} />
        )}

        {thumbnailStorageId && !isUploading && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-green-600" />
            Thumbnail uploaded successfully
          </p>
        )}
      </Field>
    </div>
  );
}
