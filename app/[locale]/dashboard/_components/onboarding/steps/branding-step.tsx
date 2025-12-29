"use client";

import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useMutation } from "convex/react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { useScopedI18n } from "@/locales/client";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useState } from "react";
import type { OnboardingFormValues } from "../../../_components/onboarding-dialog";

export function BrandingStep() {
  const t = useScopedI18n("onboarding.steps.branding");
  const { register, watch, setValue } = useFormContext<OnboardingFormValues>();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const logoStorageId = watch("logoStorageId");
  const coverStorageId = watch("coverStorageId");
  const primaryColor = watch("primaryColor") || "#6366f1";

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const generateUploadUrl = useMutation(api.teachers.mutations.generateUploadUrl);

  const uploadFile = async (file: File): Promise<string> => {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const json = await result.json();
    if (!result.ok) {
      throw new Error(`Upload failed: ${JSON.stringify(json)}`);
    }
    return json.storageId as string;
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploadingLogo(true);
    try {
      const storageId = await uploadFile(file);
      setValue("logoStorageId", storageId);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploadingCover(true);
    try {
      const storageId = await uploadFile(file);
      setValue("coverStorageId", storageId);
    } finally {
      setIsUploadingCover(false);
    }
  };

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel>{t("logo")}</FieldLabel>
        <FieldDescription>{t("logoDescription")}</FieldDescription>
        <div className="mt-2">
          {logoStorageId ? (
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-lg border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                Uploaded
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground"
                onClick={() => {
                  setValue("logoStorageId", undefined);
                  if (logoInputRef.current) logoInputRef.current.value = "";
                }}
              >
                <IconX className="size-3" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => logoInputRef.current?.click()}
              disabled={isUploadingLogo}
            >
              {isUploadingLogo ? (
                <Spinner className="size-4 me-2" />
              ) : (
                <IconUpload className="size-4 me-2" />
              )}
              {t("upload")}
            </Button>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>
      </Field>

      <Field>
        <FieldLabel>{t("coverImage")}</FieldLabel>
        <FieldDescription>{t("coverImageDescription")}</FieldDescription>
        <div className="mt-2">
          {coverStorageId ? (
            <div className="relative">
              <div className="w-full h-32 rounded-lg border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                Uploaded
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="absolute top-2 right-2 rounded-full bg-destructive text-destructive-foreground"
                onClick={() => {
                  setValue("coverStorageId", undefined);
                  if (coverInputRef.current) coverInputRef.current.value = "";
                }}
              >
                <IconX className="size-3" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploadingCover}
            >
              {isUploadingCover ? (
                <Spinner className="size-4 me-2" />
              ) : (
                <IconUpload className="size-4 me-2" />
              )}
              {t("upload")}
            </Button>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="primaryColor">{t("primaryColor")}</FieldLabel>
        <FieldDescription>{t("primaryColorDescription")}</FieldDescription>
        <div className="flex items-center gap-3 mt-2">
          <Input
            {...register("primaryColor")}
            id="primaryColor"
            type="color"
            value={primaryColor}
            className="w-16 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={primaryColor}
            onChange={(e) => setValue("primaryColor", e.target.value)}
            className="w-28"
            placeholder="#6366f1"
          />
        </div>
      </Field>
    </div>
  );
}
