"use client";

import { Field, FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCircleCheckFilled, IconSend } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import parsePhoneNumber from "libphonenumber-js";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useScopedI18n } from "@/locales/client";

import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function EarlyAccessForm() {
  const t = useScopedI18n("landing");

  const formSchema = z.object({
    phoneNumber: z
      .string()
      .min(1, { message: t("cta.errors.required") })
      .transform((val) =>
        String(parsePhoneNumber(val, { defaultCountry: "EG" })?.number)
      )
      .refine(
        (val) => parsePhoneNumber(val, { defaultCountry: "EG" })?.isValid(),
        {
          message: t("cta.errors.invalidPhone"),
        }
      ),
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });
  const { mutate: sendEarlyAccessRequest, isPending } = useMutation({
    mutationFn: useConvexMutation(api.earlyAccess.requests.create),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      sendEarlyAccessRequest(values);
      setIsSuccess(true);
    } catch {
      toast.error("Failed to send early access request. Please try again.");
    }
  }

  return (
    <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="phoneNumber"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <InputGroup className="bg-background w-full h-auto flex flex-col sm:flex-row sm:h-12 p-1.5 gap-2 sm:gap-0 sm:p-0 sm:ps-4 items-stretch sm:items-center">
              <span className="text-sm text-muted-foreground">+20</span>

              <InputGroupInput
                {...field}
                id="phoneNumber"
                autoComplete="off"
                placeholder={t("cta.placeholder")}
                className="h-11 sm:h-auto px-2 sm:px-0"
                disabled={isPending || isSuccess}
              />

              <InputGroupAddon
                align="inline-end"
                className="w-full sm:w-auto p-0 sm:pe-3 me-0 sm:-me-2"
              >
                <Button
                  size="xl"
                  type="submit"
                  className="w-full sm:w-48 overflow-hidden"
                  disabled={isPending || isSuccess}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isSuccess ? (
                      <motion.span
                        key="success"
                        initial={{ y: 20, opacity: 0, filter: "blur(8px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        exit={{ y: -20, opacity: 0, filter: "blur(8px)" }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex items-center gap-1.5"
                      >
                        {t("cta.sent")}
                        <IconCircleCheckFilled className="size-4" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ y: 20, opacity: 0, filter: "blur(8px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        exit={{ y: -20, opacity: 0, filter: "blur(8px)" }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex items-center gap-1.5"
                      >
                        {t("cta.button")}
                        {isPending ? <Spinner /> : <IconSend />}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </InputGroupAddon>
            </InputGroup>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}
