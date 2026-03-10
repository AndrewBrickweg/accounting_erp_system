import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { invoiceApprovalLogSchema } from "@/schemas/invoice-approval-logs";
import {
  getInvoiceApprovalLogById,
  updateInvoiceApprovalLog,
  deleteInvoiceApprovalLog,
} from "@/lib/invoice-approval-log";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const log = await getInvoiceApprovalLogById(Number(params.id));

    if (!log) {
      return handleError("Invoice Approval Log not found", 404);
    }

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error fetching invoice approval log:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, invoiceApprovalLogSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedLog = await updateInvoiceApprovalLog(Number(params.id), {
      approvalOrder: validation.data?.approvalOrder,
      approvalDate: validation.data?.approvalDate,
      status: validation.data?.status,
      comments: validation.data?.comments || null,
      invoiceId: validation.data?.invoiceId,
      approvedById: validation.data?.approvedById,
    });

    return NextResponse.json(updatedLog);
  } catch (error) {
    console.error("Error updating invoice approval log:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedLog = await deleteInvoiceApprovalLog(Number(params.id));

    return NextResponse.json(deletedLog);
  } catch (error) {
    console.error("Error deleting invoice approval log:", error);
    return handleError("Internal Server Error", 500);
  }
}
