"use client";

import { useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
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

import {
  slugify,
  useCourseFormContext,
  type CourseFormValues,
} from "../course-form-types";
import { ImageWithFallback } from "@/components/image/image-with-fallback";
import { SuspendableImage } from "@/components/image/suspendable-image";

export function BasicsStep() {
  const { control, setValue, watch } = useFormContext<CourseFormValues>();
  const { mode } = useCourseFormContext();

  const thumbnailStorageId = watch("thumbnailStorageId");
  const thumbnailPreviewUrl = watch("thumbnailPreviewUrl");

  const { inputRef, isUploading, openFilePicker, upload } = useUploadFile({
    onSuccess: ({ storageId, url }) => {
      setValue("thumbnailStorageId", storageId);
      if (url) setValue("thumbnailPreviewUrl", url);
    },
  });

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

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

      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Course Title</FieldLabel>
              <FieldDescription>
                Choose a clear, descriptive title that tells students what
                they&apos;ll learn.
              </FieldDescription>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e.target.value);
                // Only auto-generate slug in create mode
                if (mode === "create") {
                  setValue("slug", slugify(e.target.value));
                }
              }}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="eg. Mathematics 101"
            />
          </Field>
        )}
      />

      <Controller
        name="thumbnailStorageId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Course Thumbnail</FieldLabel>
              <FieldDescription>
                Choose a clear, descriptive title that tells students what
                they&apos;ll learn.
              </FieldDescription>
            </FieldContent>
            <div
              className={cn(
                "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
                thumbnailPreviewUrl
                  ? "border-primary/50 bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              )}
            >
              {thumbnailPreviewUrl ? (
                <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-md">
                  <SuspendableImage
                    src={thumbnailPreviewUrl}
                    alt="Course thumbnail preview"
                    className="object-cover size-full"
                    width={640}
                    height={360}
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

            {thumbnailStorageId && !isUploading && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-green-600" />
                Thumbnail uploaded successfully
              </p>
            )}

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
