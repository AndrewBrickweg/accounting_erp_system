import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  paymentDetailSchema,
  paymentListSchema,
  paymentSchema,
} from "@/schemas/payments";
import { getAllPayments, createPayment } from "@/lib/payments";
import { handleApiError, handleError } from "@/lib/error";

export async function GET() {
  try {
    const payments = await getAllPayments();

    return NextResponse.json(parseSchemaOrThrow(payments, paymentListSchema));
  } catch (error) {
    console.error("Error fetching payments:", error);
    return handleApiError(error, "Failed to fetch payments");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, paymentSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const { amountPaid, paymentDate, method, invoiceId, paidById } =
      validation.data!;
    const payment = await createPayment({
      amountPaid,
      paymentDate,
      method,
      invoiceId,
      paidById,
    });

    return NextResponse.json(parseSchemaOrThrow(payment, paymentDetailSchema));
  } catch (error) {
    console.error("Error creating payment:", error);
    return handleApiError(error, "Failed to create payment");
  }
}
