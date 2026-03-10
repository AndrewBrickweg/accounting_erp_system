import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  invoiceDetailSchema,
  invoiceListSchema,
  invoiceSchema,
} from "@/schemas/invoices";
import { getAllInvoices, createInvoice } from "@/lib/invoice";
import { handleApiError, handleError } from "@/lib/error";

export async function GET() {
  try {
    const invoices = await getAllInvoices();
    return NextResponse.json(parseSchemaOrThrow(invoices, invoiceListSchema));
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return handleApiError(error, "Failed to fetch invoices");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, invoiceSchema);

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
      vendorId,
      submittedById,
      departmentId,
      currency,
    } = validation.data!;

    const invoice = await createInvoice({
      invoiceNumber,
      invoiceDate,
      dueDate,
      totalAmount,
      status,
      vendorId,
      submittedById,
      departmentId,
      currency: currency ?? null,
    });

    return NextResponse.json(parseSchemaOrThrow(invoice, invoiceDetailSchema));
  } catch (error) {
    console.error("Error creating invoice:", error);
    return handleApiError(error, "Failed to create invoice");
  }
}
