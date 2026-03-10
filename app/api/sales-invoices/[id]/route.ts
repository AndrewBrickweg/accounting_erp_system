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
  deleteSalesInvoice,
} from "@/lib/sales-invoice";
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

    const salesInvoice = await getSalesInvoiceById(id);

    if (!salesInvoice) {
      return handleError("Sales Invoice not found", 404);
    }

    return NextResponse.json(
      parseSchemaOrThrow(salesInvoice, salesInvoiceDetailSchema)
    );
  } catch (error) {
    console.error("Error fetching sales invoice:", error);
    return handleApiError(error, "Failed to fetch sales invoice");
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
    const validation = validateSchema(body, salesInvoiceUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
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

    await deleteSalesInvoice(id);
    return NextResponse.json({ message: "Sales Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting sales invoice:", error);
    return handleApiError(error, "Failed to delete sales invoice");
  }
}
