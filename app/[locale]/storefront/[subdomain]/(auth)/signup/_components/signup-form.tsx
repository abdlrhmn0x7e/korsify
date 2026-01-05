"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { studentAuthClient } from "@/lib/student-auth-client";
import { useScopedI18n } from "@/locales/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTeacher } from "../../../_components/teacher-context-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import parsePhoneNumber from "libphonenumber-js";
import { APIError } from "better-auth";

export function SignupForm() {
  const t = useScopedI18n("storefront.auth.signup");
  const tErrors = useScopedI18n("storefront.auth.signup.errors");
  const router = useRouter();
  const teacher = useTeacher();

  const formSchema = z
    .object({
      phoneNumber: z
        .string()
        .min(1, { message: tErrors("phoneRequired") })
        .transform((val) =>
          String(parsePhoneNumber(val, { defaultCountry: "EG" })?.number)
        )
        .refine(
          (val) => parsePhoneNumber(val, { defaultCountry: "EG" })?.isValid(),
          {
            message: tErrors("invalidPhone"),
          }
        ),
      name: z.string().min(1, { message: tErrors("nameRequired") }),
      password: z.string().min(1, { message: tErrors("passwordRequired") }),
      confirmPassword: z
        .string()
        .min(1, { message: tErrors("confirmPasswordRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tErrors("passwordMismatch"),
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: createAccount, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const result = await studentAuthClient.signUp.email({
        email: `${values.phoneNumber.replace(/\+/g, "")}@${teacher.subdomain}.com`,
        name: values.name,
        password: values.password,
        teacherId: teacher._id,
        phoneNumber: values.phoneNumber,
      });
      if (result.error) {
        switch (result.error.code) {
          case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
            throw new Error(
              "An account with this phone number already exists for this storefront"
            );
          default:
            throw new Error(result.error.message);
        }
      }
      return result;
    },
    onSuccess: () => {
      toast.success(t("success"));
      router.push("/");
      router.refresh();
    },
    onError: (err: Error) => {
      form.setError("root", { message: err.message });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createAccount(values);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-sm"
    >
      <Controller
        name="phoneNumber"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="phoneNumber">{t("phoneNumber")}</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <span className="text-sm text-muted-foreground">+20</span>
              </InputGroupAddon>
              <InputGroupInput
                {...field}
                id="phoneNumber"
                type="tel"
                autoComplete="off"
                dir="ltr"
                disabled={isPending}
              />
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
            <Input {...field} id="name" type="text" disabled={isPending} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
            <PasswordInput {...field} id="password" disabled={isPending} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="confirmPassword">
              {t("confirmPassword")}
            </FieldLabel>
            <PasswordInput
              {...field}
              id="confirmPassword"
              disabled={isPending}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {form.formState.errors.root && (
        <FieldError>{form.formState.errors.root.message}</FieldError>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending && <Spinner />}
        {t("createAccount")}
      </Button>
    </form>
  );
}
