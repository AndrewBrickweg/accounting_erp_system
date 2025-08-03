import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { bankTransactionSchema } from "@/schemas/bank-transactions";
import {
  getBankTransactionById,
  updateBankTransaction,
  deleteBankTransaction,
} from "@/lib/bank-transaction";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bankTransaction = await getBankTransactionById(parseInt(params.id));

    if (!bankTransaction) {
      return handleError("Bank transaction not found", 404);
    }

    return NextResponse.json(bankTransaction);
  } catch (error) {
    console.error("Error fetching bank transaction:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, bankTransactionSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedBankTransaction = await updateBankTransaction(
      parseInt(params.id),
      {
        bankAccountId: validation.data?.bankAccountId,
        description: validation.data?.description,
        amount: validation.data?.amount,
        createdAt: validation.data?.createdAt,
        date: validation.data?.date,
        reference: validation.data?.reference,
      }
    );

    return NextResponse.json(updatedBankTransaction);
  } catch (error) {
    console.error("Error updating bank transaction:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedBankTransaction = await deleteBankTransaction(
      parseInt(params.id)
    );

    return NextResponse.json(deletedBankTransaction);
  } catch (error) {
    console.error("Error deleting bank transaction:", error);
    return handleError("Internal Server Error", 500);
  }
}
