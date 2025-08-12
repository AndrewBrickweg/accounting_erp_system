import { z } from "zod";

//need to update prisma schema to include line items
export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  totalAmount: z.number().positive("Total amount must be a positive number"),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
  vendorId: z.number().int().positive("Vendor ID must be a positive integer"),
  submittedById: z.string(),
  departmentId: z
    .number()
    .int()
    .positive("Department ID must be a positive integer"),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  currency: z.string().nullable(),
});

export const invoiceUpdateSchema = invoiceSchema.partial();

export const invoiceListSchema = z.array(
  z.object({
    id: z.string(),
    invoiceNumber: z.string(),
    invoiceDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    totalAmount: z.number(),
    status: z.enum(["draft", "sent", "paid", "overdue"]),
    vendorId: z.number(),
    submittedById: z.string(),
    departmentId: z.number(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    currency: z.string().nullable(),
  })
);

export const invoiceDetailSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  invoiceDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  totalAmount: z.number(),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
  vendorId: z.number(),
  submittedById: z.string(),
  departmentId: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  currency: z.string().nullable(),
});

export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceUpdate = z.infer<typeof invoiceUpdateSchema>;
export type InvoiceList = z.infer<typeof invoiceListSchema>;
export type InvoiceDetail = z.infer<typeof invoiceDetailSchema>;
