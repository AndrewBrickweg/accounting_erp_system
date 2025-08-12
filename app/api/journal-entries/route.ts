import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { journalEntrySchema } from "@/schemas/journal-entries";
import { getAllJournalEntries, createJournalEntry } from "@/lib/journal-entry";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const journalEntries = await getAllJournalEntries();

    return NextResponse.json(journalEntries);
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, journalEntrySchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }
    const { entryDate, memo, createdById, periodId, referenceNumber, source } =
      validation.data!;
    const journalEntry = await createJournalEntry({
      entryDate,
      memo: memo || null,
      createdById,
      periodId,
      referenceNumber: referenceNumber || undefined,
      source: source || undefined,
    });

    return NextResponse.json(journalEntry);
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return handleError("Internal Server Error", 500);
  }
}
