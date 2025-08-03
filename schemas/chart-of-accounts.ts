import { z } from "zod";

export const chartOfAccountSchema = z.object({
  accountNumber: z.string().min(1, "Account number is required"),
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["asset", "liability", "equity", "revenue", "expense"]),
  isActive: z.boolean().default(true),
});

export const chartOfAccountUpdateSchema = chartOfAccountSchema.partial();

export const chartOfAccountListSchema = z.array(
  z.object({
    id: z.number(),
    accountNumber: z.string(),
    name: z.string(),
    type: z.string(),
    isActive: z.boolean(),
  })
);

export const chartOfAccountDetailSchema = z.object({
  id: z.number(),
  accountNumber: z.string(),
  name: z.string(),
  type: z.enum(["asset", "liability", "equity", "revenue", "expense"]),
  isActive: z.boolean(),
});

export type ChartOfAccountInput = z.infer<typeof chartOfAccountSchema>;
export type ChartOfAccountUpdateInput = z.infer<
  typeof chartOfAccountUpdateSchema
>;
export type ChartOfAccountList = z.infer<typeof chartOfAccountListSchema>;
export type ChartOfAccountDetail = z.infer<typeof chartOfAccountDetailSchema>;
