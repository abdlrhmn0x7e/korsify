"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconFile, IconTrash, IconUpload } from "@tabler/icons-react";
import { useCallback } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Editor } from "@/components/editor";
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
import { Switch } from "@/components/ui/switch";
import { VideoUploader } from "@/components/video/video-uploader";
import { useUploadFile } from "@/hooks/use-upload-file";
import { Id } from "@/convex/_generated/dataModel";

import {
  DEFAULT_LESSON_FORM_VALUES,
  lessonFormSchema,
  type LessonFormOnSubmit,
  type LessonFormValues,
} from "./lesson-form-types";

interface LessonFormProps {
  isPending: boolean;
  onSubmit: LessonFormOnSubmit;
  onCancel?: () => void;
}

export function LessonForm({ isPending, onSubmit, onCancel }: LessonFormProps) {
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: DEFAULT_LESSON_FORM_VALUES,
    mode: "onChange",
  });

  const { setValue, watch } = form;
  const videoId = watch("videoId");
  const pdfStorageId = watch("pdfStorageId");

  const {
    inputRef: pdfInputRef,
    isUploading: isPdfUploading,
    openFilePicker: openPdfPicker,
    upload: uploadPdf,
    reset: resetPdfUpload,
  } = useUploadFile({
    onSuccess: ({ storageId }) => {
      setValue("pdfStorageId", storageId);
    },
  });

  const handlePdfChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await uploadPdf(file);
    },
    [uploadPdf]
  );

  const handleRemovePdf = useCallback(() => {
    setValue("pdfStorageId", undefined);
    resetPdfUpload();
  }, [setValue, resetPdfUpload]);

  function handleVideoReady(muxAssetId: Id<"muxAssets">) {
    setValue("videoId", muxAssetId);
  }

  function handleFormSubmit(values: LessonFormValues) {
    onSubmit(values, {
      onSuccess: () => {
        form.reset(DEFAULT_LESSON_FORM_VALUES);
      },
    });
  }

  const isVideoReady = !!videoId;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-6"
      >
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Lesson Title</FieldLabel>
                <FieldDescription>
                  A clear, descriptive title for this lesson.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. Introduction to Variables"
              />
            </Field>
          )}
        />

        <Controller
          name="videoId"
          control={form.control}
          render={({ fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel>Lesson Video</FieldLabel>
                <FieldDescription>
                  Upload the video for this lesson. Video is required before saving.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
              <VideoUploader
                onVideoReady={handleVideoReady}
                className="mt-2"
              />
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex-1 flex flex-col">
              <FieldContent>
                <FieldLabel>Description (Optional)</FieldLabel>
                <FieldDescription>
                  Add details about what students will learn in this lesson.
                </FieldDescription>
              </FieldContent>
              <div className="min-h-48 mt-2">
                <Editor
                  defaultContent={form.getValues("description")}
                  onUpdate={(json) => setValue("description", json)}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldContent>
            <FieldLabel>PDF Attachment (Optional)</FieldLabel>
            <FieldDescription>
              Add a downloadable PDF resource for this lesson.
            </FieldDescription>
          </FieldContent>

          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handlePdfChange}
          />

          {pdfStorageId ? (
            <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 mt-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-500/20">
                <IconFile className="size-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  PDF uploaded
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePdf}
                className="text-muted-foreground hover:text-destructive"
              >
                <IconTrash className="size-4" />
                Remove
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openPdfPicker}
              disabled={isPdfUploading}
              className="mt-2 w-fit"
            >
              {isPdfUploading ? (
                <>
                  <Spinner className="size-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <IconUpload className="size-4" />
                  Upload PDF
                </>
              )}
            </Button>
          )}
        </Field>

        <Controller
          name="isFree"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="isFree">Free Preview</FieldLabel>
                <FieldDescription>
                  Allow non-enrolled students to preview this lesson for free.
                </FieldDescription>
              </FieldContent>
              <Switch
                id="isFree"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </Field>
          )}
        />

        <div className="flex justify-end gap-2 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending || !isVideoReady}>
            {isPending ? <Spinner /> : "Add Lesson"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
