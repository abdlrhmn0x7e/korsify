import { Controller, useFormContext } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";
import { SettingsFormValues } from "./types";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";

export function Domain() {
  const form = useFormContext<SettingsFormValues>();

  const subdomainValue = form.watch("subdomain");
  const [debouncedSubdomain] = useDebounceValue(
    subdomainValue.toLowerCase().trim(),
    300
  );

  const { data: isAvailable, isPending: isCheckingAvailability } = useQuery({
    ...convexQuery(api.teachers.queries.isSubdomainAvailable, {
      subdomain: debouncedSubdomain,
    }),
    enabled: debouncedSubdomain.length >= 3,
  });

  const showAvailabilityStatus =
    debouncedSubdomain.length >= 3 && subdomainValue === debouncedSubdomain;
  const isOriginalSubdomain = form.getValues("subdomain") === subdomainValue;

  return (
    <div className="space-y-4">
      <Controller
        name="subdomain"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Subdomain</FieldLabel>
              <FieldDescription>The subdomain of your store</FieldDescription>
            </FieldContent>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Enter your subdomain"
            />

            {showAvailabilityStatus && (
              <FieldDescription>
                {isOriginalSubdomain ? (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <IconCheck className="size-4" />
                    This is your current subdomain
                  </span>
                ) : isCheckingAvailability ? (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Spinner />
                    Checking availability...
                  </span>
                ) : isAvailable ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <IconCheck className="size-4" />
                    This subdomain is available!
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-destructive">
                    <IconX className="size-4" />
                    This subdomain is already taken
                  </span>
                )}
              </FieldDescription>
            )}

            {fieldState.error && (
              <span className="text-destructive text-sm flex items-center gap-1">
                <IconAlertCircle className="size-4" />
                <FieldError errors={[fieldState.error]} />
              </span>
            )}
          </Field>
        )}
      />
    </div>
  );
}
