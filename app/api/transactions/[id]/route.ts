import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { transactionSchemaUpdate } from "@/schemas/transactions";
import {
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "@/lib/transaction";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const transaction = await getTransactionById(params.id);

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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, transactionSchemaUpdate);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedTransaction = await updateTransaction(params.id, {
      date: validation.data?.date,
      memo: validation.data?.memo,
      referenceNumber: validation.data?.referenceNumber,
      type: validation.data?.type,
      source: validation.data?.source,
      status: validation.data?.status,
      isPosted: validation.data?.isPosted,
      postedAt: validation.data?.postedAt || null,
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const transaction = await getTransactionById(params.id);

    if (!transaction) {
      return handleError("Transaction not found", 404);
    }

    await deleteTransaction(params.id);

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return handleError("Internal Server Error", 500);
  }
}
