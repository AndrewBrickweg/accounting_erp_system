import { z } from "zod";

export const accountingPeriodSchema = z
  .object({
    periodName: z.string().min(1, "Period name is required"),
    startDate: z.date().refine((date) => date <= new Date(), {
      message: "Start date cannot be in the future",
    }),
    endDate: z.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const accountingPeriodSchemaUpdate = accountingPeriodSchema.partial();

export const accountingPeriodListSchema = z.array(
  z.object({
    id: z.number(),
    periodName: z.string(),
    startDate: z.date(),
    endDate: z.date(),
  })
);

export const accountingPeriodDetailSchema = z.object({
  id: z.number(),
  periodName: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

export type AccountingPeriodInput = z.infer<typeof accountingPeriodSchema>;
export type AccountingPeriodUpdateInput = z.infer<
  typeof accountingPeriodSchemaUpdate
>;
export type AccountingPeriodList = z.infer<typeof accountingPeriodListSchema>;
export type AccountingPeriodDetail = z.infer<
  typeof accountingPeriodDetailSchema
>;
