import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { invoiceApprovalLogSchema } from "@/schemas/invoice-approval-logs";
import {
  getAllInvoiceApprovalLogs,
  createInvoiceApprovalLog,
} from "@/lib/invoice-approval-log";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const logs = await getAllInvoiceApprovalLogs();
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching invoice approval logs:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, invoiceApprovalLogSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const {
      approvalOrder,
      approvalDate,
      status,
      comments,
      invoiceId,
      approvedById,
    } = validation.data!;

    const log = await createInvoiceApprovalLog({
      approvalOrder,
      approvalDate,
      status,
      comments: comments || null,
      invoiceId,
      approvedById,
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error creating invoice approval log:", error);
    return handleError("Internal Server Error", 500);
  }
}
