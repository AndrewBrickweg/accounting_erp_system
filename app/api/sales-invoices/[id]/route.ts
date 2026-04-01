import { NextResponse } from "next/server";
import {
  parsePositiveIntId,
  parseSchemaOrThrow,
  validateSchema,
} from "@/lib/validate";
import {
  salesInvoiceDetailSchema,
  salesInvoiceUpdateSchema,
} from "@/schemas/sales-invoices";
import {
  getSalesInvoiceById,
  updateSalesInvoice,
} from "@/lib/sales-invoice";
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

    const salesInvoice = await getSalesInvoiceById(id);

    if (!salesInvoice) {
      return handleNotFound("Sales Invoice not found");
    }

    return NextResponse.json(
      parseSchemaOrThrow(salesInvoice, salesInvoiceDetailSchema)
    );
  } catch (error) {
    console.error("Error fetching sales invoice:", error);
    return handleApiError(error, "Failed to fetch sales invoice");
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
    const validation = validateSchema(body, salesInvoiceUpdateSchema);

    if (!validation.success) {
      return handleValidationError(validation.errors);
    }

    const updatedSalesInvoice = await updateSalesInvoice(
      id,
      validation.data!
    );
    return NextResponse.json(
      parseSchemaOrThrow(updatedSalesInvoice, salesInvoiceDetailSchema)
    );
  } catch (error) {
    console.error("Error updating sales invoice:", error);
    return handleApiError(error, "Failed to update sales invoice");
  }
}
