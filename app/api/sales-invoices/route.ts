import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { salesInvoiceSchema } from "@/schemas/sales-invoices";
import { getAllSalesInvoices, createSalesInvoice } from "@/lib/sales-invoice";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const salesInvoices = await getAllSalesInvoices();

    return NextResponse.json(salesInvoices);
  } catch (error) {
    console.error("Error fetching sales invoices:", error);
    return handleError("Internal Server Error", 500);
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
      taxAmount: validation.data?.taxAmount || null,
    });

    return NextResponse.json(salesInvoice);
  } catch (error) {
    console.error("Error creating sales invoice:", error);
    return handleError("Internal Server Error", 500);
  }
}
