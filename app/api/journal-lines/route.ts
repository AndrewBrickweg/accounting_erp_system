import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { journalLineSchema } from "@/schemas/journal-lines";
import { getAllJournalLines, createJournalLine } from "@/lib/journal-line";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const journalLines = await getAllJournalLines();

    return NextResponse.json(journalLines);
  } catch (error) {
    console.error("Error fetching journal lines:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, journalLineSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }
    const { journalEntryId, accountId, departmentId, amount, isDebit } =
      validation.data!;
    const journalLine = await createJournalLine({
      journalEntryId,
      accountId,
      departmentId,
      amount,
      isDebit,
    });

    return NextResponse.json(journalLine);
  } catch (error) {
    console.error("Error creating journal line:", error);
    return handleError("Internal Server Error", 500);
  }
}
