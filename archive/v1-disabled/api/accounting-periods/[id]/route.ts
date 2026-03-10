import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { accountingPeriodSchemaUpdate } from "@/schemas/accounting-periods";
import {
  getAccountingPeriodById,
  updateAccountingPeriod,
  deleteAccountingPeriod,
} from "@/lib/accounting-period";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const period = await getAccountingPeriodById(parseInt(params.id));

    if (!period) {
      return handleError("Accounting period not found", 404);
    }

    return NextResponse.json(period);
  } catch (error) {
    console.error("Error fetching accounting period:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, accountingPeriodSchemaUpdate);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedPeriod = await updateAccountingPeriod(parseInt(params.id), {
      periodName: validation.data?.periodName,
      startDate: validation.data?.startDate,
      endDate: validation.data?.endDate,
      isClosed: validation.data?.isClosed,
    });

    return NextResponse.json(updatedPeriod);
  } catch (error) {
    console.error("Error updating accounting period:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedPeriod = await deleteAccountingPeriod(parseInt(params.id));

    return NextResponse.json(deletedPeriod);
  } catch (error) {
    console.error("Error deleting accounting period:", error);
    return handleError("Internal Server Error", 500);
  }
}
