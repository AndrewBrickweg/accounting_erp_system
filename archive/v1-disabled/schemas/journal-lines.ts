import { z } from "zod";

export const journalLineSchema = z.object({
  journalEntryId: z
    .number()
    .int()
    .positive("Journal Entry ID must be a positive integer"),
  accountId: z.number().int().positive("Account ID must be a positive integer"),
  departmentId: z
    .number()
    .int()
    .positive("Department ID must be a positive integer"),
  amount: z
    .number()
    .refine((val) => val !== 0, { message: "Amount must be non-zero" }),
  isDebit: z.boolean(),
});

export const journalLineUpdateSchema = journalLineSchema.partial();

export const journalLineListSchema = z.array(
  z.object({
    id: z.string(),
    journalEntryId: z.number(),
    accountId: z.number(),
    departmentId: z.number(),
    amount: z.number(),
    isDebit: z.boolean(),
  })
);

export const journalLineDetailSchema = z.object({
  id: z.string(),
  journalEntryId: z.number(),
  accountId: z.number(),
  departmentId: z.number(),
  amount: z.number(),
  isDebit: z.boolean(),
});

export type JournalLine = z.infer<typeof journalLineSchema>;
export type JournalLineUpdate = z.infer<typeof journalLineUpdateSchema>;
export type JournalLineDetail = z.infer<typeof journalLineDetailSchema>;
export type JournalLineList = z.infer<typeof journalLineListSchema>;
