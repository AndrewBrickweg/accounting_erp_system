import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { accountingPeriodSchema } from "@/schemas/accounting-periods";
import {
  getAllAccountingPeriods,
  createAccountingPeriod,
} from "@/lib/accounting-period";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const periods = await getAllAccountingPeriods();

    return NextResponse.json(periods);
  } catch (error) {
    console.error("Error fetching accounting periods:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, accountingPeriodSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const { periodName, startDate, endDate, isClosed } = validation.data!;
    const period = await createAccountingPeriod({
      periodName,
      startDate,
      endDate,
      isClosed,
    });

    return NextResponse.json(period);
  } catch (error) {
    console.error("Error creating accounting period:", error);
    return handleError("Internal Server Error", 500);
  }
}
