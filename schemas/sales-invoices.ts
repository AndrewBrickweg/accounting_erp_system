import { z } from "zod";

export const salesInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  totalAmount: z.number().nonnegative("Total amount must be non-negative"),
  status: z.enum(["pending", "paid", "overdue"]),
  customerId: z.string().min(1, "Customer ID is required"),
  submittedById: z.string().min(1, "Submitted By ID is required"),
  currency: z.string().min(1, "Currency is required"),
  taxAmount: z
    .number()
    .nonnegative("Tax amount must be non-negative")
    .nullable()
    .optional(),
});

export const salesInvoiceUpdateSchema = salesInvoiceSchema.partial();

const salesInvoiceCustomerSchema = z.object({
  id: z.string(),
  companyName: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  email: z.string(),
  phone: z.string().nullable().optional(),
});

const salesInvoiceSubmitterSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.enum(["admin", "manager", "staff"]).optional(),
});

export const salesInvoiceListSchema = z.array(
  z.object({
    id: z.number(),
    invoiceNumber: z.string(),
    invoiceDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    totalAmount: z.number(),
    status: z.enum(["pending", "paid", "overdue"]),
    customerId: z.string(),
    submittedById: z.string(),
    customer: salesInvoiceCustomerSchema,
    submittedBy: salesInvoiceSubmitterSchema,
    createdAt: z.coerce.date(),
    currency: z.string().nullable().optional(),
    taxAmount: z.number().nullable().optional(),
    updatedAt: z.coerce.date(),
  })
);

export const salesInvoiceDetailSchema = z.object({
  id: z.number(),
  invoiceNumber: z.string(),
  invoiceDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  totalAmount: z.number(),
  status: z.enum(["pending", "paid", "overdue"]),
  customerId: z.string(),
  customer: salesInvoiceCustomerSchema,
  submittedById: z.string(),
  submittedBy: salesInvoiceSubmitterSchema,
  createdAt: z.coerce.date(),
  currency: z.string().nullable().optional(),
  taxAmount: z.number().nullable().optional(),
  updatedAt: z.coerce.date(),
});

export type SalesInvoice = z.infer<typeof salesInvoiceSchema>;
export type SalesInvoiceUpdate = z.infer<typeof salesInvoiceUpdateSchema>;
export type SalesInvoiceListItem = z.infer<typeof salesInvoiceListSchema>;
export type SalesInvoiceDetail = z.infer<typeof salesInvoiceDetailSchema>;
