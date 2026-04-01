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
} from "@/lib/gl-coding";
import {
  handleApiError,
  handleBadRequest,
  handleNotFound,
  handleValidationError,
} from "@/lib/error";

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

    const glCoding = await getGlCodingById(id);

    if (!glCoding) {
      return handleNotFound("GL Coding not found");
    }

    return NextResponse.json(parseSchemaOrThrow(glCoding, glCodingDetailSchema));
  } catch (error) {
    console.error("Error fetching GL Coding:", error);
    return handleApiError(error, "Failed to fetch GL coding");
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
    const validation = validateSchema(body, glCodingUpdateSchema);

    if (!validation.success) {
      return handleValidationError(validation.errors);
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
