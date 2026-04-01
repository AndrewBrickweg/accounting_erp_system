import { z } from "zod";
import { decimalStringSchema } from "./common.ts";

const transactionBaseSchema = z.object({
  date: z.coerce.date().optional(),
  memo: z.string().min(1, "Memo is required").optional(),
  postedAt: z.coerce.date().nullable().optional(),
  referenceNumber: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(["draft", "posted", "void"]).optional(),
  type: z.enum(["journal", "payment", "receipt", "transfer"]),
});

function hasConsistentPostingState(data: {
  postedAt?: Date | null;
  status?: "draft" | "posted" | "void";
}) {
  if (data.status === undefined && data.postedAt === undefined) {
    return true;
  }

  if (data.status === undefined || data.postedAt === undefined) {
    return false;
  }

  return data.status === "posted"
    ? data.postedAt !== null
    : data.postedAt === null;
}

export const transactionSchema = transactionBaseSchema.refine(
  hasConsistentPostingState,
  {
    message: "status and postedAt must be updated together and remain consistent",
    path: ["postedAt"],
  }
);

export const transactionSchemaUpdate = transactionBaseSchema.partial().refine(
  hasConsistentPostingState,
  {
    message: "status and postedAt must be updated together and remain consistent",
    path: ["postedAt"],
  }
);

export const transactionDetailSchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  memo: z.string().nullable().optional(),
  postedAt: z.coerce.date().nullable().optional(),
  referenceNumber: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  status: z.enum(["draft", "posted", "void"]),
  type: z.enum(["journal", "payment", "receipt", "transfer"]),
  entries: z
    .array(
      z.object({
        id: z.number(),
        accountId: z.number(),
        amount: decimalStringSchema,
        description: z.string(),
        memo: z.string().nullable().optional(),
        departmentId: z.number().nullable().optional(),
        invoiceId: z.number().nullable().optional(),
        transactionId: z.string().nullable().optional(),
        type: z.enum(["debit", "credit"]).nullable().optional(),
        account: z.object({
          id: z.number(),
          name: z.string(),
          accountNumber: z.string(),
          type: z.enum(["asset", "liability", "equity", "revenue", "expense"]),
        }),
      })
    )
    .optional(),
});

export const transactionListSchema = z.array(
  z.object({
    id: z.string(),
    date: z.coerce.date(),
    memo: z.string().nullable().optional(),
    postedAt: z.coerce.date().nullable().optional(),
    referenceNumber: z.string().nullable().optional(),
    source: z.string().nullable().optional(),
    status: z.enum(["draft", "posted", "void"]),
    type: z.enum(["journal", "payment", "receipt", "transfer"]),
  })
);

export type TransactionInput = z.infer<typeof transactionSchema>;
export type TransactionUpdateInput = z.infer<typeof transactionSchemaUpdate>;
export type TransactionDetail = z.infer<typeof transactionDetailSchema>;
export type TransactionListItem = z.infer<typeof transactionListSchema>[number];
