import { z } from "zod";

export const salesInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  totalAmount: z.number().nonnegative("Total amount must be non-negative"),
  status: z.enum(["pending", "paid", "overdue"]),
  customerId: z.string().min(1, "Customer ID is required"),
  submittedById: z.string().min(1, "Submitted By ID is required"),
  createdAt: z.coerce.date(),
  currency: z.string().min(1, "Currency is required"),
  taxAmount: z
    .number()
    .nonnegative("Tax amount must be non-negative")
    .optional(),
  updatedAt: z.coerce.date(),
});

export const salesInvoiceUpdateSchema = salesInvoiceSchema.partial();

export const salesInvoiceListSchema = z.array(
  z.object({
    id: z.string(),
    invoiceNumber: z.string(),
    invoiceDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    totalAmount: z.number(),
    status: z.enum(["pending", "paid", "overdue"]),
    customer: z.object({
      id: z.string(),
      name: z.string(),
    }),
    submittedBy: z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    }),
    createdAt: z.coerce.date(),
    currency: z.string(),
    taxAmount: z.number().optional(),
    updatedAt: z.coerce.date(),
  })
);

export const salesInvoiceDetailSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  invoiceDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  totalAmount: z.number(),
  status: z.enum(["pending", "paid", "overdue"]),
  customerId: z.string(),
  customer: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  submittedById: z.string(),
  submittedBy: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().optional(),
  }),
  createdAt: z.coerce.date(),
  currency: z.string(),
  taxAmount: z.number().optional(),
  updatedAt: z.coerce.date(),
});

export type SalesInvoice = z.infer<typeof salesInvoiceSchema>;
export type SalesInvoiceUpdate = z.infer<typeof salesInvoiceUpdateSchema>;
export type SalesInvoiceListItem = z.infer<typeof salesInvoiceListSchema>;
export type SalesInvoiceDetail = z.infer<typeof salesInvoiceDetailSchema>;
