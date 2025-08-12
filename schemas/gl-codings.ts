import { z } from "zod";

export const glCodingSchema = z.object({
  accountId: z.number().int().positive("Account ID must be a positive integer"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be a non-negative number"),
  invoiceId: z.number().int().nullable(),
  departmentId: z.number().int().nullable(),
  createdAt: z.coerce.date(),
  memo: z.string().nullable().optional(),
  transactionId: z.string().nullable().optional(),
  type: z.enum(["debit", "credit"]),
  updatedAt: z.coerce.date(),
});

export const glCodingUpdateSchema = glCodingSchema.partial();

export const glCodingListSchema = z.array(
  z.object({
    id: z.string(),
    accountId: z.number(),
    description: z.string(),
    amount: z.number(),
    invoiceId: z.number().nullable(),
    departmentId: z.number().nullable(),
    createdAt: z.coerce.date(),
    memo: z.string().nullable().optional(),
    transactionId: z.string().nullable().optional(),
    type: z.enum(["debit", "credit"]),
    updatedAt: z.coerce.date(),
  })
);

export const glCodingDetailSchema = z.object({
  id: z.string(),
  accountId: z.number(),
  description: z.string(),
  amount: z.number(),
  invoiceId: z.number().nullable(),
  departmentId: z.number().nullable(),
  createdAt: z.coerce.date(),
  memo: z.string().nullable().optional(),
  transactionId: z.string().nullable().optional(),
  type: z.enum(["debit", "credit"]),
  updatedAt: z.coerce.date(),
});

export type GLCoding = z.infer<typeof glCodingSchema>;
export type GLCodingUpdate = z.infer<typeof glCodingUpdateSchema>;
export type GLCodingList = z.infer<typeof glCodingListSchema>;
export type GLCodingDetail = z.infer<typeof glCodingDetailSchema>;
