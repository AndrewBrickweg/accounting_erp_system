import { NextResponse } from "next/server";
import {
  parsePositiveIntId,
  parseSchemaOrThrow,
  validateSchema,
} from "@/lib/validate";
import { invoiceDetailSchema, invoiceUpdateSchema } from "@/schemas/invoices";
import { getInvoiceById, updateInvoice, deleteInvoice } from "@/lib/invoice";
import { handleApiError, handleError } from "@/lib/error";

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
      return handleError("Invalid id parameter", 400);
    }

    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return handleError("Invoice not found", 404);
    }

    return NextResponse.json(parseSchemaOrThrow(invoice, invoiceDetailSchema));
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return handleApiError(error, "Failed to fetch invoice");
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
    const validation = validateSchema(body, invoiceUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedInvoice = await updateInvoice(id, validation.data!);

    return NextResponse.json(parseSchemaOrThrow(updatedInvoice, invoiceDetailSchema));
  } catch (error) {
    console.error("Error updating invoice:", error);
    return handleApiError(error, "Failed to update invoice");
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

    const invoice = await deleteInvoice(id);

    if (!invoice) {
      return handleError("Invoice not found", 404);
    }

    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return handleApiError(error, "Failed to delete invoice");
  }
}
