import { GenericMutationCtx } from "convex/server";
import { DataModel, Id } from "../../_generated/dataModel";
import { Infer } from "convex/values";
import {
  brandingValidator,
  paymentInfoValidator,
  teacherStatusValidator,
} from "./validators";

type Branding = Infer<typeof brandingValidator>;
type PaymentInfo = Infer<typeof paymentInfoValidator>;
type TeacherStatus = Infer<typeof teacherStatusValidator>;

export type CreateTeacherData = {
  userId: string;
  name: string;
  email: string;
  subdomain: string;
  phone?: string;
  branding?: Branding;
  paymentInfo?: PaymentInfo;
  status?: TeacherStatus;
};

export async function create(
  ctx: GenericMutationCtx<DataModel>,
  data: CreateTeacherData
): Promise<Id<"teachers">> {
  const now = Date.now();

  return ctx.db.insert("teachers", {
    userId: data.userId,
    name: data.name,
    email: data.email,
    subdomain: data.subdomain,
    phone: data.phone,
    branding: data.branding,
    paymentInfo: data.paymentInfo,
    status: data.status ?? "pending",
    createdAt: now,
    updatedAt: now,
  });
}

export type UpdateTeacherData = {
  name?: string;
  phone?: string;
  email?: string;
};

export async function update(
  ctx: GenericMutationCtx<DataModel>,
  teacherId: Id<"teachers">,
  data: UpdateTeacherData
): Promise<void> {
  await ctx.db.patch(teacherId, {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function updateBranding(
  ctx: GenericMutationCtx<DataModel>,
  teacherId: Id<"teachers">,
  branding: Branding
): Promise<void> {
  await ctx.db.patch(teacherId, {
    branding,
    updatedAt: Date.now(),
  });
}

export async function updatePaymentInfo(
  ctx: GenericMutationCtx<DataModel>,
  teacherId: Id<"teachers">,
  paymentInfo: PaymentInfo
): Promise<void> {
  await ctx.db.patch(teacherId, {
    paymentInfo,
    updatedAt: Date.now(),
  });
}

export async function updateStatus(
  ctx: GenericMutationCtx<DataModel>,
  teacherId: Id<"teachers">,
  status: TeacherStatus
): Promise<void> {
  await ctx.db.patch(teacherId, {
    status,
    updatedAt: Date.now(),
  });
}

export async function updateSubdomain(
  ctx: GenericMutationCtx<DataModel>,
  teacherId: Id<"teachers">,
  subdomain: string
): Promise<void> {
  await ctx.db.patch(teacherId, {
    subdomain,
    updatedAt: Date.now(),
  });
}

export async function updateCustomDomain(
  ctx: GenericMutationCtx<DataModel>,
  teacherId: Id<"teachers">,
  customDomain: string | undefined,
  verified: boolean = false
): Promise<void> {
  await ctx.db.patch(teacherId, {
    customDomain,
    customDomainVerified: verified,
    updatedAt: Date.now(),
  });
}

export async function remove(
  ctx: GenericMutationCtx<DataModel>,
  teacherId: Id<"teachers">
): Promise<void> {
  await ctx.db.delete(teacherId);
}
