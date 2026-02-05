"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { VideoUploader } from "@/components/video/video-uploader";
import { useUploadFiles, type FileUploadState } from "@/hooks/use-upload-files";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useScopedI18n } from "@/locales/client";

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
  defaultValues?: Partial<LessonFormValues>;
}

export function LessonForm({ onSubmit, defaultValues }: LessonFormProps) {
  const t = useScopedI18n("dashboard.courses.lessonForm.fields");
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: { ...DEFAULT_LESSON_FORM_VALUES, ...defaultValues },
    mode: "onChange",
  });

  const { setValue, watch } = form;
  const hosting = watch("hosting");
  const pdfStorageIds = watch("pdfStorageIds");

  const handlePdfUploadSuccess = useCallback(
    (_file: File, storageId: string) => {
      const current = form.getValues("pdfStorageIds");
      setValue("pdfStorageIds", [...current, storageId]);
    },
    [form, setValue]
  );

  const {
    uploadFiles,
    isPending: isPdfUploading,
    fileStates,
    storageIds,
    reset: resetPdfUpload,
  } = useUploadFiles({
    onFileSuccess: handlePdfUploadSuccess,
  });

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

  const handleVideoReady = useCallback(
    (muxAssetId: Id<"muxAssets">) => {
      setValue("hosting.videoId", muxAssetId);
    },
    [setValue]
  );

  const handleHostingModeChange = useCallback(
    (value: string) => {
      const mode = value as Doc<"lessons">["hosting"]["type"];
      setValue("hosting.type", mode);
      setValue("hosting.videoId", "");
      setValue("hosting.youtubeUrl", "");
    },
    [setValue]
  );

  function handleFormSubmit(values: LessonFormValues) {
    if (isPdfUploading || !isVideoReady) return;

    console.log("Form values:", values);

    onSubmit(values, {
      onSuccess: () => {
        form.reset(DEFAULT_LESSON_FORM_VALUES);
        resetPdfUpload();
      },
    });
  }

  const isVideoReady =
    hosting.type === "mux" ? !!hosting.videoId : !!hosting.youtubeUrl;

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
                <FieldLabel htmlFor={field.name}>{t("title")}</FieldLabel>
                <FieldDescription>{t("titleDescription")}</FieldDescription>
              </FieldContent>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={t("titlePlaceholder")}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                <FieldLabel>{t("description")}</FieldLabel>
                <FieldDescription>
                  {t("descriptionDescription")}
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
          name="hosting.type"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldContent>
                <FieldLabel>{t("hostingMode")}</FieldLabel>
                <FieldDescription>
                  {t("hostingModeDescription")}
                </FieldDescription>
              </FieldContent>
              <RadioGroup
                value={field.value}
                onValueChange={handleHostingModeChange}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="mux" id="hosting-mux" />
                  <Label htmlFor="hosting-mux" className="cursor-pointer">
                    {t("hostingMux")}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="youtube" id="hosting-youtube" />
                  <Label htmlFor="hosting-youtube" className="cursor-pointer">
                    {t("hostingYoutube")}
                  </Label>
                </div>
              </RadioGroup>
            </Field>
          )}
        />

        {hosting.type === "mux" ? (
          <Controller
            name="hosting.videoId"
            control={form.control}
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel>{t("video")}</FieldLabel>
                  <FieldDescription>{t("videoDescription")}</FieldDescription>
                </FieldContent>
                <VideoUploader
                  initialVideoId={
                    defaultValues?.hosting?.type === "mux"
                      ? (defaultValues.hosting.videoId as Id<"muxAssets">)
                      : undefined
                  }
                  onVideoReady={handleVideoReady}
                  className="mt-2"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ) : (
          <Controller
            name="hosting.youtubeUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>
                    {t("youtubeUrl")}
                  </FieldLabel>
                  <FieldDescription>
                    {t("youtubeUrlDescription")}
                  </FieldDescription>
                </FieldContent>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder={t("youtubeUrlPlaceholder")}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        <Field>
          <FieldContent>
            <FieldLabel>{t("attachments")}</FieldLabel>
            <FieldDescription>{t("attachmentsDescription")}</FieldDescription>
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
            emptyText={t("attachmentsEmpty")}
          />
        </Field>
      </form>
    </FormProvider>
  );
}
