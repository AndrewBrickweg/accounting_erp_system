import { z } from "zod";

export const bankTransactionSchema = z.object({
  bankAccountId: z
    .number()
    .int()
    .positive("Bank account ID must be a positive integer"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be a non-negative number"),
  createdAt: z.date().optional(),
  date: z.date().optional(),
  reference: z.string().optional(),
});

export const bankTransactionUpdateSchema = bankTransactionSchema.partial();

export const bankTransactionListSchema = z.array(
  z.object({
    id: z.number(),
    bankAccountId: z.number(),
    description: z.string(),
    amount: z.number(),
    createdAt: z.date(),
    date: z.date(),
    reference: z.string().optional(),
  })
);

export const bankTransactionDetailSchema = z.object({
  id: z.number(),
  bankAccountId: z.number(),
  description: z.string(),
  amount: z.number(),
  createdAt: z.date(),
  date: z.date(),
  reference: z.string().optional(),
});

export type BankTransactionInput = z.infer<typeof bankTransactionSchema>;
export type BankTransactionUpdateInput = z.infer<
  typeof bankTransactionUpdateSchema
>;
export type BankTransactionList = z.infer<typeof bankTransactionListSchema>;
export type BankTransactionDetail = z.infer<typeof bankTransactionDetailSchema>;
