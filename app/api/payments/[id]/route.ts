import { NextResponse } from "next/server";
import {
  parsePositiveIntId,
  parseSchemaOrThrow,
  validateSchema,
} from "@/lib/validate";
import { paymentDetailSchema, paymentUpdateSchema } from "@/schemas/payments";
import { getPaymentById, updatePayment, deletePayment } from "@/lib/payments";
import { handleApiError, handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleError("Invalid id parameter", 400);
    }

    const payment = await getPaymentById(id);

    if (!payment) {
      return handleError("Payment not found", 404);
    }

    return NextResponse.json(parseSchemaOrThrow(payment, paymentDetailSchema));
  } catch (error) {
    console.error("Error fetching payment:", error);
    return handleApiError(error, "Failed to fetch payment");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleError("Invalid id parameter", 400);
    }

    const body = await request.json();
    const validation = validateSchema(body, paymentUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedPayment = await updatePayment(id, validation.data!);
    return NextResponse.json(parseSchemaOrThrow(updatedPayment, paymentDetailSchema));
  } catch (error) {
    console.error("Error updating payment:", error);
    return handleApiError(error, "Failed to update payment");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleError("Invalid id parameter", 400);
    }

    await deletePayment(id);

    return NextResponse.json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return handleApiError(error, "Failed to delete payment");
  }
}
