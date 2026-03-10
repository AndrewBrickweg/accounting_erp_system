import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  chartOfAccountDetailSchema,
  chartOfAccountListSchema,
  chartOfAccountSchema,
} from "@/schemas/chart-of-accounts";
import {
  getAllChartOfAccounts,
  createChartOfAccount,
} from "@/lib/chart-of-account";
import { handleApiError, handleError } from "@/lib/error";

export async function GET() {
  try {
    const chartOfAccounts = await getAllChartOfAccounts();
    return NextResponse.json(
      parseSchemaOrThrow(chartOfAccounts, chartOfAccountListSchema)
    );
  } catch (error) {
    console.error("Error fetching chart of accounts:", error);
    return handleApiError(error, "Failed to fetch chart of accounts");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, chartOfAccountSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const { accountNumber, name, type, isActive } = validation.data!;
    const chartOfAccount = await createChartOfAccount({
      accountNumber,
      name,
      type,
      isActive: isActive ?? true,
    });

    return NextResponse.json(
      parseSchemaOrThrow(chartOfAccount, chartOfAccountDetailSchema)
    );
  } catch (error) {
    console.error("Error creating chart of account:", error);
    return handleApiError(error, "Failed to create chart of account");
  }
}
