import { z } from "zod";
import {
  decimalStringSchema,
  positiveMoneySchema,
} from "./common.ts";

const invoiceBaseSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  totalAmount: positiveMoneySchema("Total amount"),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
  vendorId: z.number().int().positive("Vendor ID must be a positive integer"),
  submittedById: z.string(),
  departmentId: z
    .number()
    .int()
    .positive("Department ID must be a positive integer"),
  currency: z.string().nullable().optional(),
});

export const invoiceSchema = invoiceBaseSchema.refine(
  ({ invoiceDate, dueDate }) => dueDate >= invoiceDate,
  {
    message: "Due date must be on or after invoice date",
    path: ["dueDate"],
  }
);

export const invoiceUpdateSchema = invoiceBaseSchema.partial().refine(
  ({ invoiceDate, dueDate }) =>
    invoiceDate === undefined ||
    dueDate === undefined ||
    dueDate >= invoiceDate,
  {
    message: "Due date must be on or after invoice date",
    path: ["dueDate"],
  }
);

export const invoiceListSchema = z.array(
  z.object({
    id: z.number(),
    invoiceNumber: z.string(),
    invoiceDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    totalAmount: decimalStringSchema,
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
  id: z.number(),
  invoiceNumber: z.string(),
  invoiceDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  totalAmount: decimalStringSchema,
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
