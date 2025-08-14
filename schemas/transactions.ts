import { z } from "zod";

export const transactionSchema = z.object({
  date: z.coerce.date(),
  memo: z.string().min(1, "Memo is required"),
  isPosted: z.boolean(),
  postedAt: z.coerce.date(),
  referenceNumber: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(["draft", "posted", "void"]),
  type: z.enum(["journal", "payment", "receipt", "transfer"]),
});

export const transactionSchemaUpdate = transactionSchema.partial();

export const transactionDetailSchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  memo: z.string(),
  isPosted: z.boolean(),
  postedAt: z.coerce.date().nullable().optional(),
  referenceNumber: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(["draft", "posted", "void"]),
  type: z.enum(["journal", "payment", "receipt", "transfer"]),
  entries: z.array(
    z.object({
      id: z.string(),
      accountId: z.string(),
      debit: z.number(),
      credit: z.number(),
      description: z.string().optional(),
      glAccount: z.object({
        id: z.string(),
        name: z.string(),
        code: z.string(),
      }),
    })
  ),
});

export const transactionListSchema = z.array(
  z.object({
    id: z.string(),
    date: z.coerce.date(),
    memo: z.string(),
    isPosted: z.boolean(),
    postedAt: z.coerce.date().nullable().optional(),
    referenceNumber: z.string().optional(),
    source: z.string().optional(),
    status: z.enum(["draft", "posted", "void"]),
    type: z.enum(["journal", "payment", "receipt", "transfer"]),
  })
);

export type TransactionInput = z.infer<typeof transactionSchema>;
export type TransactionUpdateInput = z.infer<typeof transactionSchemaUpdate>;
export type TransactionDetail = z.infer<typeof transactionDetailSchema>;
export type TransactionListItem = z.infer<typeof transactionListSchema>[number];
