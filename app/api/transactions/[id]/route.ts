import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  transactionDetailSchema,
  transactionSchemaUpdate,
} from "@/schemas/transactions";
import {
  getTransactionById,
  updateTransaction,
} from "@/lib/transaction";
import {
  handleApiError,
  handleNotFound,
  handleValidationError,
} from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transaction = await getTransactionById(id);

    if (!transaction) {
      return handleNotFound("Transaction not found");
    }

    return NextResponse.json(
      parseSchemaOrThrow(transaction, transactionDetailSchema)
    );
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return handleApiError(error, "Failed to fetch transaction");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validateSchema(body, transactionSchemaUpdate);

    if (!validation.success) {
      return handleValidationError(validation.errors);
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
