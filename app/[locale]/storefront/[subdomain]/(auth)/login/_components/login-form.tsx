"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { studentAuthClient } from "@/lib/student-auth-client";
import { useScopedI18n } from "@/locales/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import parsePhoneNumber from "libphonenumber-js";
import { useTeacher } from "../../../_components/teacher-context-provider";

export function LoginForm() {
  const t = useScopedI18n("storefront.auth.login");
  const tErrors = useScopedI18n("storefront.auth.login.errors");
  const router = useRouter();
  const teacher = useTeacher();

  const formSchema = z.object({
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
    password: z.string().min(1, { message: tErrors("passwordRequired") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const result = await studentAuthClient.signIn.phoneNumber({
        phoneNumber: values.phoneNumber,
        password: values.password,
        fetchOptions: {
          body: {
            teacherId: teacher._id,
          },
        },
      });
      if (result.error) {
        throw new Error(result.error.message);
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
    signIn(values);
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

      {form.formState.errors.root && (
        <FieldError>{form.formState.errors.root.message}</FieldError>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending && <Spinner />}
        {t("submit")}
      </Button>
    </form>
  );
}
