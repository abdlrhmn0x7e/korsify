"use client";

import { useFormContext } from "react-hook-form";

import { Editor } from "@/components/editor";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import type { CourseFormValues } from "../course-form-types";
import { useScopedI18n } from "@/locales/client";

export function DescriptionStep() {
  const t = useScopedI18n("dashboard.courses.form");
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CourseFormValues>();

  const description = watch("description");

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{t("steps.description.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("steps.description.description")}
        </p>
      </div>

      <Field
        data-invalid={!!errors.description}
        className="flex-1 flex flex-col"
      >
        <FieldLabel>{t("fields.description")}</FieldLabel>
        <FieldDescription>
          {t("fields.description")}
        </FieldDescription>

        <div className="flex-1 min-h-0">
          <Editor
            defaultContent={description}
            onUpdate={(json) => setValue("description", json)}
          />
        </div>

        {errors.description && <FieldError errors={[errors.description]} />}
      </Field>
    </div>
  );
}
