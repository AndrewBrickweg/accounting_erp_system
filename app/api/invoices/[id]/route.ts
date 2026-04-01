import { NextResponse } from "next/server";
import {
  parsePositiveIntId,
  parseSchemaOrThrow,
  validateSchema,
} from "@/lib/validate";
import { invoiceDetailSchema, invoiceUpdateSchema } from "@/schemas/invoices";
import { getInvoiceById, updateInvoice } from "@/lib/invoice";
import {
  handleApiError,
  handleBadRequest,
  handleNotFound,
  handleValidationError,
} from "@/lib/error";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleBadRequest("Invalid id parameter");
    }

    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return handleNotFound("Invoice not found");
    }

    return NextResponse.json(parseSchemaOrThrow(invoice, invoiceDetailSchema));
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return handleApiError(error, "Failed to fetch invoice");
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
    const validation = validateSchema(body, invoiceUpdateSchema);

    if (!validation.success) {
      return handleValidationError(validation.errors);
    }

    const updatedInvoice = await updateInvoice(id, validation.data!);

    return NextResponse.json(parseSchemaOrThrow(updatedInvoice, invoiceDetailSchema));
  } catch (error) {
    console.error("Error updating invoice:", error);
    return handleApiError(error, "Failed to update invoice");
  }
}
