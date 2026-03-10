import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { reconciledTransactionSchema } from "@/schemas/reconciled-transactions";
import {
  getAllReconciledTransactions,
  createReconciledTransaction,
} from "@/lib/reconciled-transaction";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const transactions = await getAllReconciledTransactions();

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, reconciledTransactionSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const { reconciliationId, transactionId, isMatched, matchedAt, notes } =
      validation.data!;
    const transaction = await createReconciledTransaction({
      reconciliationId,
      transactionId,
      isMatched,
      matchedAt,
      notes,
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return handleError("Internal Server Error", 500);
  }
}
