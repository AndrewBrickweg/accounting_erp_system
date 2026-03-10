import { z } from "zod";

export const reconciledTransactionSchema = z.object({
  reconciliationId: z.number().int().positive(),
  transactionId: z.number().int().positive(),
  isMatched: z.boolean(),
  matchedAt: z.coerce.date(),
  notes: z.string().max(1000).optional(),
});

export const reconciledTransactionSchemaUpdate =
  reconciledTransactionSchema.partial();

export const reconciledTransactionSchemaDetail = z.object({
  id: z.number().int().positive(),
  reconciliationId: z.number().int().positive(),
  transactionId: z.number().int().positive(),
  isMatched: z.boolean(),
  matchedAt: z.coerce.date(),
  notes: z.string().max(1000).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const reconciledTransactionListSchema = z.array(
  z.object({
    id: z.number().int().positive(),
    reconciliationId: z.number().int().positive(),
    transactionId: z.number().int().positive(),
    isMatched: z.boolean(),
    matchedAt: z.coerce.date(),
    notes: z.string().max(1000).optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
);

export type ReconciledTransaction = z.infer<typeof reconciledTransactionSchema>;
export type ReconciledTransactionUpdate = z.infer<
  typeof reconciledTransactionSchemaUpdate
>;
export type ReconciledTransactionDetail = z.infer<
  typeof reconciledTransactionSchemaDetail
>;
export type ReconciledTransactionList = z.infer<
  typeof reconciledTransactionListSchema
>;
