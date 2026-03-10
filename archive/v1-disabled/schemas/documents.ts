import { z } from "zod";

export const documentTypeEnum = z
  .enum(["INVOICE", "RECEIPT", "REPORT"])
  .optional();

export const documentSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  type: documentTypeEnum,
  fileSize: z.number().int().optional().nullable(),
  fileUrl: z.url(),
  uploadDate: z.coerce.date().optional(),
  invoiceId: z.number().int().optional().nullable(),
  uploadedById: z.string().optional().nullable(),
});

export const documentUpdateSchema = documentSchema.partial();

export const documentListSchema = z.array(
  z.object({
    id: z.string(),
    fileName: z.string(),
    type: documentTypeEnum,
    fileSize: z.number().int().optional().nullable(),
    fileUrl: z.url(),
    uploadDate: z.coerce.date().optional(),
    invoiceId: z.number().int().optional().nullable(),
    uploadedById: z.string().optional().nullable(),
  })
);

export const documentDetailSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  type: documentTypeEnum,
  fileSize: z.number().int().optional().nullable(),
  fileUrl: z.url(),
  uploadDate: z.coerce.date().optional(),
  invoiceId: z.number().int().optional().nullable(),
  uploadedById: z.string().optional().nullable(),
});

export type DocumentInput = z.infer<typeof documentSchema>;
export type DocumentUpdateInput = z.infer<typeof documentUpdateSchema>;
export type DocumentList = z.infer<typeof documentListSchema>;
export type DocumentDetail = z.infer<typeof documentDetailSchema>;
