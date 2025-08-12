import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { invoiceUpdateSchema } from "@/schemas/invoices";
import { getInvoiceById, updateInvoice, deleteInvoice } from "@/lib/invoice";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    const invoice = await getInvoiceById(Number(params.id));

    if (!invoice) {
      return handleError("Invoice not found", 404);
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, invoiceUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedInvoice = await updateInvoice(parseInt(params.id), {
      invoiceNumber: validation.data?.invoiceNumber,
      invoiceDate: validation.data?.invoiceDate,
      dueDate: validation.data?.dueDate,
      totalAmount: validation.data?.totalAmount,
      status: validation.data?.status,
      vendorId: validation.data?.vendorId,
      submittedById: validation.data?.submittedById,
      departmentId: validation.data?.departmentId,
      currency: validation.data?.currency || null,
    });

    if (!updatedInvoice) {
      return handleError("Failed to update invoice", 500);
    }

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await deleteInvoice(Number(params.id));

    if (!invoice) {
      return handleError("Invoice not found", 404);
    }

    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return handleError("Internal Server Error", 500);
  }
}
