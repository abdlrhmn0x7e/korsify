"use client";

import { useFormContext } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useScopedI18n } from "@/locales/client";
import { IconPhotoX, IconUpload } from "@tabler/icons-react";
import { useUploadFile } from "@/hooks/use-upload-file";
import type { OnboardingFormValues } from "../types";
import { useCallback, useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";

export function BrandingStep() {
  const t = useScopedI18n("onboarding.steps.branding");
  const { register, watch, setValue } = useFormContext<OnboardingFormValues>();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const logoStorageId = watch("logoStorageId");
  const coverStorageId = watch("coverStorageId");
  const primaryColor = watch("primaryColor") || "#6366f1";

  const [logoObjectUrl, setLogoObjectUrl] = useState<string | null>(null);
  const { inputRef: logoInputRef, ...logoUpload } = useUploadFile({
    onSuccess: ({ storageId }) => setValue("logoStorageId", storageId),
  });
  const handleLogoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      logoUpload.handleChange(e);
      setLogoObjectUrl(URL.createObjectURL(file));
    },
    [logoUpload]
  );

  const [coverObjectUrl, setCoverObjectUrl] = useState<string | null>(null);
  const { inputRef: coverInputRef, ...coverUpload } = useUploadFile({
    onSuccess: ({ storageId }) => setValue("coverStorageId", storageId),
  });
  const handleCoverChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      coverUpload.handleChange(e);
      setCoverObjectUrl(URL.createObjectURL(file));
    },
    [coverUpload]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel>{t("logo")}</FieldLabel>
            <FieldDescription>{t("logoDescription")}</FieldDescription>
          </FieldContent>
          <Button
            type="button"
            variant="outline"
            onClick={logoUpload.openFilePicker}
            disabled={logoUpload.isUploading}
          >
            {logoUpload.isUploading ? (
              <Spinner className="size-4 me-2" />
            ) : (
              <IconUpload className="size-4 me-2" />
            )}
            {logoStorageId ? "Change" : t("upload")}
          </Button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
        </Field>

        {logoObjectUrl && (
          <div className="rounded-md size-24 overflow-hidden border">
            <Image
              src={logoObjectUrl}
              alt={t("logo")}
              width={64}
              height={64}
              className="size-full object-cover"
            />
          </div>
        )}

        {!logoObjectUrl && logoStorageId && (
          <div className="rounded-md size-24 overflow-hidden border">
            <div className="size-full bg-muted flex items-center justify-center">
              <IconPhotoX className="size-6" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Field orientation={isMobile ? "responsive" : "horizontal"}>
          <FieldContent>
            <FieldLabel>{t("coverImage")}</FieldLabel>
            <FieldDescription>{t("coverImageDescription")}</FieldDescription>
          </FieldContent>

          <Button
            type="button"
            variant="outline"
            onClick={coverUpload.openFilePicker}
            disabled={coverUpload.isUploading}
          >
            {coverUpload.isUploading ? (
              <Spinner className="size-4 me-2" />
            ) : (
              <IconUpload className="size-4 me-2" />
            )}
            {coverStorageId ? "Change" : t("upload")}
          </Button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />
        </Field>
        {coverObjectUrl && (
          <div className="rounded-md size-24 overflow-hidden border">
            <Image
              src={coverObjectUrl}
              alt={t("coverImage")}
              width={64}
              height={64}
              className="size-full object-cover"
            />
          </div>
        )}
        {!coverObjectUrl && coverStorageId && (
          <div className="rounded-md size-24 overflow-hidden border">
            <div className="size-full bg-muted flex items-center justify-center">
              <IconPhotoX className="size-6" />
            </div>
          </div>
        )}
      </div>

      <Field orientation={isMobile ? "responsive" : "horizontal"}>
        <FieldContent>
          <FieldLabel htmlFor="primaryColor">{t("primaryColor")}</FieldLabel>
          <FieldDescription>{t("primaryColorDescription")}</FieldDescription>
        </FieldContent>
        <div className="flex items-center gap-3">
          <Input
            {...register("primaryColor")}
            id="primaryColor"
            type="color"
            value={primaryColor}
            className="w-16 cursor-pointer"
          />
          <Input
            type="text"
            value={primaryColor}
            onChange={(e) => setValue("primaryColor", e.target.value)}
            placeholder="#6366f1"
          />
        </div>
      </Field>
    </div>
  );
}
