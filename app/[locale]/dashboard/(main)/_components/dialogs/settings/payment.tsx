"use client";

import { Controller, useFormContext } from "react-hook-form";
import { SettingsFormValues } from "./types";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";

export function Payment() {
  const form = useFormContext<SettingsFormValues>();

  return (
    <div className="space-y-4">
      <Controller
        name="paymentInfo.vodafoneCash"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Vodafone Cash</FieldLabel>
              <FieldDescription>
                The phone number of your Vodafone Cash account
              </FieldDescription>
            </FieldContent>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText className="text-sm text-muted-foreground">
                  +20
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                {...field}
                id={field.name}
                placeholder="Enter your Vodafone Cash number"
              />
            </InputGroup>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="paymentInfo.instaPay"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>InstaPay</FieldLabel>
              <FieldDescription>
                The username of your InstaPay account
              </FieldDescription>
            </FieldContent>
            <InputGroup>
              <InputGroupInput
                {...field}
                id={field.name}
                placeholder="Enter your InstaPay username"
              />
            </InputGroup>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="paymentInfo.instructions"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Instructions</FieldLabel>
              <FieldDescription>
                The instructions for your payment
              </FieldDescription>
            </FieldContent>
            <Textarea
              {...field}
              id={field.name}
              placeholder="Enter your payment instructions"
            />
          </Field>
        )}
      />
    </div>
  );
}
