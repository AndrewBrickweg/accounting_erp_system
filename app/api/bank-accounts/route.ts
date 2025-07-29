import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { bankAccountSchema } from "@/schemas/bank-accounts";
import {
  getBankAccountById,
  updateBankAccount,
  deleteBankAccount,
} from "@/lib/bank-account";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bankAccount = await getBankAccountById(parseInt(params.id));

    if (!bankAccount) {
      return handleError("Bank account not found", 404);
    }
    return NextResponse.json(bankAccount);
  } catch (error) {
    console.error("Error fetching bank account:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, bankAccountSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedBankAccount = await updateBankAccount(parseInt(params.id), {
      name: validation.data?.name,
      accountNumber: validation.data?.accountNumber,
      bankName: validation.data?.bankName,
      balance: validation.data?.balance,
    });

    return NextResponse.json(updatedBankAccount);
  } catch (error) {
    console.error("Error updating bank account:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedBankAccount = await deleteBankAccount(parseInt(params.id));

    if (!deletedBankAccount) {
      return handleError("Bank account not found", 404);
    }

    return NextResponse.json(deletedBankAccount);
  } catch (error) {
    console.error("Error deleting bank account:", error);
    return handleError("Internal Server Error", 500);
  }
}
