import { NextResponse } from "next/server";
import {
  parsePositiveIntId,
  parseSchemaOrThrow,
  validateSchema,
} from "@/lib/validate";
import { paymentDetailSchema, paymentUpdateSchema } from "@/schemas/payments";
import { getPaymentById, updatePayment } from "@/lib/payments";
import {
  handleApiError,
  handleBadRequest,
  handleNotFound,
  handleValidationError,
} from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleBadRequest("Invalid id parameter");
    }

    const payment = await getPaymentById(id);

    if (!payment) {
      return handleNotFound("Payment not found");
    }

    return NextResponse.json(parseSchemaOrThrow(payment, paymentDetailSchema));
  } catch (error) {
    console.error("Error fetching payment:", error);
    return handleApiError(error, "Failed to fetch payment");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleBadRequest("Invalid id parameter");
    }

    const body = await request.json();
    const validation = validateSchema(body, paymentUpdateSchema);

    if (!validation.success) {
      return handleValidationError(validation.errors);
    }

    const updatedPayment = await updatePayment(id, validation.data!);
    return NextResponse.json(parseSchemaOrThrow(updatedPayment, paymentDetailSchema));
  } catch (error) {
    console.error("Error updating payment:", error);
    return handleApiError(error, "Failed to update payment");
  }
}
