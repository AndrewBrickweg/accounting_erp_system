import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { glCodingSchema } from "@/schemas/gl-codings";
import { getAllGlCodings, createGlCoding } from "@/lib/gl-coding";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const glCodings = await getAllGlCodings();

    return NextResponse.json(glCodings);
  } catch (error) {
    console.error("Error fetching GL Codings:", error);
    return handleError("Internal Server Error", 500);
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

    return NextResponse.json(glCoding);
  } catch (error) {
    console.error("Error creating GL Coding:", error);
    return handleError("Internal Server Error", 500);
  }
}
