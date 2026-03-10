import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  transactionDetailSchema,
  transactionSchemaUpdate,
} from "@/schemas/transactions";
import {
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "@/lib/transaction";
import { handleApiError, handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transaction = await getTransactionById(id);

    if (!transaction) {
      return handleError("Transaction not found", 404);
    }

    return NextResponse.json(
      parseSchemaOrThrow(transaction, transactionDetailSchema)
    );
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return handleApiError(error, "Failed to fetch transaction");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validateSchema(body, transactionSchemaUpdate);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedTransaction = await updateTransaction(id, validation.data!);

    return NextResponse.json(
      parseSchemaOrThrow(updatedTransaction, transactionDetailSchema)
    );
  } catch (error) {
    console.error("Error updating transaction:", error);
    return handleApiError(error, "Failed to update transaction");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transaction = await getTransactionById(id);

    if (!transaction) {
      return handleError("Transaction not found", 404);
    }

    await deleteTransaction(id);

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return handleApiError(error, "Failed to delete transaction");
  }
}
