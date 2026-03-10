import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  glCodingDetailSchema,
  glCodingListSchema,
  glCodingSchema,
} from "@/schemas/gl-codings";
import { getAllGlCodings, createGlCoding } from "@/lib/gl-coding";
import { handleApiError, handleError } from "@/lib/error";

export async function GET() {
  try {
    const glCodings = await getAllGlCodings();

    return NextResponse.json(parseSchemaOrThrow(glCodings, glCodingListSchema));
  } catch (error) {
    console.error("Error fetching GL Codings:", error);
    return handleApiError(error, "Failed to fetch GL codings");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, glCodingSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }
    const {
      accountId,
      amount,
      type,
      description,
      invoiceId,
      departmentId,
      memo,
      transactionId,
    } = validation.data!;
    const glCoding = await createGlCoding({
      accountId,
      amount,
      type,
      description,
      invoiceId,
      departmentId,
      memo,
      transactionId,
    });

    return NextResponse.json(parseSchemaOrThrow(glCoding, glCodingDetailSchema));
  } catch (error) {
    console.error("Error creating GL Coding:", error);
    return handleApiError(error, "Failed to create GL coding");
  }
}
