"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Editor } from "@/components/editor";
import { FileDropzone } from "@/components/file-dropzone";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { VideoUploader } from "@/components/video/video-uploader";
import { useUploadFiles, type FileUploadState } from "@/hooks/use-upload-files";
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

export function LessonForm({ onSubmit }: LessonFormProps) {
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: DEFAULT_LESSON_FORM_VALUES,
    mode: "onChange",
  });

  const { setValue, watch } = form;
  const videoId = watch("videoId");
  const pdfStorageIds = watch("pdfStorageIds");

  const {
    uploadFiles,
    isPending: isPdfUploading,
    fileStates,
    storageIds,
    reset: resetPdfUpload,
  } = useUploadFiles();

  useEffect(() => {
    if (storageIds.length > 0) {
      setValue("pdfStorageIds", storageIds);
    }
  }, [storageIds, setValue]);

  const handlePdfDrop = useCallback(
    (files: File[]) => {
      uploadFiles(files);
    },
    [uploadFiles]
  );

  const handlePdfRemove = useCallback(
    (index: number) => {
      const newStorageIds = [...pdfStorageIds];
      newStorageIds.splice(index, 1);
      setValue("pdfStorageIds", newStorageIds);

      if (newStorageIds.length === 0) {
        resetPdfUpload();
      }
    },
    [pdfStorageIds, setValue, resetPdfUpload]
  );

  function handleVideoReady(muxAssetId: Id<"muxAssets">) {
    setValue("videoId", muxAssetId);
  }

  function handleFormSubmit(values: LessonFormValues) {
    if (isPdfUploading || !isVideoReady) return;

    onSubmit(values, {
      onSuccess: () => {
        form.reset(DEFAULT_LESSON_FORM_VALUES);
        resetPdfUpload();
      },
    });
  }

  const isVideoReady = !!videoId;

  const existingFileStates: Array<FileUploadState> = pdfStorageIds
    .filter((id) => !storageIds.includes(id))
    .map((id) => ({
      file: new File([], `PDF ${id.slice(-6)}`),
      status: "success" as const,
      storageId: id,
      url: null,
      error: null,
    }));

  const allFileStates = [...existingFileStates, ...fileStates];

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 ps-1"
        id="lesson-form"
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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

        <Controller
          name="description"
          control={form.control}
          render={({ fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex-1 flex flex-col"
            >
              <FieldContent>
                <FieldLabel>Description (Optional)</FieldLabel>
                <FieldDescription>
                  Add details about what students will learn in this lesson.
                </FieldDescription>
              </FieldContent>
              <div className="h-96 mt-2">
                <Editor
                  defaultContent={form.getValues("description")}
                  onUpdate={(json) => setValue("description", json)}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                  Upload the video for this lesson. Video is required before
                  saving.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <VideoUploader onVideoReady={handleVideoReady} className="mt-2" />
            </Field>
          )}
        />

        <Field>
          <FieldContent>
            <FieldLabel>PDF Attachments (Optional)</FieldLabel>
            <FieldDescription>
              Add downloadable PDF resources for this lesson.
            </FieldDescription>
          </FieldContent>

          <FileDropzone
            className="mt-2"
            options={{
              accept: {
                "application/pdf": [".pdf"],
              },
            }}
            isPending={isPdfUploading}
            fileStates={allFileStates}
            onDrop={handlePdfDrop}
            onRemove={handlePdfRemove}
            emptyText="Drag and drop PDF files here, or click to select"
          />
        </Field>
      </form>
    </FormProvider>
  );
}
