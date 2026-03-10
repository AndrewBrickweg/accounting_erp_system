import { z } from "zod";

export const journalEntrySchema = z.object({
  entryDate: z.coerce.date(),
  memo: z.string().nullable(),
  createdById: z.string().min(1, "Created by ID is required"),
  periodId: z.number().int().positive("Period ID must be a positive integer"),
  referenceNumber: z.string().optional(),
  source: z.string().optional(),
});

export const journalEntryUpdateSchema = journalEntrySchema.partial();

export const journalEntryListSchema = z.array(
  z.object({
    id: z.string(),
    entryDate: z.coerce.date(),
    memo: z.string().nullable(),
    createdById: z.string(),
    periodId: z.number().int(),
    referenceNumber: z.string().optional(),
    source: z.string().optional(),
  })
);

export const journalEntryDetailSchema = z.object({
  id: z.string(),
  entryDate: z.coerce.date(),
  memo: z.string().nullable(),
  createdById: z.string(),
  periodId: z.number().int(),
  referenceNumber: z.string().optional(),
  source: z.string().optional(),
});

export type JournalEntry = z.infer<typeof journalEntrySchema>;
export type JournalEntryUpdate = z.infer<typeof journalEntryUpdateSchema>;
export type JournalEntryList = z.infer<typeof journalEntryListSchema>;
export type JournalEntryDetail = z.infer<typeof journalEntryDetailSchema>;
