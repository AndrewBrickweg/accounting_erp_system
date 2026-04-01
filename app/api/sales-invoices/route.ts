import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  salesInvoiceDetailSchema,
  salesInvoiceListSchema,
  salesInvoiceSchema,
} from "@/schemas/sales-invoices";
import { getAllSalesInvoices, createSalesInvoice } from "@/lib/sales-invoice";
import { handleApiError, handleValidationError } from "@/lib/error";
import { createdJson } from "@/lib/http";

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
      return handleValidationError(validation.errors);
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

    const response = parseSchemaOrThrow(
      salesInvoice,
      salesInvoiceDetailSchema
    );
    return createdJson(request, response.id, response);
  } catch (error) {
    console.error("Error creating sales invoice:", error);
    return handleApiError(error, "Failed to create sales invoice");
  }
}
