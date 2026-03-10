import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { bankReconciliationSchema } from "@/schemas/bank-reconciliations";
import {
  getAllBankReconciliations,
  createBankReconciliation,
} from "@/lib/bank-reconciliation";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const bankReconciliations = await getAllBankReconciliations();

    return NextResponse.json(bankReconciliations);
  } catch (error) {
    console.error("Error fetching bank reconciliations:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, bankReconciliationSchema);

    if (!validation.success) {
      return handleError(" Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const {
      bankAccountId,
      statementStartDate,
      statementEndDate,
      status,
      notes,
      completedById,
    } = validation.data!;
    const bankReconciliation = await createBankReconciliation({
      bankAccountId,
      statementStartDate,
      statementEndDate,
      status,
      notes: notes || null,
      completedById: completedById || null,
    });

    return NextResponse.json(bankReconciliation);
  } catch (error) {
    console.error("Error creating bank reconciliation:", error);
    return handleError("Internal Server Error", 500);
  }
}
