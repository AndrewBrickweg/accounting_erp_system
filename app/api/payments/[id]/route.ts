import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { paymentUpdateSchema } from "@/schemas/payments";
import { getPaymentById, updatePayment, deletePayment } from "@/lib/payments";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payment = await getPaymentById(Number(params.id));

    if (!payment) {
      return handleError("Payment not found", 404);
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, paymentUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedPayment = await updatePayment(Number(params.id), {
      amountPaid: validation.data?.amountPaid,
      paymentDate: validation.data?.paymentDate,
      method: validation.data?.method,
      invoiceId: validation.data?.invoiceId,
      paidById: validation.data?.paidById,
    });
    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error("Error updating payment:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deletePayment(Number(params.id));

    return NextResponse.json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return handleError("Internal Server Error", 500);
  }
}
