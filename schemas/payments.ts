import { z } from "zod";

export const paymentSchema = z.object({
  amountPaid: z.number().positive("Amount paid must be a positive number"),
  paymentDate: z.date("Payment date must be a valid date"),
  method: z.enum(["credit_card", "ach", "wire", "check"], {
    message: "Payment method must be one of: credit_card, ach, wire, check",
  }),
  invoiceId: z.number().int().positive("Invoice ID must be a positive integer"),
  paidById: z.string().min(1, "Paid by ID is required"),
});

export const paymentUpdateSchema = paymentSchema.partial();

export const paymentDetailSchema = z.object({
  id: z.string(),
  amountPaid: z.number(),
  paymentDate: z.date(),
  method: z.enum(["credit_card", "ach", "wire", "check"]),
  invoiceId: z.number(),
  paidById: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const paymentListSchema = z.array(
  z.object({
    id: z.string(),
    amountPaid: z.number(),
    paymentDate: z.date(),
    method: z.enum(["credit_card", "ach", "wire", "check"]),
    invoiceId: z.number(),
    paidById: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
);

export type Payment = z.infer<typeof paymentSchema>;
export type PaymentUpdate = z.infer<typeof paymentUpdateSchema>;
export type PaymentDetail = z.infer<typeof paymentDetailSchema>;
export type PaymentList = z.infer<typeof paymentListSchema>;
