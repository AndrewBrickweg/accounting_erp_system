import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { journalLineUpdateSchema } from "@/schemas/journal-lines";
import {
  getJournalLineById,
  updateJournalLine,
  deleteJournalLine,
} from "@/lib/journal-line";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const journalLine = await getJournalLineById(parseInt(params.id));

    if (!journalLine) {
      return handleError("Journal Line not found", 404);
    }

    return NextResponse.json(journalLine);
  } catch (error) {
    console.error("Error fetching journal line:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, journalLineUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedJournalLine = await updateJournalLine(parseInt(params.id), {
      journalEntryId: validation.data?.journalEntryId,
      accountId: validation.data?.accountId,
      departmentId: validation.data?.departmentId,
      amount: validation.data?.amount,
      isDebit: validation.data?.isDebit,
    });

    return NextResponse.json(updatedJournalLine);
  } catch (error) {
    console.error("Error updating journal line:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteJournalLine(parseInt(params.id));

    if (!deleted) {
      return handleError("Journal Line not found", 404);
    }

    return NextResponse.json({ message: "Journal Line deleted successfully" });
  } catch (error) {
    console.error("Error deleting journal line:", error);
    return handleError("Internal Server Error", 500);
  }
}
