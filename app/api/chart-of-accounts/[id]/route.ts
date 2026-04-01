import { NextResponse } from "next/server";
import {
  parsePositiveIntId,
  parseSchemaOrThrow,
  validateSchema,
} from "@/lib/validate";
import {
  chartOfAccountDetailSchema,
  chartOfAccountUpdateSchema,
} from "@/schemas/chart-of-accounts";
import {
  getChartOfAccountById,
  updateChartOfAccount,
  deleteChartOfAccount,
} from "@/lib/chart-of-account";
import {
  handleApiError,
  handleBadRequest,
  handleNotFound,
  handleValidationError,
} from "@/lib/error";
import { noContent } from "@/lib/http";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleBadRequest("Invalid id parameter");
    }

    const chartOfAccount = await getChartOfAccountById(id);

    if (!chartOfAccount) {
      return handleNotFound("Chart of Account not found");
    }

    return NextResponse.json(
      parseSchemaOrThrow(chartOfAccount, chartOfAccountDetailSchema)
    );
  } catch (error) {
    console.error("Error fetching chart of account:", error);
    return handleApiError(error, "Failed to fetch chart of account");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleBadRequest("Invalid id parameter");
    }

    const body = await request.json();
    const validation = validateSchema(body, chartOfAccountUpdateSchema);

    if (!validation.success) {
      return handleValidationError(validation.errors);
    }

    const updatedChartOfAccount = await updateChartOfAccount(id, validation.data!);

    return NextResponse.json(
      parseSchemaOrThrow(updatedChartOfAccount, chartOfAccountDetailSchema)
    );
  } catch (error) {
    console.error("Error updating chart of account:", error);
    return handleApiError(error, "Failed to update chart of account");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleBadRequest("Invalid id parameter");
    }

    await deleteChartOfAccount(id);
    return noContent();
  } catch (error) {
    console.error("Error deleting chart of account:", error);
    return handleApiError(error, "Failed to delete chart of account");
  }
}
