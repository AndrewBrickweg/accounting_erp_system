import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { bankAccountSchema } from "@/schemas/bank-accounts";
import { getAllBankAccounts, createBankAccount } from "@/lib/bank-account";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const bankAccounts = await getAllBankAccounts();
    return NextResponse.json(bankAccounts);
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, bankAccountSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const { name, accountNumber, bankName, balance } = validation.data!;
    const bankAccount = await createBankAccount({
      name,
      accountNumber,
      bankName,
      balance,
    });

    return NextResponse.json(bankAccount);
  } catch (error) {
    console.error("Error creating bank account:", error);
    return handleError("Internal Server Error", 500);
  }
}
