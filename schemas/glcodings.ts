import { z } from "zod";

export const glcodingSchema = z.object({
  accountId: z.number().int().positive("Account ID must be a positive integer"),
  description: z.string().min(1, "Description is required"),
  amount: z
    .number()
    .refine((val) => val !== 0, { message: "Amount must be non-zero" }),
  transactionId: z.uuid("Invalid Transaction ID format"),
  invoiceId: z
    .number()
    .int()
    .positive("Invoice ID must be a positive integer")
    .optional()
    .nullable(),
  departmentId: z
    .number()
    .int()
    .positive("Department ID must be a positive integer")
    .optional()
    .nullable(),
});
