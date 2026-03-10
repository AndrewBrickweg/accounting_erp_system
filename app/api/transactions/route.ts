import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  transactionDetailSchema,
  transactionListSchema,
  transactionSchema,
} from "@/schemas/transactions";
import { getAllTransactions, createTransaction } from "@/lib/transaction";
import { handleApiError, handleError } from "@/lib/error";

export async function GET() {
  try {
    const transactions = await getAllTransactions();

    return NextResponse.json(
      parseSchemaOrThrow(transactions, transactionListSchema)
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return handleApiError(error, "Failed to fetch transactions");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, transactionSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const {
      date,
      memo,
      referenceNumber,
      type,
      source,
      status,
      isPosted,
      postedAt,
    } = validation.data!;

    const transaction = await createTransaction({
      date,
      memo,
      referenceNumber,
      type,
      source,
      status,
      isPosted,
      postedAt,
    });

    return NextResponse.json(
      parseSchemaOrThrow(transaction, transactionDetailSchema)
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return handleApiError(error, "Failed to create transaction");
  }
}
