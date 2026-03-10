import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  salesInvoiceDetailSchema,
  salesInvoiceListSchema,
  salesInvoiceSchema,
} from "@/schemas/sales-invoices";
import { getAllSalesInvoices, createSalesInvoice } from "@/lib/sales-invoice";
import { handleApiError, handleError } from "@/lib/error";

export async function GET() {
  try {
    const salesInvoices = await getAllSalesInvoices();

    return NextResponse.json(
      parseSchemaOrThrow(salesInvoices, salesInvoiceListSchema)
    );
  } catch (error) {
    console.error("Error fetching sales invoices:", error);
    return handleApiError(error, "Failed to fetch sales invoices");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, salesInvoiceSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      totalAmount,
      status,
      customerId,
      submittedById,
      currency,
    } = validation.data!;

    const salesInvoice = await createSalesInvoice({
      invoiceNumber,
      invoiceDate,
      dueDate,
      totalAmount,
      status,
      customerId,
      submittedById,
      currency,
      taxAmount: validation.data?.taxAmount ?? null,
    });

    return NextResponse.json(
      parseSchemaOrThrow(salesInvoice, salesInvoiceDetailSchema)
    );
  } catch (error) {
    console.error("Error creating sales invoice:", error);
    return handleApiError(error, "Failed to create sales invoice");
  }
}
