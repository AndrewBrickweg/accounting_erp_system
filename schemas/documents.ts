import { z } from "zod";

export const documentSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileUrl: z.url("Invalid file URL"),
  uploadDate: z.date().optional(),
  invoiceId: z.number().int().optional().nullable(),
  uploadedById: z.number().int().optional().nullable(),
});

export const documentUpdateSchema = documentSchema.partial();

export const documentListSchema = z.array(
  z.object({
    id: z.number(),
    fileName: z.string(),
    fileUrl: z.string(),
    uploadDate: z.date().optional(),
    invoiceId: z.number().int().optional().nullable(),
    uploadedById: z.number().int().optional().nullable(),
  })
);

export const documentDetailSchema = z.object({
  id: z.number(),
  fileName: z.string(),
  fileUrl: z.string(),
  uploadDate: z.date().optional(),
  invoiceId: z.number().int().optional().nullable(),
  uploadedById: z.number().int().optional().nullable(),
});
