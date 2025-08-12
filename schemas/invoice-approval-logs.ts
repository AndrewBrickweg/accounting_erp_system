import { z } from "zod";

export const invoiceApprovalLogSchema = z.object({
  approvalOrder: z.number().int(),
  approvalDate: z.coerce.date(),
  status: z.enum(["APPROVED", "REJECTED"]),
  comments: z.string().nullable(),
  createdAt: z.coerce.date(),
  invoiceId: z.number().int(),
  approvedById: z.uuid(),
});

export const invoiceApprovalLogUpdateSchema =
  invoiceApprovalLogSchema.partial();

export const invoiceApprovalLogListSchema = z.array(
  z.object({
    id: z.number().int(),
    approvalOrder: z.number().int(),
    approvalDate: z.coerce.date(),
    status: z.enum(["APPROVED", "REJECTED"]),
    comments: z.string().nullable(),
    createdAt: z.coerce.date(),
    invoiceId: z.number().int(),
    approvedBy: z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.email("Invalid email address"),
    }),
  })
);

export const invoiceApprovalLogDetailSchema = z.object({
  id: z.number().int(),
  approvalOrder: z.number().int(),
  approvalDate: z.coerce.date(),
  status: z.enum(["APPROVED", "REJECTED"]),
  comments: z.string().nullable(),
  createdAt: z.coerce.date(),
  invoiceId: z.number().int(),
  approvedById: z.uuid(),
  approvedBy: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.email("Invalid email address"),
    role: z.enum(["admin", "manager", "staff"]),
    departmentId: z.string().nullable(),
    isActive: z.boolean().optional(),
    terminatedAt: z.date().nullable().optional(),
  }),
});

export type InvoiceApprovalLog = z.infer<typeof invoiceApprovalLogSchema>;
export type InvoiceApprovalLogUpdate = z.infer<
  typeof invoiceApprovalLogUpdateSchema
>;
export type InvoiceApprovalLogDetail = z.infer<
  typeof invoiceApprovalLogDetailSchema
>;
export type InvoiceApprovalLogList = z.infer<
  typeof invoiceApprovalLogListSchema
>;
