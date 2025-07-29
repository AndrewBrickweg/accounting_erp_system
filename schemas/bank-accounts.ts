import { z } from "zod";

export const bankAccountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  balance: z.number().min(0, "Balance must be a non-negative number"),
});

export const bankAccountUpdateSchema = bankAccountSchema.partial();

export const bankAccountListSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    accountNumber: z.string(),
    bankName: z.string(),
    balance: z.number(),
  })
);

export const bankAccountDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  accountNumber: z.string(),
  bankName: z.string(),
  balance: z.number(),
});

export type BankAccountInput = z.infer<typeof bankAccountSchema>;
export type BankAccountUpdateInput = z.infer<typeof bankAccountUpdateSchema>;
export type BankAccountList = z.infer<typeof bankAccountListSchema>;
export type BankAccountDetail = z.infer<typeof bankAccountDetailSchema>;
