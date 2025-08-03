import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { bankTransactionSchema } from "@/schemas/bank-transactions";
import {
  getAllBankTransactions,
  createBankTransaction,
} from "@/lib/bank-transaction";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const bankTransaction = await getAllBankTransactions();
    return NextResponse.json(bankTransaction);
  } catch (error) {
    console.error("Error fetching bank transactions:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, bankTransactionSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const { bankAccountId, description, amount, createdAt, date, reference } =
      validation.data!;

    const bankTransaction = await createBankTransaction({
      bankAccountId,
      description,
      amount,
      createdAt,
      date,
      reference,
    });

    return NextResponse.json(bankTransaction);
  } catch (error) {
    console.error("Error creating bank transaction:", error);
    return handleError("Internal Server Error", 500);
  }
}
