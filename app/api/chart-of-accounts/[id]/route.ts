import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { chartOfAccountSchema } from "@/schemas/chart-of-accounts";
import {
  getChartOfAccountById,
  updateChartOfAccount,
  deleteChartOfAccount,
} from "@/lib/chart-of-account";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const chartOfAccount = await getChartOfAccountById(parseInt(params.id));

    if (!chartOfAccount) {
      return handleError("Chart of Account not found", 404);
    }

    return NextResponse.json(chartOfAccount);
  } catch (error) {
    console.error("Error fetching chart of account:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, chartOfAccountSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedChartOfAccount = await updateChartOfAccount(
      parseInt(params.id),
      {
        accountNumber: validation.data?.accountNumber,
        name: validation.data?.name,
        type: validation.data?.type,
        isActive: validation.data?.isActive,
      }
    );

    return NextResponse.json(updatedChartOfAccount);
  } catch (error) {
    console.error("Error updating chart of account:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteChartOfAccount(parseInt(params.id));
    return NextResponse.json({
      message: "Chart of Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chart of account:", error);
    return handleError("Internal Server Error", 500);
  }
}
