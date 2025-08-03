import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { chartOfAccountSchema } from "@/schemas/chart-of-accounts";
import {
  getAllChartOfAccounts,
  createChartOfAccount,
} from "@/lib/chart-of-account";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const chartOfAccounts = await getAllChartOfAccounts();
    return NextResponse.json(chartOfAccounts);
  } catch (error) {
    console.error("Error fetching chart of accounts:", error);
    return handleError("Internal Server Error", 500);
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

    return NextResponse.json(chartOfAccount);
  } catch (error) {
    console.error("Error creating chart of account:", error);
    return handleError("Internal Server Error", 500);
  }
}
