import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { salesInvoiceUpdateSchema } from "@/schemas/sales-invoices";
import {
  getSalesInvoiceById,
  updateSalesInvoice,
  deleteSalesInvoice,
} from "@/lib/sales-invoice";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const salesInvoice = await getSalesInvoiceById(Number(params.id));

    if (!salesInvoice) {
      return handleError("Sales Invoice not found", 404);
    }

    return NextResponse.json(salesInvoice);
  } catch (error) {
    console.error("Error fetching sales invoice:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, salesInvoiceUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedSalesInvoice = await updateSalesInvoice(Number(params.id), {
      invoiceNumber: validation.data?.invoiceNumber,
      invoiceDate: validation.data?.invoiceDate,
      dueDate: validation.data?.dueDate,
      totalAmount: validation.data?.totalAmount,
      status: validation.data?.status,
      customerId: validation.data?.customerId,
      submittedById: validation.data?.submittedById,
      currency: validation.data?.currency,
      taxAmount: validation.data?.taxAmount || null,
    });
    return NextResponse.json(updatedSalesInvoice);
  } catch (error) {
    console.error("Error updating sales invoice:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteSalesInvoice(Number(params.id));
    return NextResponse.json({ message: "Sales Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting sales invoice:", error);
    return handleError("Internal Server Error", 500);
  }
}
