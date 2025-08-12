import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { invoiceSchema } from "@/schemas/invoices";
import { getAllInvoices, createInvoice } from "@/lib/invoice";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const invoices = await getAllInvoices();
    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return handleError("Internal Server Error", 500);
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
      currency: currency || null,
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    return handleError("Internal Server Error", 500);
  }
}
