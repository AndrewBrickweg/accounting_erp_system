import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { bankReconciliationSchema } from "@/schemas/bank-reconciliations";
import {
  getBankReconciliationById,
  updateBankReconciliation,
  deleteBankReconciliation,
} from "@/lib/bank-reconciliations";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bankReconciliation = await getBankReconciliationById(
      parseInt(params.id)
    );

    if (!bankReconciliation) {
      return handleError("Bank Reconciliation not found", 404);
    }

    return NextResponse.json(bankReconciliation);
  } catch (error) {
    console.error("Error fetching bank reconciliation: ", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, bankReconciliationSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedBankReconciliation = await updateBankReconciliation(
      parseInt(params.id),
      {
        bankAccountId: validation.data?.bankAccountId,
        statementStartDate: validation.data?.statementStartDate,
        statementEndDate: validation.data?.statementEndDate,
        status: validation.data?.status,
        notes: validation.data?.notes || null,
        completedById: validation.data?.completedById || null,
      }
    );

    return NextResponse.json(updatedBankReconciliation);
  } catch (error) {
    console.error("Error updating bank reconciliation:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedBankReconciliation = await deleteBankReconciliation(
      parseInt(params.id)
    );

    if (!deletedBankReconciliation) {
      return handleError("Bank Reconciliation not found", 404);
    }

    return NextResponse.json(deletedBankReconciliation);
  } catch (error) {
    console.error("Error deleting bank reconciliation:", error);
    return handleError("Internal Server Error", 500);
  }
}
