import { z } from "zod";

export const reconciliationStatusEnum = z.enum([
  "PENDING",
  "RECONCILED",
  "FLAGGED",
  "IN_PROGRESS",
  "COMPLETED",
  "ERROR",
]);

export const bankReconciliationSchema = z.object({
  bankAccountId: z.number().int(),
  statementStartDate: z.date(),
  statementEndDate: z.date(),
  openingBalance: z.number(),
  reconciledBalance: z.number(),
  difference: z.number().nullable().optional(),
  status: reconciliationStatusEnum,
  notes: z.string().nullable().optional(),
  completedById: z.number().int().nullable().optional(),
  completedAt: z.date().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const bankReconciliationUpdateSchema = bankReconciliationSchema
  .partial()
  .extend({
    id: z.number().int(),
  });

export const bankReconciliationListSchema = z.array(
  bankReconciliationSchema.extend({
    id: z.number().int(),
    bankAccount: z.object({
      id: z.number().int(),
      name: z.string(),
    }),
    completedBy: z
      .object({
        id: z.number().int(),
        firstName: z.string(),
        lastName: z.string(),
      })
      .nullable()
      .optional(),
  })
);

export const bankReconciliationDetailSchema = bankReconciliationSchema.extend({
  id: z.number().int(),
  bankAccount: z.object({
    id: z.number().int(),
    name: z.string(),
  }),
  completedBy: z
    .object({
      id: z.number().int(),
      firstName: z.string(),
      lastName: z.string(),
    })
    .nullable()
    .optional(),
});

export type BankReconciliationInput = z.infer<typeof bankReconciliationSchema>;
export type BankReconciliationUpdateInput = z.infer<
  typeof bankReconciliationUpdateSchema
>;
export type BankReconciliationList = z.infer<
  typeof bankReconciliationListSchema
>;
export type BankReconciliationDetail = z.infer<
  typeof bankReconciliationDetailSchema
>;
export type BankReconciliationStatus = z.infer<typeof reconciliationStatusEnum>;
