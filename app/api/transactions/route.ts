import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { transactionSchema } from "@/schemas/transactions";
import { getAllTransactions, createTransaction } from "@/lib/transaction";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const transactions = await getAllTransactions();

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return handleError("Internal Server Error", 500);
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

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return handleError("Internal Server Error", 500);
  }
}
