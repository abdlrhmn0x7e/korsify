"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

import {
  IconBrush,
  IconCreditCard,
  IconUser,
  IconSubmarine,
} from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile } from "./profile";
import { Doc } from "@/convex/_generated/dataModel";
import { Branding } from "./branding";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Payment } from "./payment";
import { RESERVED_SUBDOMAINS } from "@/lib/subdomain";
import { Domain } from "./domain";
import { SettingsFormValues } from "./types";

export function SettingsForm({
  teacher,
  onSubmit,
}: {
  teacher: Doc<"teachers">;
  onSubmit: (values: SettingsFormValues) => void;
}) {
  const settingsFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.email({ message: "Invalid email" }),
    phone: z.string().min(1, { message: "Phone is required" }),
    branding: z.object({
      logoStorageId: z.string().optional(),
      coverStorageId: z.string().optional(),
      primaryColor: z.string().optional(),
    }),
    paymentInfo: z.object({
      vodafoneCash: z.string().optional(),
      instaPay: z.string().optional(),
      instructions: z.string().optional(),
    }),
    subdomain: z
      .string()
      .min(1, { message: "Subdomain is required" })
      .min(3, { message: "Subdomain must be at least 3 characters long" })
      .max(63, { message: "Subdomain must be less than 64 characters long" })
      .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, {
        message:
          "Subdomain can only contain lowercase letters, numbers, and hyphens",
      })
      .refine((val) => !RESERVED_SUBDOMAINS.has(val), {
        message: "Subdomain is reserved",
      }),
  });
  type SettingsFormValues = z.infer<typeof settingsFormSchema>;

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone ?? "",
      branding: {
        logoStorageId: teacher.branding?.logoStorageId,
        coverStorageId: teacher.branding?.coverStorageId,
        primaryColor: teacher.branding?.primaryColor,
      },
      paymentInfo: {
        vodafoneCash: teacher.paymentInfo?.vodafoneCash,
        instaPay: teacher.paymentInfo?.instaPay,
        instructions: teacher.paymentInfo?.instructions,
      },
      subdomain: teacher.subdomain,
    },
  });

  return (
    <FormProvider {...form}>
      <form
        id="settings-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full"
      >
        <ScrollArea className="h-full space-y-4 pe-4 pb-4">
          <Tabs orientation="vertical" className="gap-3">
            <TabsList className="min-h-32 gap-1 sticky top-0">
              <TabsTrigger value="profile">
                <IconUser />
                Profile
              </TabsTrigger>
              <TabsTrigger value="branding">
                <IconBrush />
                Branding
              </TabsTrigger>
              <TabsTrigger value="payment">
                <IconCreditCard />
                Payment
              </TabsTrigger>
              <TabsTrigger value="subdomain">
                <IconSubmarine />
                Subdomain
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" keepMounted>
              <Profile />
            </TabsContent>
            <TabsContent value="branding" keepMounted>
              <Branding />
            </TabsContent>
            <TabsContent value="payment" keepMounted>
              <Payment />
            </TabsContent>
            <TabsContent value="subdomain" keepMounted>
              <Domain />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </form>
    </FormProvider>
  );
}
