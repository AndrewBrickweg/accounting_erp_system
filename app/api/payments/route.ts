import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { paymentSchema } from "@/schemas/payments";
import { getAllPayments, createPayment } from "@/lib/payments";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const payments = await getAllPayments();

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return handleError("Internal Server Error", 500);
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

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error creating payment:", error);
    return handleError("Internal Server Error", 500);
  }
}
