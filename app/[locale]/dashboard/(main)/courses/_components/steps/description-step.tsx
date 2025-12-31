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

export function DescriptionStep() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CourseFormValues>();

  const description = watch("description");

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Course Description</h3>
        <p className="text-sm text-muted-foreground">
          Tell potential students what your course is about. A great description
          helps students understand what they&apos;ll learn and why they should
          enroll.
        </p>
      </div>

      <Field
        data-invalid={!!errors.description}
        className="flex-1 flex flex-col"
      >
        <FieldLabel>Description</FieldLabel>
        <FieldDescription>
          Use formatting to organize your content. Include learning outcomes,
          prerequisites, and who this course is for.
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
