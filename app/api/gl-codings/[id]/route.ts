import { NextResponse } from "next/server";
import {
  parsePositiveIntId,
  parseSchemaOrThrow,
  validateSchema,
} from "@/lib/validate";
import {
  glCodingDetailSchema,
  glCodingUpdateSchema,
} from "@/schemas/gl-codings";
import {
  getGlCodingById,
  updateGlCoding,
  deleteGlCoding,
} from "@/lib/gl-coding";
import { handleApiError, handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleError("Invalid id parameter", 400);
    }

    const glCoding = await getGlCodingById(id);

    if (!glCoding) {
      return handleError("GL Coding not found", 404);
    }

    return NextResponse.json(parseSchemaOrThrow(glCoding, glCodingDetailSchema));
  } catch (error) {
    console.error("Error fetching GL Coding:", error);
    return handleApiError(error, "Failed to fetch GL coding");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleError("Invalid id parameter", 400);
    }

    const body = await request.json();
    const validation = validateSchema(body, glCodingUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedGlCoding = await updateGlCoding(id, validation.data!);

    return NextResponse.json(
      parseSchemaOrThrow(updatedGlCoding, glCodingDetailSchema)
    );
  } catch (error) {
    console.error("Error updating GL Coding:", error);
    return handleApiError(error, "Failed to update GL coding");
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
      return handleError("Invalid id parameter", 400);
    }

    const deletedGlCoding = await deleteGlCoding(id);

    if (!deletedGlCoding) {
      return handleError("GL Coding not found", 404);
    }

    return NextResponse.json({ message: "GL Coding deleted successfully" });
  } catch (error) {
    console.error("Error deleting GL Coding:", error);
    return handleApiError(error, "Failed to delete GL coding");
  }
}
