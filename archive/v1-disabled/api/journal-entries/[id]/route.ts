import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { journalEntryUpdateSchema } from "@/schemas/journal-entries";
import {
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/lib/journal-entry";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const journalEntry = await getJournalEntryById(Number(params.id));

    if (!journalEntry) {
      return handleError("Journal entry not found", 404);
    }

    return NextResponse.json(journalEntry);
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, journalEntryUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedJournalEntry = await updateJournalEntry(Number(params.id), {
      entryDate: validation.data?.entryDate,
      memo: validation.data?.memo || null,
      createdById: validation.data?.createdById,
      periodId: validation.data?.periodId,
      referenceNumber: validation.data?.referenceNumber || undefined,
      source: validation.data?.source || undefined,
    });

    return NextResponse.json(updatedJournalEntry);
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteJournalEntry(Number(params.id));
    return NextResponse.json({ message: "Journal entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return handleError("Internal Server Error", 500);
  }
}
