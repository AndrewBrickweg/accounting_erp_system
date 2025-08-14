import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { reconciledTransactionSchemaUpdate } from "@/schemas/reconciled-transactions";
import {
  getReconciledTransactionById,
  updateReconciledTransaction,
  deleteReconciledTransaction,
} from "@/lib/reconciled-transaction";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const transaction = await getReconciledTransactionById(params.id);
    if (!transaction) {
      return handleError("Transaction not found", 404);
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, reconciledTransactionSchemaUpdate);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedTransaction = await updateReconciledTransaction(params.id, {
      reconciliationId: validation.data?.reconciliationId,
      transactionId: validation.data?.transactionId,
      isMatched: validation.data?.isMatched,
      matchedAt: validation.data?.matchedAt,
      notes: validation.data?.notes,
    });
    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    await deleteReconciledTransaction(params.id);

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return handleError("Internal Server Error", 500);
  }
}
