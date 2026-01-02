"use client";

import { Controller, useFormContext } from "react-hook-form";
import { SettingsFormValues } from "./types";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { IconPhotoX, IconUpload } from "@tabler/icons-react";
import { useUploadFile } from "@/hooks/use-upload-file";
import { useCallback, useEffectEvent, useLayoutEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export function Branding() {
  const form = useFormContext<SettingsFormValues>();
  const getStorageUrlFn = useMutation(api.storage.mutations.getUrl);

  const logoStorageId = form.watch("branding.logoStorageId");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { inputRef: logoInputRef, ...logoUpload } = useUploadFile({
    onSuccess: ({ storageId }) =>
      form.setValue("branding.logoStorageId", storageId),
  });
  const getInitialLogoUrl = useEffectEvent(async () => {
    if (!logoStorageId) return;
    const url = await getStorageUrlFn({
      storageId: logoStorageId as Id<"_storage">,
    });
    setLogoUrl(url);
  });

  const coverStorageId = form.watch("branding.coverStorageId");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const { inputRef: coverInputRef, ...coverUpload } = useUploadFile({
    onSuccess: ({ storageId }) =>
      form.setValue("branding.coverStorageId", storageId),
  });
  const getInitialCoverUrl = useEffectEvent(async () => {
    if (!coverStorageId) return;
    const url = await getStorageUrlFn({
      storageId: coverStorageId as Id<"_storage">,
    });
    setCoverUrl(url);
  });

  useLayoutEffect(() => {
    void getInitialLogoUrl();
    void getInitialCoverUrl();
  }, []);

  const handleLogoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      logoUpload.handleChange(e);
      setLogoUrl(URL.createObjectURL(file));
    },
    [logoUpload]
  );

  const handleCoverChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      coverUpload.handleChange(e);
      setCoverUrl(URL.createObjectURL(file));
    },
    [coverUpload]
  );

  return (
    <div className="space-y-4 max-h-full overflow-y-auto">
      <Controller
        name="branding.primaryColor"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Primary Color</FieldLabel>
              <FieldDescription>
                The primary color of your store
              </FieldDescription>
            </FieldContent>
            <div className="flex items-center gap-1">
              <Input
                {...field}
                id={field.name}
                type="color"
                value={field.value}
                className="w-16 cursor-pointer"
              />
              <Input
                type="text"
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="#6366f1"
              />
            </div>
          </Field>
        )}
      />
      <div className="space-y-2">
        <Controller
          name="branding.logoStorageId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Logo</FieldLabel>
                <FieldDescription>The logo of your school</FieldDescription>
              </FieldContent>
              <Button type="button" variant="outline">
                <IconUpload />
                Change
              </Button>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
                hidden
              />
            </Field>
          )}
        />
        <div className="rounded-md size-24 overflow-hidden border">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Logo"
              width={256}
              height={256}
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full bg-muted flex items-center justify-center">
              <IconPhotoX className="size-6" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Controller
          name="branding.coverStorageId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Cover Image</FieldLabel>
                <FieldDescription>
                  The cover image of your store
                </FieldDescription>
              </FieldContent>
              <Button type="button" variant="outline">
                <IconUpload />
                Change
              </Button>

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
                hidden
              />
            </Field>
          )}
        />
        <div className="rounded-md overflow-hidden border aspect-video">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt="Cover Image"
              width={1280}
              height={720}
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full bg-muted flex items-center justify-center">
              <IconPhotoX className="size-6" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
